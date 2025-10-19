// models/Customer.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // your Sequelize connection

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  facility: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  zone: { type: DataTypes.STRING },
  woreda: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING },
  user_type: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Customer;
