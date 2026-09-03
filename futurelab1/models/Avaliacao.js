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

    discenteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    docenteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    perguntaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    timestamps: true
}

);

module.exports = Avaliacao;
