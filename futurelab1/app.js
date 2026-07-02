
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Usuario = require('./models/inserirUsuario.model')
const Pergunta = require("./models/Pergunta");

app.engine(
    'handlebars', 
    exphbs.engine( {defaultLayout: false} )
);
app.set(
    'view engine', 
    'handlebars'
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

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
app.get(
    '/home',
    (req, res) => {
        res.render('home')
    }
);

app.get(
    '/inserirUsuario',
    (req, res) => {
        res.render('inserirUsuario')
    }
);

app.post(
    '/inserirUsuario',
    async (req, res) => {
        const { nome, email, idade, tipo } = req.body;
        try { await Usuario.create({ nome, email, idade, tipo });
        res.redirect('/usuarios');
    } catch (erro) {
        console.error('Erro ao inserir usuário:', erro);
        res.status(500).send('Erro ao inserir usuário');
    }
}
);

app.get(
    '/usuarios',
    async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            res.render('usuarios', { usuarios: usuarios.map(usuario => usuario.toJSON())});
        } catch (erro) {
            console.error('Erro ao buscar usuários:', erro);
            res.status(500).send('Erro ao buscar usuários');
        }
    }
);

app.get(
    '/editarUsuario/:id',
    async (req, res) => {
        const id = req.params.id;
        const usuario = await Usuario.findByPk(id);
        res.render('editarUsuario', { usuario: usuario.toJSON() });
    }
);

app.put(
    '/editarUsuario/:id',
    async (req, res) => {
        const { nome, email, idade, tipo } = req.body;
        await Usuario.update(
            {
                nome,
                email,
                idade,
                tipo
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        res.redirect('/usuarios');
    }
);

app.delete(
    '/deletarUsuario/:id',
    async (req, res) => {
        await Usuario.destroy({
            where: {
                id: req.params.id
            }
        })

        res.redirect('/usuarios');

    }
);

async function conectarBD() {
    try{
        await sequelize.sync();
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
    }
};

conectarBD();

app.listen(
    3000,
    () => console.log('Servidor em execução')
);
