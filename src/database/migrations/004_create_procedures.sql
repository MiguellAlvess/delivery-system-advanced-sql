CREATE OR REPLACE PROCEDURE prc_processar_pedido_completo(
    p_cliente_id BIGINT,
    p_status VARCHAR(20),
    p_observacoes VARCHAR(255),
    p_itens JSONB,
    OUT p_pedido_id BIGINT,
    OUT p_mensagem VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    item JSONB;
    v_produto_id BIGINT;
    v_quantidade INTEGER;
    v_produto_existe BOOLEAN;
    v_produto_ativo BOOLEAN;
    v_estoque_disponivel INTEGER;
BEGIN
    p_pedido_id := NULL;
    p_mensagem := '';

    IF p_itens IS NULL OR jsonb_array_length(p_itens) = 0 THEN
        RAISE EXCEPTION 'Pedido deve conter ao menos um item';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM cliente WHERE cliente_id = p_cliente_id) THEN
        RAISE EXCEPTION 'Cliente não encontrado';
    END IF;

    FOR item IN SELECT * FROM jsonb_array_elements(p_itens)
    LOOP
        v_produto_id := (item->>'produto_id')::BIGINT;
        v_quantidade := (item->>'quantidade')::INTEGER;

        SELECT EXISTS(SELECT 1 FROM produto WHERE produto_id = v_produto_id) INTO v_produto_existe;
        IF NOT v_produto_existe THEN
            RAISE EXCEPTION 'Produto com ID % não encontrado', v_produto_id;
        END IF;

        SELECT ativo INTO v_produto_ativo FROM produto WHERE produto_id = v_produto_id;
        IF NOT v_produto_ativo THEN
            RAISE EXCEPTION 'Produto com ID % está inativo', v_produto_id;
        END IF;

        SELECT COALESCE(quantidade, 0) INTO v_estoque_disponivel 
        FROM estoque 
        WHERE produto_id = v_produto_id;

        IF v_estoque_disponivel < v_quantidade THEN
            RAISE EXCEPTION 'Estoque insuficiente para produto ID %. Disponível: %, Solicitado: %', 
                v_produto_id, v_estoque_disponivel, v_quantidade;
        END IF;
    END LOOP;

    INSERT INTO pedido (cliente_id, status, observacoes)
    VALUES (p_cliente_id, COALESCE(p_status, 'ABERTO'), p_observacoes)
    RETURNING pedido_id INTO p_pedido_id;

    FOR item IN SELECT * FROM jsonb_array_elements(p_itens)
    LOOP
        v_produto_id := (item->>'produto_id')::BIGINT;
        v_quantidade := (item->>'quantidade')::INTEGER;

        INSERT INTO item_pedido (pedido_id, produto_id, quantidade)
        VALUES (p_pedido_id, v_produto_id, v_quantidade);

        UPDATE estoque
        SET quantidade = quantidade - v_quantidade,
            atualizado_em = NOW()
        WHERE produto_id = v_produto_id;

        INSERT INTO auditoria_estoque (produto_id, quantidade, motivo)
        VALUES (v_produto_id, -v_quantidade, 'Venda - Pedido ' || p_pedido_id);
    END LOOP;

    p_mensagem := 'Pedido processado com sucesso';
EXCEPTION
    WHEN OTHERS THEN
        p_mensagem := 'Erro ao processar pedido: ' || SQLERRM;
        RAISE;
END;
$$;

CREATE OR REPLACE FUNCTION fn_processar_pedido_completo(
    p_cliente_id BIGINT,
    p_status VARCHAR(20),
    p_observacoes VARCHAR(255),
    p_itens JSONB
)
RETURNS TABLE(pedido_id BIGINT, mensagem VARCHAR(255))
LANGUAGE plpgsql
AS $$
DECLARE
    v_pedido_id BIGINT;
    v_mensagem VARCHAR(255);
BEGIN
    CALL prc_processar_pedido_completo(p_cliente_id, p_status, p_observacoes, p_itens, v_pedido_id, v_mensagem);
    RETURN QUERY SELECT v_pedido_id, v_mensagem;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

