const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DB_NAME || 'kb4yg',
  username: process.env.MYSQL_USER || 'kb4yg',
  password: process.env.MYSQL_PASSWORD || 'hunter2'
})

module.exports = sequelize
