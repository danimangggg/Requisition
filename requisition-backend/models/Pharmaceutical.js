const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Make sure this points to your db.js

const Pharmaceutical = sequelize.define(
  "Pharmaceutical",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    material_description: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "pharmaceuticals", // Matches your MySQL table name
    timestamps: true, // Adds createdAt and updatedAt automatically
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Pharmaceutical;
