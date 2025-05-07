// Importando o Express (framework para criar APIs) e Joi (validação)
const express = require('express');
const Joi = require('joi');

// Criando a aplicação
const app = express();
const PORT = 3000;

// Middleware que transforma JSON do corpo das requisições em objeto JS
app.use(express.json());

// Banco de dados "falso" em memória
let produtos = [];
let proximoId = 1;

// Schema de validação para criação e edição de produto
const produtoSchema = Joi.object({
  nome: Joi.string().min(3).required().messages({
    'string.empty': 'Nome é obrigatório.',
    'string.min': 'Nome deve ter no mínimo 3 caracteres.'
  }),
  preco: Joi.number().positive().required().messages({
    'number.base': 'Preço deve ser um número.',
    'number.positive': 'Preço deve ser positivo.',
    'any.required': 'Preço é obrigatório.'
  })
});

//////////////////////////
// ROTAS DA API
//////////////////////////

// 🟢 GET /produtos - Listar todos os produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// 🟡 POST /produtos - Criar novo produto com validação
app.post('/produtos', (req, res) => {
  const { error, value } = produtoSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ erros: error.details.map(e => e.message) });
  }

  const novoProduto = { id: proximoId++, ...value };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// 🟠 PUT /produtos/:id - Editar um produto existente
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  const { error, value } = produtoSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ erros: error.details.map(e => e.message) });
  }

  produtos[index] = { id, ...value };
  res.json(produtos[index]);
});

// 🔴 DELETE /produtos/:id - Excluir um produto
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado.' });
  }

  produtos.splice(index, 1);
  res.status(204).send(); // Sucesso, mas sem conteúdo
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});


