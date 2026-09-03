const sequelize = require('../config/bd')
const Usuario = require('./inserirUsuario.model');
const Pergunta = require('./Pergunta');
const Avaliacao = require('./Avaliacao');

Avaliacao.belongsTo(Usuario, {
    foreignKey: 'discenteId',
    as: 'discente'
});

Avaliacao.belongsTo(Usuario, {
    foreignKey: 'docenteId',
    as: 'docente'
});

Avaliacao.belongsTo(Pergunta, {
    foreignKey: 'perguntaId',
    as: 'pergunta'
});

Usuario.hasMany(Avaliacao, {
    foreignKey: 'discenteId',
    as: 'avaliacoesFeitas'
});

Usuario.hasMany(Avaliacao, {
    foreignKey: 'docenteId',
    as: 'avaliacoesRecebidas'
});

Pergunta.hasMany(Avaliacao, {
    foreignKey: 'perguntaId',
    as: 'avaliacoes'
});

module.exports = {
    Usuario,
    Pergunta,
    Avaliacao
}