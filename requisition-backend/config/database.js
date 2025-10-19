const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("requisition_db", "root", "areacode", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
