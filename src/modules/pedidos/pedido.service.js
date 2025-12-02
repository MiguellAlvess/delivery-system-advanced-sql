import pedidoRepository from "./pedido.repository.js";
import produtoRepository from "../produtos/produto.repository.js";
import { ValidationError, NotFoundError } from "../../errors/AppError.js";

class PedidoService {
  async listarTodos() {
    return await pedidoRepository.findAll();
  }

  async buscarPorId(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do pedido inválido");
    }
    const pedido = await pedidoRepository.findById(parseInt(id));
    if (!pedido) {
      throw new NotFoundError("Pedido");
    }
    return pedido;
  }

  async criar(dados) {
    const { cliente_id, itens, status, observacoes } = dados;
    if (!cliente_id || isNaN(cliente_id)) {
      throw new ValidationError(
        "cliente_id é obrigatório e deve ser um número válido"
      );
    }
    const clienteExiste = await pedidoRepository.clienteExists(
      parseInt(cliente_id)
    );
    if (!clienteExiste) {
      throw new NotFoundError("Cliente");
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new ValidationError("Pedido deve conter ao menos um item");
    }
    this.validarItens(itens);
    await this.verificarProdutosExistem(itens);
    const statusValido = status || "ABERTO";
    const statusPermitidos = [
      "ABERTO",
      "PAGO",
      "EM_ENTREGA",
      "ENTREGUE",
      "CANCELADO",
    ];
    if (!statusPermitidos.includes(statusValido)) {
      throw new ValidationError(
        `Status inválido. Valores permitidos: ${statusPermitidos.join(", ")}`
      );
    }
    const pedido = await pedidoRepository.create(
      parseInt(cliente_id),
      statusValido,
      observacoes || null
    );

    for (const item of itens) {
      await pedidoRepository.addItem(
        pedido.pedido_id,
        item.produto_id,
        item.quantidade
      );
    }
    return await pedidoRepository.findById(pedido.pedido_id);
  }

  async atualizar(id, dados) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do pedido inválido");
    }

    const pedidoExistente = await pedidoRepository.findById(parseInt(id));
    if (!pedidoExistente) {
      throw new NotFoundError("Pedido");
    }
    const { itens } = dados;
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new ValidationError("Pedido deve conter ao menos um item");
    }
    this.validarItens(itens);
    await this.verificarProdutosExistem(itens);

    await pedidoRepository.clearItems(parseInt(id));

    for (const item of itens) {
      await pedidoRepository.addItem(
        parseInt(id),
        item.produto_id,
        item.quantidade
      );
    }

    return await pedidoRepository.findById(parseInt(id));
  }

  async deletar(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do pedido inválido");
    }
    const pedido = await pedidoRepository.findById(parseInt(id));
    if (!pedido) {
      throw new NotFoundError("Pedido");
    }
    return await pedidoRepository.delete(parseInt(id));
  }

  validarItens(itens) {
    for (const item of itens) {
      if (!item.produto_id || isNaN(item.produto_id)) {
        throw new ValidationError(
          "produto_id é obrigatório e deve ser um número válido"
        );
      }
      if (
        !item.quantidade ||
        isNaN(item.quantidade) ||
        parseInt(item.quantidade) <= 0
      ) {
        throw new ValidationError(
          "quantidade é obrigatória e deve ser maior que zero"
        );
      }
    }
  }

  async verificarProdutosExistem(itens) {
    const produtoIds = [
      ...new Set(itens.map((item) => parseInt(item.produto_id))),
    ];
    for (const produtoId of produtoIds) {
      const produto = await produtoRepository.findById(produtoId);
      if (!produto) {
        throw new NotFoundError(`Produto com ID ${produtoId}`);
      }
    }
  }

  async processarPedidoCompleto(dados) {
    const { cliente_id, itens, status, observacoes } = dados;
    if (!cliente_id || isNaN(cliente_id)) {
      throw new ValidationError(
        "cliente_id é obrigatório e deve ser um número válido"
      );
    }
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new ValidationError("Pedido deve conter ao menos um item");
    }
    const resultado = await pedidoRepository.processarPedidoCompleto(
      parseInt(cliente_id),
      status || "ABERTO",
      observacoes || null,
      itens
    );
    return await pedidoRepository.findById(resultado.pedido_id);
  }

  async calcularTotalPedido(id) {
    if (!id || isNaN(id)) {
      throw new ValidationError("ID do pedido inválido");
    }
    const pedido = await pedidoRepository.findById(parseInt(id));
    if (!pedido) {
      throw new NotFoundError("Pedido");
    }
    const total = await pedidoRepository.calcularTotalPedido(parseInt(id));
    return { pedido_id: parseInt(id), total };
  }

  async verificarEstoque(produtoId) {
    if (!produtoId || isNaN(produtoId)) {
      throw new ValidationError("ID do produto inválido");
    }
    const produto = await produtoRepository.findById(parseInt(produtoId));
    if (!produto) {
      throw new NotFoundError("Produto");
    }
    const quantidade = await pedidoRepository.verificarEstoqueDisponivel(
      parseInt(produtoId)
    );
    return {
      produto_id: parseInt(produtoId),
      quantidade_disponivel: quantidade,
    };
  }
}

export default new PedidoService();
