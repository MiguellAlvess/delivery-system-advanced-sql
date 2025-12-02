import pool from "../../config/database.js";

class ProdutoRepository {
  async findAll() {
    const result = await pool.query(
      `SELECT p.*, c.nome as categoria_nome 
       FROM produto p 
       JOIN categoria c ON p.categoria_id = c.categoria_id 
       ORDER BY p.criado_em DESC`
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT p.*, c.nome as categoria_nome 
       FROM produto p 
       JOIN categoria c ON p.categoria_id = c.categoria_id 
       WHERE p.produto_id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async findByNome(nome) {
    const result = await pool.query(
      "SELECT * FROM produto WHERE nome = $1",
      [nome]
    );
    return result.rows[0];
  }

  async create(produto) {
    const { categoria_id, nome, descricao, preco, ativo } = produto;
    const result = await pool.query(
      `INSERT INTO produto (categoria_id, nome, descricao, preco, ativo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [categoria_id, nome, descricao || null, preco, ativo !== undefined ? ativo : true]
    );
    return result.rows[0];
  }

  async update(id, produto) {
    const { categoria_id, nome, descricao, preco, ativo } = produto;
    const result = await pool.query(
      `UPDATE produto
       SET categoria_id = $1, nome = $2, descricao = $3, preco = $4, ativo = $5
       WHERE produto_id = $6
       RETURNING *`,
      [categoria_id, nome, descricao || null, preco, ativo !== undefined ? ativo : true, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM produto WHERE produto_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  async exists(id) {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM produto WHERE produto_id = $1)",
      [id]
    );
    return result.rows[0].exists;
  }

  async categoriaExists(categoriaId) {
    const result = await pool.query(
      "SELECT EXISTS(SELECT 1 FROM categoria WHERE categoria_id = $1)",
      [categoriaId]
    );
    return result.rows[0].exists;
  }
}

export default new ProdutoRepository();
