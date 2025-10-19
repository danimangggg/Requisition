const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Requisition = sequelize.define(
  "Requisition",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    material_description: {
      type: DataTypes.STRING(255),
    },
    request_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    processing_day: {
      type: DataTypes.INTEGER, // numeric processing duration
    },
    status: {
      type: DataTypes.ENUM("Pending", "Processed", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "requisitions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Requisition;
