
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Usuario = require('./models/inserirUsuario.model')
const Pergunta = require("./models/Pergunta");
const Avaliacao = require("./models/Avaliacao");

require('./models/relacionamentos')

app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: false,
        helpers: {
            eq: (a, b) => a === b
        }
    })
);

app.set(
    'view engine', 
    'handlebars'
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static('public'));

/* sequelize.authenticate()
  .then(() => console.log("Conectado ao banco!"));

sequelize.sync()
  .then(() => console.log("Tabela criada!"));*/

app.get(
    '/login',
    (req, res) => {
        res.render('login');
    }
);

app.post(
    '/login',
    (req, res) => {
        const { usuario, senha } = req.body;

        if (usuario === 'discente' && senha === '1234') {
            return res.redirect('/discente');
        }

        if (usuario === 'docente' && senha === '1234') {
            return res.redirect('/docente');
        }

        if (usuario === 'gestor' && senha === '1234') {
            return res.redirect('/gestor');
        }

        res.render(
            'login',
            {
                erro: 'Usuário ou senha incorretos.'
            }
        );

    }
);

app.get(
    '/gestor',
    (req, res) => {
        res.render('gestor')
    }
);

app.get(
    '/discente', 
    async (req, res) => {
    try {
        const docentes = await Usuario.findAll({
            where: {
                tipo: 'docente'
            }
        });

        res.render('discente', {
            docentes: docentes.map(docente => docente.toJSON())
        });

    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao carregar os docentes.');
    }
    }
);

app.get(
    '/perfilDocente/:id', 
    async (req, res) => {
    try {
        const docente = await Usuario.findByPk(req.params.id);
        if (!docente) {
            return res.status(404).send('Docente não encontrado.');
        }
        res.render('perfilDocente', {
            docente: docente.toJSON()
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao carregar o perfil.');
    }
}
);

app.get(
    '/docente', 
    (req, res) => {
    res.render('docente');
    }
);

app.get(
    '/inserirPergunta',
    async (req, res) => {
        res.render('inserirPergunta')
    }
);

app.post(
    '/inserirPergunta',
    async (req, res) => {
        const { pergunta } = req.body;
        try { await Pergunta.create({ pergunta });
        res.redirect('/gestor/perguntas');
    } catch (erro) {
        console.error('Erro ao inserir pergunta:', erro);
        res.status(500).send('Erro ao inserir pergunta');
    }
    }
);

app.get(
    '/docente/perguntas', 
    async (req, res) => {
    try {
        const perguntas = await Pergunta.findAll();
        res.render('perguntas', {
            perguntas: perguntas.map(
                pergunta => pergunta.toJSON()
            ),
            origem: 'docente'
        });
    } catch (erro) {
        console.error('Erro ao buscar perguntas:', erro);
        res.status(500).send('Erro ao buscar perguntas');
    }
});

app.get(
    '/gestor/perguntas', 
    async (req, res) => {
    try {
        const perguntas = await Pergunta.findAll();
        res.render('perguntas', {
            perguntas: perguntas.map(
                pergunta => pergunta.toJSON()
            ),
            origem: 'gestor'
        });
    } catch (erro) {
        console.error('Erro ao buscar perguntas:', erro);
        res.status(500).send('Erro ao buscar perguntas');
    }
});

app.get(
    '/editarPergunta/:id',
    async (req, res) => {
        const id = req.params.id;
        const pergunta = await Pergunta.findByPk(id);
        res.render('editarPergunta', { pergunta: pergunta.toJSON() });
    }
);

app.put(
    '/editarPergunta/:id',
    async (req, res) => {
        const { pergunta } = req.body;
        await Pergunta.update(
            {
                pergunta
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )

        res.redirect('/gestor/perguntas');
    }
);

app.delete(
    '/deletarPergunta/:id',
    async (req, res) => {
        await Pergunta.destroy({
            where: {
                id: req.params.id
            }
        })

        res.redirect('/gestor/perguntas');

    }
);

/*app.get("/", async (req, res) => {
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
      <input name="pergunta" value="${p.pergunta}" required /inserirPergunta>
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
});*/

app.get(
    '/inserirUsuario',
    (req, res) => {
        res.render('inserirUsuario')
    }
);

app.post(
    '/inserirUsuario',
    async (req, res) => {
        const { nome, email, idade, tipo, telefone, disciplina, formacao } = req.body;
        try { await Usuario.create({ nome, email, idade, tipo, telefone, disciplina, formacao });
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

/*app.get(
    '/inserirAvaliacao',
    async (req, res) => {

        const usuarios = await Usuario.findAll();
        const perguntas = await Pergunta.findAll();

        res.render('inserirAvaliacao', {
            usuarios: usuarios.map(usuario => usuario.toJSON()),
            perguntas: perguntas.map(pergunta => pergunta.toJSON())
        });
    }
);

app.post(
    '/inserirAvaliacao',
    async (req, res) => {

        const {
            nota,
            comentario,
            usuarioId,
            perguntaId
        } = req.body;

        try {

            await Avaliacao.create({
                nota,
                comentario,
                usuarioId,
                perguntaId
            });

            res.redirect('/avaliacoes');

        } catch (erro) {

            console.error('Erro ao inserir avaliação:', erro);

            res.status(500).send(
                'Erro ao inserir avaliação'
            );
        }
    }
);*/

app.post(
    '/avaliarDocente/:id',
    async (req, res) => {
        try {
            const docenteId = req.params.id;
            const discente = await Usuario.findOne({
                where: {
                    tipo: 'discente'
                }
            });

            if (!discente) {
                return res.status(404).send(
                    'Nenhum discente encontrado.'
                );
            }

            const discenteId = discente.id;
            const comentario = req.body.comentario;
            const perguntas = await Pergunta.findAll();
            for (const pergunta of perguntas) {
                const nota = req.body[`nota_${pergunta.id}`];
                if (nota) {
                    await Avaliacao.create({
                        nota: nota,
                        comentario: comentario,
                        discenteId: discenteId,
                        docenteId: docenteId,
                        perguntaId: pergunta.id
                    });

                }
            }
            res.redirect('/discente');
        } catch (erro) {
            console.error(
                'Erro ao salvar avaliação:',
                erro
            );
            res.status(500).send(
                'Erro ao salvar avaliação.'
            );
        }
    }
);

app.get(
    '/avaliarDocente/:id',
    async (req, res) => {
        try {
            const docente = await Usuario.findOne({
                where: {
                    id: req.params.id,
                    tipo: 'docente'
                }
            });

            if (!docente) {
                return res.status(404).send(
                    'Docente não encontrado.'
                );
            }
            const perguntas = await Pergunta.findAll();
            res.render('avaliarDocente', {
                docente: docente.toJSON(),
                perguntas: perguntas.map(
                    pergunta => pergunta.toJSON()
                )
            });
        } catch (erro) {
            console.error(
                'Erro ao carregar avaliação:',
                erro
            );
            res.status(500).send(
                'Erro ao carregar avaliação.'
            );
        }
    }
);

app.get(
    '/docente/avaliacoes', 
    async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'discente',
                    attributes: ['id', 'nome']
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ['id', 'nome']
                },
                {
                    model: Pergunta,
                    as: 'pergunta',
                    attributes: ['id', 'pergunta']
                }
            ]
        });
        res.render('avaliacoes', {
            avaliacoes: avaliacoes.map(
                avaliacao => avaliacao.toJSON()
            ),
            origem: 'docente'
        });
    } catch (erro) {
        console.error('Erro ao buscar avaliações:', erro);
        res.status(500).send('Erro ao buscar avaliações');
    }
});

app.get(
    '/gestor/avaliacoes', 
    async (req, res) => {
    try {
        const avaliacoes = await Avaliacao.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'discente',
                    attributes: ['id', 'nome']
                },
                {
                    model: Usuario,
                    as: 'docente',
                    attributes: ['id', 'nome']
                },
                {
                    model: Pergunta,
                    as: 'pergunta',
                    attributes: ['id', 'pergunta']
                }
            ]
        });
        res.render('avaliacoes', {
            avaliacoes: avaliacoes.map(
                avaliacao => avaliacao.toJSON()
            ),
            origem: 'gestor'
        });
    } catch (erro) {
        console.error('Erro ao buscar avaliações:', erro);
        res.status(500).send('Erro ao buscar avaliações');
    }
});

app.get(
    '/editarAvaliacao/:id',
    async (req, res) => {

        try {

            const avaliacao = await Avaliacao.findByPk(
                req.params.id
            );

            res.render(
                'editarAvaliacao',
                {
                    avaliacao: avaliacao.toJSON()
                }
            );

        } catch (erro) {

            console.error(
                'Erro ao buscar avaliação:',
                erro
            );

            res.status(500).send(
                'Erro ao buscar avaliação'
            );
        }
    }
);

app.put(
    '/editarAvaliacao/:id',
    async (req, res) => {

        try {

            const {
                nota,
                comentario
            } = req.body;

            await Avaliacao.update(
                {
                    nota,
                    comentario
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            );

            res.redirect('/gestor/avaliacoes');

        } catch (erro) {

            console.error(
                'Erro ao atualizar avaliação:',
                erro
            );

            res.status(500).send(
                'Erro ao atualizar avaliação'
            );
        }
    }
);

app.delete(
    '/deletarAvaliacao/:id',
    async (req, res) => {

        try {

            await Avaliacao.destroy({
                where: {
                    id: req.params.id
                }
            });

            res.redirect('/gestor/avaliacoes');

        } catch (erro) {

            console.error(
                'Erro ao excluir avaliação:',
                erro
            );

            res.status(500).send(
                'Erro ao excluir avaliação'
            );
        }
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