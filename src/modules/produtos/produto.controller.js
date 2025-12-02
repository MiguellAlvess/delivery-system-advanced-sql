import produtoService from './produto.service.js';

class ProdutoController {
    async listar(req, res, next) {
        try {
            const produtos = await produtoService.listarTodos();
            return res.json(produtos);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            const produto = await produtoService.buscarPorId(id);
            return res.json(produto);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const produto = await produtoService.criar(req.body);
            return res.status(201).json(produto);
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const produto = await produtoService.atualizar(id, req.body);
            return res.json(produto);
        } catch (error) {
            next(error);
        }
    }

    async deletar(req, res, next) {
        try {
            const { id } = req.params;
            await produtoService.deletar(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new ProdutoController();

