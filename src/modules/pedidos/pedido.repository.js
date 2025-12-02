import pool from "../../config/database.js";

class PedidoRepository {
  async findAll() {
    const result = await pool.query(
      `SELECT 
        p.pedido_id,
        p.cliente_id,
        p.status,
        p.aberto_em,
        p.atualizado_em,
        p.observacoes,
        c.nome as cliente_nome,
        COALESCE(
          json_agg(
            json_build_object(
              'item_pedido_id', i.item_pedido_id,
              'produto_id', i.produto_id,
              'nome', pr.nome,
              'quantidade', i.quantidade,
              'preco_unitario', i.preco_unitario,
              'total', i.total
            )
          ) FILTER (WHERE i.item_pedido_id IS NOT NULL),
          '[]'::json
        ) as itens
      FROM pedido p
      JOIN cliente c ON p.cliente_id = c.cliente_id
      LEFT JOIN item_pedido i ON p.pedido_id = i.pedido_id
      LEFT JOIN produto pr ON i.produto_id = pr.produto_id
      GROUP BY p.pedido_id, p.cliente_id, p.status, p.aberto_em, p.atualizado_em, p.observacoes, c.nome
      ORDER BY p.aberto_em DESC`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT 
        p.pedido_id,
        p.cliente_id,
        p.status,
        p.aberto_em,
        p.atualizado_em,
        p.observacoes,
        c.nome as cliente_nome,
        COALESCE(
          json_agg(
            json_build_object(
              'item_pedido_id', i.item_pedido_id,
              'produto_id', i.produto_id,
              'nome', pr.nome,
              'quantidade', i.quantidade,
              'preco_unitario', i.preco_unitario,
              'total', i.total
            )
          ) FILTER (WHERE i.item_pedido_id IS NOT NULL),
          '[]'::json
        ) as itens
      FROM pedido p
      JOIN cliente c ON p.cliente_id = c.cliente_id
      LEFT JOIN item_pedido i ON p.pedido_id = i.pedido_id
      LEFT JOIN produto pr ON i.produto_id = pr.produto_id
      WHERE p.pedido_id = $1
      GROUP BY p.pedido_id, p.cliente_id, p.status, p.aberto_em, p.atualizado_em, p.observacoes, c.nome`,
      [id]
    );
    return result.rows[0];
  }

  async create(clienteId, status, observacoes) {
    const result = await pool.query(
      `INSERT INTO pedido (cliente_id, status, observacoes)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [clienteId, status || 'ABERTO', observacoes || null]
    );
    return result.rows[0];
  }

  async addItem(pedidoId, produtoId, quantidade) {
    const result = await pool.query(
      `INSERT INTO item_pedido (pedido_id, produto_id, quantidade)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [pedidoId, produtoId, quantidade]
    );
    return result.rows[0];
  }

  async clearItems(pedidoId) {
    await pool.query("DELETE FROM item_pedido WHERE pedido_id = $1", [
      pedidoId,
    ]);
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM pedido WHERE pedido_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  async produtoEmUso(produtoId) {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM item_pedido WHERE produto_id = $1)",
      [produtoId]
    );
    return result.rows[0].exists;
  }

  async clienteExists(clienteId) {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM cliente WHERE cliente_id = $1)",
      [clienteId]
    );
    return result.rows[0].exists;
  }

  async processarPedidoCompleto(clienteId, status, observacoes, itens) {
    const itensJson = JSON.stringify(itens);
    const result = await pool.query(
      `SELECT * FROM fn_processar_pedido_completo($1, $2, $3, $4::jsonb)`,
      [clienteId, status, observacoes, itensJson]
    );
    return {
      pedido_id: result.rows[0].pedido_id,
      mensagem: result.rows[0].mensagem
    };
  }

  async calcularTotalPedido(pedidoId) {
    const result = await pool.query(
      "SELECT fn_calcular_total_pedido($1) as total",
      [pedidoId]
    );
    return parseFloat(result.rows[0].total);
  }

  async verificarEstoqueDisponivel(produtoId) {
    const result = await pool.query(
      "SELECT fn_verificar_estoque_disponivel($1) as quantidade",
      [produtoId]
    );
    return parseInt(result.rows[0].quantidade);
  }
}

export default new PedidoRepository();
