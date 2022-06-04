const { Sequelize } = require("sequelize");

const db = new Sequelize("tradehistory", "newuser", "password", {
 host: "localhost",
 dialect: "postgres",
});

module.exports = db;