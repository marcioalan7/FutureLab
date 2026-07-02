const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Usuario = require('./models/inserirUsuario.model')

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

app.get(
    '/',
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