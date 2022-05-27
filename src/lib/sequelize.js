const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DB_NAME,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
})

module.exports = sequelize
