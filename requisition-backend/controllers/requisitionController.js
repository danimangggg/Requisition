const Requisition = require("../models/Requisition");
const { Op } = require("sequelize");

// Get all requisitions with pagination & search
exports.getAllRequisitions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const where = search
      ? {
          [Op.or]: [
            { material: { [Op.like]: `%${search}%` } },
            { material_description: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Requisition.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.json({
      data: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requisitions" });
  }
};

// Customer creates requisition
exports.createRequisition = async (req, res) => {
  try {
    const { material, material_description, request_amount } = req.body;
    const customer_id = req.user.id; // logged-in customer

    if (!material || !request_amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const requisition = await Requisition.create({
      customer_id,
      material,
      material_description,
      request_amount,
      status: "Pending",
    });

    res.status(201).json(requisition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create requisition" });
  }
};

// Employee updates requisition
exports.updateRequisition = async (req, res) => {
  try {
    const { id } = req.params;
    const { request_amount, processing_day, status } = req.body;
    const employee_id = req.user.id; // logged-in employee

    const requisition = await Requisition.findByPk(id);
    if (!requisition) return res.status(404).json({ error: "Requisition not found" });

    requisition.request_amount = request_amount ?? requisition.request_amount;
    requisition.processing_day = processing_day ?? requisition.processing_day;
    requisition.status = status ?? requisition.status;
    requisition.employee_id = employee_id;

    await requisition.save();
    res.json(requisition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update requisition" });
  }
};

// Delete requisition
exports.deleteRequisition = async (req, res) => {
  try {
    const { id } = req.params;
    const requisition = await Requisition.findByPk(id);
    if (!requisition) return res.status(404).json({ error: "Requisition not found" });

    await requisition.destroy();
    res.json({ message: "Requisition deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete requisition" });
  }
};
