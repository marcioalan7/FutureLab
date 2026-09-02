const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Avaliacao = sequelize.define('Avaliacao', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    nota: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    comentario: {
        type: DataTypes.STRING,
        allowNull: true
    },

    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    perguntaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Avaliacao;
