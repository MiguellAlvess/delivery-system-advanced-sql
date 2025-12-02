CREATE OR REPLACE FUNCTION fn_definir_preco_unitario_item()
RETURNS TRIGGER AS $$
DECLARE
    preco_produto NUMERIC(10,2);
BEGIN
    SELECT preco INTO preco_produto
    FROM produto
    WHERE produto_id = NEW.produto_id;
    
    NEW.preco_unitario := preco_produto;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_atualizar_atualizado_em_pedido()
RETURNS TRIGGER AS $$
DECLARE
    pedido_id_var BIGINT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        pedido_id_var := OLD.pedido_id;
    ELSE
        pedido_id_var := NEW.pedido_id;
    END IF;
    
    UPDATE pedido
    SET atualizado_em = NOW()
    WHERE pedido_id = pedido_id_var;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;
