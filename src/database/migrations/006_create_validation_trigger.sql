CREATE OR REPLACE FUNCTION fn_validar_cancelamento_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_status_anterior VARCHAR(20);
BEGIN
    IF NEW.status = 'CANCELADO' THEN
        SELECT status INTO v_status_anterior
        FROM pedido
        WHERE pedido_id = NEW.pedido_id;

        IF v_status_anterior IN ('ENTREGUE', 'PAGO') THEN
            RAISE EXCEPTION 'Não é possível cancelar pedido com status %', v_status_anterior;
        END IF;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$;

DROP TRIGGER IF EXISTS trg_validar_cancelamento ON pedido;

CREATE TRIGGER trg_validar_cancelamento
    BEFORE UPDATE OF status ON pedido
    FOR EACH ROW
    EXECUTE FUNCTION fn_validar_cancelamento_pedido();

