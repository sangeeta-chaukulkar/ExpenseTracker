const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensetracker', 'root','Yash123$', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
