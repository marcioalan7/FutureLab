const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');

const Usuario = sequelize.define(
    'Usuario',
    {
         nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    idade: {
        type: DataTypes.INTEGER
    },

    tipo: {
        type: DataTypes.ENUM('discente', 'docente', 'coordenador'),
        allowNull: false
    }
    }
)

module.exports = Usuario;