CREATE OR REPLACE FUNCTION fn_calcular_total_pedido(p_pedido_id BIGINT)
RETURNS NUMERIC(12,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total NUMERIC(12,2);
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO v_total
    FROM item_pedido
    WHERE pedido_id = p_pedido_id;

    RETURN v_total;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END;
$$;

CREATE OR REPLACE FUNCTION fn_verificar_estoque_disponivel(p_produto_id BIGINT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_quantidade INTEGER;
    v_produto_ativo BOOLEAN;
BEGIN
    SELECT ativo INTO v_produto_ativo
    FROM produto
    WHERE produto_id = p_produto_id;

    IF NOT v_produto_ativo THEN
        RETURN -1;
    END IF;

    SELECT COALESCE(quantidade, 0) INTO v_quantidade
    FROM estoque
    WHERE produto_id = p_produto_id;

    RETURN COALESCE(v_quantidade, 0);
EXCEPTION
    WHEN OTHERS THEN
        RETURN -1;
END;
$$;

