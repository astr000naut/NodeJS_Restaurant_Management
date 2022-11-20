const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('postgres://admin:admin@127.0.0.1:5432/postgres');
module.exports = sequelize;

