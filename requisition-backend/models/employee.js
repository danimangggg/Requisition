// models/Employee.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // your Sequelize connection

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  full_name: { type: DataTypes.TEXT, allowNull: true },
  user_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.TEXT, allowNull: false },
  jobTitle: { type: DataTypes.TEXT, allowNull: true },
  account_type: { type: DataTypes.TEXT, allowNull: true },
  position: { type: DataTypes.TEXT, allowNull: true },
  department: { type: DataTypes.TEXT, allowNull: true },
  account_status: { type: DataTypes.TEXT, allowNull: true },
  store: { type: DataTypes.TEXT, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Employee;
