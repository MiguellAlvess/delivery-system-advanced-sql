import pedidoService from "./pedido.service.js";

class PedidoController {
  async listar(req, res, next) {
    try {
      const pedidos = await pedidoService.listarTodos();
      return res.json(pedidos);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.buscarPorId(id);
      return res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async criar(req, res, next) {
    try {
      const pedido = await pedidoService.criar(req.body);
      return res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.atualizar(id, req.body);
      return res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const { id } = req.params;
      await pedidoService.deletar(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async processarPedidoCompleto(req, res, next) {
    try {
      const pedido = await pedidoService.processarPedidoCompleto(req.body);
      return res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async calcularTotal(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await pedidoService.calcularTotalPedido(id);
      return res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async verificarEstoque(req, res, next) {
    try {
      const { produto_id } = req.params;
      const resultado = await pedidoService.verificarEstoque(produto_id);
      return res.json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export default new PedidoController();
