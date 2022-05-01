const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER_NAME,process.env.PASSWORD, {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
