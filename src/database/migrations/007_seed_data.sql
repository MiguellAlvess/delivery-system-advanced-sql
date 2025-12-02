BEGIN;

INSERT INTO categoria (nome, descricao) VALUES
    ('Pizzas','Pizzas artesanais'),
    ('Bebidas','Refrigerantes, sucos e água'),
    ('Sobremesas','Doces e gelados'),
    ('Lanches','Burgers e sanduíches');

INSERT INTO produto (categoria_id, nome, descricao, preco) VALUES
    (1,'Pizza Margherita','Mussarela, tomate, manjericão', 39.90),
    (1,'Pizza Calabresa','Calabresa e cebola', 42.90),
    (1,'Pizza Quatro Queijos','Mussarela, gorgonzola, parmesão, provolone', 49.90),
    (4,'Cheeseburger','Pão, carne, queijo', 24.90),
    (4,'X-Salada','Pão, carne, queijo, salada', 27.90),
    (4,'Double Burger','Dois hambúrgueres e queijo', 34.90),
    (2,'Refrigerante Lata','350ml', 6.00),
    (2,'Suco de Laranja','Natural 300ml', 8.50),
    (2,'Água sem Gás','500ml', 4.00),
    (3,'Pudim','Pudim de leite', 12.90),
    (3,'Brownie','Chocolate', 11.90),
    (3,'Sorvete 2 bolas','Sabores variados', 15.00);

INSERT INTO estoque (produto_id, quantidade) VALUES
    (1, 20),(2, 25),(3, 15),(4, 30),(5, 30),(6, 20),
    (7, 60),(8, 40),(9, 80),(10, 18),(11, 18),(12, 22);

INSERT INTO cliente (nome, email, telefone, logradouro, numero, bairro, cidade, uf, cep) VALUES
    ('Ana Souza','ana.souza@example.com','(83) 90000-0001','Rua A','100','Centro','Campina Grande','PB','58400-001'),
    ('Bruno Lima','bruno.lima@example.com','(83) 90000-0002','Rua B','200','Prata','Campina Grande','PB','58400-002'),
    ('Carla Dias','carla.dias@example.com','(83) 90000-0003','Rua C','300','Liberdade','Campina Grande','PB','58400-003'),
    ('Diego Nunes','diego.nunes@example.com','(83) 90000-0004','Av. D','400','Catolé','Campina Grande','PB','58400-004'),
    ('Elaine Melo','elaine.melo@example.com','(83) 90000-0005','Rua E','500','Itararé','Campina Grande','PB','58400-005'),
    ('Felipe Araújo','felipe.araujo@example.com','(83) 90000-0006','Rua F','600','José Pinheiro','Campina Grande','PB','58400-006'),
    ('Gabriela Paes','gabriela.paes@example.com','(83) 90000-0007','Rua G','700','Alto Branco','Campina Grande','PB','58400-007'),
    ('Henrique Lima','henrique.lima@example.com','(83) 90000-0008','Rua H','800','Sandra Cavalcante','Campina Grande','PB','58400-008'),
    ('Isabela Tavares','isabela.tavares@example.com','(83) 90000-0009','Rua I','900','Monte Castelo','Campina Grande','PB','58400-009'),
    ('João Pedro','joao.pedro@example.com','(83) 90000-0010','Rua J','1000','Bodocongó','Campina Grande','PB','58400-010'),
    ('Karen Silva','karen.silva@example.com','(83) 90000-0011','Rua K','1100','Centro','Campina Grande','PB','58400-011'),
    ('Lucas Matos','lucas.matos@example.com','(83) 90000-0012','Rua L','1200','Prata','Campina Grande','PB','58400-012');

INSERT INTO pedido (cliente_id, status, observacoes) VALUES
    (1,'ABERTO','Sem cebola'),
    (2,'ABERTO',NULL),
    (3,'ABERTO','Adicionar catchup'),
    (4,'PAGO',NULL),
    (5,'PAGO','Retirada em loja'),
    (6,'EM_ENTREGA',NULL),
    (7,'EM_ENTREGA','Entregar na portaria'),
    (8,'ENTREGUE',NULL),
    (9,'ENTREGUE','Pago em PIX'),
    (10,'CANCELADO','Cliente desistiu'),
    (11,'ABERTO',NULL),
    (12,'PAGO',NULL);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (1,1,1,39.90),(1,7,2,6.00);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (2,2,1,42.90),(2,10,1,12.90);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (3,4,2,24.90),(3,8,2,8.50);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (4,3,1,49.90),(4,7,3,6.00);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (5,6,1,34.90),(5,9,2,4.00);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (6,5,1,27.90),(6,7,2,6.00);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (7,1,1,39.90),(7,11,1,11.90);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (8,2,2,42.90);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (9,4,1,24.90),(9,8,1,8.50);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (10,12,2,15.00);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (11,5,1,27.90),(11,7,1,6.00);

INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
    (12,3,1,49.90),(12,10,1,12.90),(12,9,1,4.00);

INSERT INTO pagamento (pedido_id, valor, metodo, status, transacao_ref) VALUES
    (4, 67.90, 'CARTAO', 'APROVADO', 'TX-4-A'),
    (5, 42.90, 'PIX',    'APROVADO', 'TX-5-A'),
    (6, 39.90, 'CARTAO', 'APROVADO', 'TX-6-A'),
    (7, 51.80, 'CARTAO', 'PENDENTE', 'TX-7-P'),
    (7, 51.80, 'PIX',    'APROVADO', 'TX-7-A'),
    (8, 85.80, 'PIX',    'APROVADO', 'TX-8-A'),
    (9, 33.40, 'PIX',    'APROVADO', 'TX-9-A'),
    (10,30.00, 'CARTAO', 'RECUSADO', 'TX-10-R'),
    (12,66.80, 'CARTAO', 'APROVADO', 'TX-12-A');

INSERT INTO entrega (pedido_id, status, previsao, enviado_em, entregue_em, endereco) VALUES
    (6,'EM_ROTA', now() + interval '30 min', now() - interval '10 min', NULL, 'Rua F, 600 - José Pinheiro'),
    (7,'EM_ROTA', now() + interval '20 min', now() - interval '5 min',  NULL, 'Rua G, 700 - Alto Branco'),
    (8,'ENTREGUE', NULL, now() - interval '1 hour', now() - interval '10 min', 'Rua H, 800 - Sandra Cavalcante'),
    (9,'ENTREGUE', NULL, now() - interval '2 hour', now() - interval '30 min', 'Rua I, 900 - Monte Castelo');

INSERT INTO auditoria_estoque (produto_id, motivo, quantidade) VALUES
    (1 , 'Venda pedido 1', 1),
    (7 , 'Venda pedido 1', 2),
    (2 , 'Venda pedido 2', 1),
    (10, 'Venda pedido 2', 1),
    (4 , 'Venda pedido 3', 2),
    (8 , 'Venda pedido 3', 2),
    (3 , 'Venda pedido 4', 1),
    (7 , 'Venda pedido 4', 3),
    (6 , 'Venda pedido 5', 1),
    (9 , 'Venda pedido 5', 2),
    (5 , 'Venda pedido 6', 1),
    (7 , 'Venda pedido 6', 2),
    (1 , 'Venda pedido 7', 1),
    (11, 'Venda pedido 7', 1),
    (2 , 'Venda pedido 8', 2),
    (4 , 'Venda pedido 9', 1),
    (8 , 'Venda pedido 9', 1),
    (12, 'Venda pedido 10', 2),
    (5 , 'Venda pedido 11', 1),
    (7 , 'Venda pedido 11', 1),
    (3 , 'Venda pedido 12', 1),
    (10, 'Venda pedido 12', 1),
    (9 , 'Venda pedido 12', 1);

COMMIT;

