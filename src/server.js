import express from "express";
import dotenv from "dotenv";
import produtoController from "./modules/produtos/produto.controller.js";
import pedidoController from "./modules/pedidos/pedido.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/produtos", produtoController.listar.bind(produtoController));
app.get("/produtos/:id", produtoController.buscarPorId.bind(produtoController));
app.post("/produtos", produtoController.criar.bind(produtoController));
app.put("/produtos/:id", produtoController.atualizar.bind(produtoController));
app.delete("/produtos/:id", produtoController.deletar.bind(produtoController));

app.get("/pedidos", pedidoController.listar.bind(pedidoController));
app.get("/pedidos/:id", pedidoController.buscarPorId.bind(pedidoController));
app.post("/pedidos", pedidoController.criar.bind(pedidoController));
app.put("/pedidos/:id", pedidoController.atualizar.bind(pedidoController));
app.delete("/pedidos/:id", pedidoController.deletar.bind(pedidoController));

app.post(
  "/pedidos/gerar",
  pedidoController.processarPedidoCompleto.bind(pedidoController)
);
app.get(
  "/pedidos/:id/total",
  pedidoController.calcularTotal.bind(pedidoController)
);
app.get(
  "/pedidos/estoque/:produto_id",
  pedidoController.verificarEstoque.bind(pedidoController)
);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
