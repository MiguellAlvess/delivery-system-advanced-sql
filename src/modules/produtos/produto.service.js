import produtoRepository from "./produto.repository.js";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
} from "../../errors/AppError.js";

class ProdutoService {
  async listarTodos() {
    return await produtoRepository.findAll();
  }

  async buscarPorId(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do produto inválido");
    }

    const produto = await produtoRepository.findById(parseInt(id));

    if (!produto) {
      throw new NotFoundError("Produto");
    }

    return produto;
  }

  async criar(dados) {
    this.validarDados(dados);
    
    const categoriaExiste = await produtoRepository.categoriaExists(dados.categoria_id);
    if (!categoriaExiste) {
      throw new NotFoundError("Categoria");
    }

    const produtoExistente = await produtoRepository.findByNome(dados.nome);
    if (produtoExistente) {
      throw new ConflictError("Já existe um produto com este nome");
    }

    return await produtoRepository.create(dados);
  }

  async atualizar(id, dados) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do produto inválido");
    }
    const produtoExistente = await produtoRepository.findById(parseInt(id));
    if (!produtoExistente) {
      throw new NotFoundError("Produto");
    }
    this.validarDados(dados);

    const categoriaExiste = await produtoRepository.categoriaExists(dados.categoria_id);
    if (!categoriaExiste) {
      throw new NotFoundError("Categoria");
    }

    if (dados.nome !== produtoExistente.nome) {
      const produtoComMesmoNome = await produtoRepository.findByNome(
        dados.nome
      );
      if (produtoComMesmoNome) {
        throw new ConflictError("Já existe um produto com este nome");
      }
    }

    return await produtoRepository.update(parseInt(id), dados);
  }

  async deletar(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do produto inválido");
    }
    const produto = await produtoRepository.findById(parseInt(id));
    if (!produto) {
      throw new NotFoundError("Produto");
    }
    const pedidoRepository = (await import("../pedidos/pedido.repository.js"))
      .default;
    const emUso = await pedidoRepository.produtoEmUso(parseInt(id));

    if (emUso) {
      throw new ConflictError(
        "Não é possível deletar produto que está em uso em pedidos"
      );
    }

    return await produtoRepository.delete(parseInt(id));
  }

  validarDados(dados) {
    if (!dados.categoria_id || isNaN(dados.categoria_id)) {
      throw new ValidationError("categoria_id é obrigatório e deve ser um número válido");
    }

    if (
      !dados.nome ||
      typeof dados.nome !== "string" ||
      dados.nome.trim().length === 0
    ) {
      throw new ValidationError("Nome do produto é obrigatório");
    }

    if (dados.nome.length > 120) {
      throw new ValidationError(
        "Nome do produto deve ter no máximo 120 caracteres"
      );
    }

    if (dados.descricao && dados.descricao.length > 255) {
      throw new ValidationError(
        "Descrição do produto deve ter no máximo 255 caracteres"
      );
    }

    if (!dados.preco || isNaN(dados.preco) || parseFloat(dados.preco) <= 0) {
      throw new ValidationError(
        "Preço do produto é obrigatório e deve ser maior que zero"
      );
    }

    if (parseFloat(dados.preco) > 99999999.99) {
      throw new ValidationError(
        "Preço do produto excede o valor máximo permitido"
      );
    }
  }
}

export default new ProdutoService();
