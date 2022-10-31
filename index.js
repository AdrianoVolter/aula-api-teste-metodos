const express = require("express");
const joi = require("joi"); // usado para fazer validação
const app = express();
app.use(express.json());

const livros = [
  { titulo: "livro A", id: 1 },
  { titulo: "livro B", id: 2 },
  { titulo: "livro C", id: 3 },
  { titulo: "livro D", id: 4 }
];

//Envia solicitação de boas vindas
app.get("/", (req, res) => {
  res.send("Seja bem vindo a API em Node js !!");
});

//Retorna todos os livros
app.get("/api/livros", (req, res) => {
  res.send(livros);
});

//Pesquisa um livro pelo id
app.get("/api/livros/:id", (req, res) => {
  const livro = livros.find(
    (livro) => livro.id === parseInt(req.params.id, 10)
  );
  if (!livro) res.status(404).send("O livro selecionado NÃO foi encontrado !!");
  res.send(livro);
});

//Solicitaçaõ prar criar um novo livro
app.post("/api/livros", (req, res) => {
  const { error } = validarLivro(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const livro = {
    id: livros.length + 1,
    titulo: req.body.titulo
  };
  livros.push(livro);
  res.send(livro);
});

//Solicitção para atualizar livros.
app.put("/api/livros/:id", (req, res) => {
  const livro = livros.find(
    (livro) => livro.id === parseInt(req.params.id, 10)
  );
  if (!livro)
    res.status(404).send("Não foi possivel encontrar o livro solicitado");

  const { error } = validarLivro(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  livro.titulo = req.body.titulo;
  res.send(livro);
});

//Deletar um livro
app.delete("/api/livros/:id", (req, res) => {
  const livro = livros.find(
    (livro) => livro.id === parseInt(req.params.id, 10)
  );
  if (!livro)
    res.status(404).send("Não foi possivel encontrar o livro solicitado!");

  const index = livros.indexOf(livro);
  livros.splice(index, 1);
  res.send(livro);
});

function validarLivro(livro) {
  const schema = joi.object({
    titulo: joi.string().min(3).empty().required().messages({
      "string.min": "O titulo deve ter, no minimo ,{#limit} caracteres .",
      "string.empty": "Campo titulo não pode estar vazia",
      "any.required": "O campo titulo é obrigatorio !!"
    })
  });
  const resultado = schema.validate(livro);
  return resultado;
}

//Porta variavel de ambiente ;
const porta = process.env.PORT || 8080;
app.listen(porta, () =>
  console.log("Servidor inicializado na porta: " + porta)
);
