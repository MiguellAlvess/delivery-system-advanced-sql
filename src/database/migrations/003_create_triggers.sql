DROP TRIGGER IF EXISTS trg_definir_preco_unitario ON item_pedido;

CREATE TRIGGER trg_definir_preco_unitario
    BEFORE INSERT OR UPDATE ON item_pedido
    FOR EACH ROW
    EXECUTE FUNCTION fn_definir_preco_unitario_item();

DROP TRIGGER IF EXISTS trg_atualizar_pedido_insert ON item_pedido;
DROP TRIGGER IF EXISTS trg_atualizar_pedido_update ON item_pedido;
DROP TRIGGER IF EXISTS trg_atualizar_pedido_delete ON item_pedido;

CREATE TRIGGER trg_atualizar_pedido_insert
    AFTER INSERT ON item_pedido
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualizar_atualizado_em_pedido();

CREATE TRIGGER trg_atualizar_pedido_update
    AFTER UPDATE ON item_pedido
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualizar_atualizado_em_pedido();

CREATE TRIGGER trg_atualizar_pedido_delete
    AFTER DELETE ON item_pedido
    FOR EACH ROW
    EXECUTE FUNCTION fn_atualizar_atualizado_em_pedido();
