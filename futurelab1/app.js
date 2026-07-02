const express = require("express");
const sequelize = require("./config/bd");
const Pergunta = require("./models/Pergunta");

const app = express();

app.use(express.urlencoded({ extended: true }));

sequelize.authenticate()
  .then(() => console.log("Conectado ao banco!"));

sequelize.sync()
  .then(() => console.log("Tabela criada!"));

app.get("/", async (req, res) => {
  const perguntas = await Pergunta.findAll();

  let html = `
    <h1>CRUD Perguntas</h1>

    <form method="POST" action="/criar">
      <input name="pergunta" required />
      <button>Criar</button>
    </form>

    <hr>
  `;

  perguntas.forEach(p => {
    html += `
      <p>
        ${p.pergunta}
        <a href="/deletar/${p.id}">Deletar</a>
        <a href="/editar/${p.id}">Editar</a>
      </p>
    `;
  });

  res.send(html);
});

app.post("/criar", async (req, res) => {
  await Pergunta.create({ pergunta: req.body.pergunta });
  res.redirect("/");
});

app.get("/deletar/:id", async (req, res) => {
  await Pergunta.destroy({ where: { id: req.params.id } });
  res.redirect("/");
});


app.get("/editar/:id", async (req, res) => {
  const p = await Pergunta.findByPk(req.params.id);

  res.send(`
    <form method="POST" action="/editar/${p.id}">
      <input name="pergunta" value="${p.pergunta}" required />
      <button>Salvar</button>
    </form>
  `);
});

app.post("/editar/:id", async (req, res) => {
  await Pergunta.update(
    { pergunta: req.body.pergunta },
    { where: { id: req.params.id } }
  );

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Servidor iniciado!");
});