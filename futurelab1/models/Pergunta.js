const Sequelize = require("sequelize");
const bd = require("../config/bd");

const Pergunta = bd.define("pergunta", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pergunta: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Pergunta;