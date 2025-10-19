const Pharmaceutical = require("../models/Pharmaceutical");
const { Op } = require("sequelize");

// Bulk import pharmaceuticals
exports.bulkCreatePharmaceuticals = async (req, res) => {
  try {
    const items = req.body; // Expecting array of { material, material_description }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    // Get existing combinations from DB
    const existing = await Pharmaceutical.findAll({
      where: {
        [Op.or]: items.map((item) => ({
          material: item.material,
          material_description: item.material_description,
        })),
      },
    });

    const existingSet = new Set(
      existing.map((item) => item.material + "|" + item.material_description)
    );

    // Filter out duplicates
    const newItems = items.filter(
      (item) => !existingSet.has(item.material + "|" + item.material_description)
    );

    if (newItems.length === 0) {
      return res.json({ message: "All items already exist, nothing to save." });
    }

    const inserted = await Pharmaceutical.bulkCreate(newItems);
    res.status(201).json({ message: `${inserted.length} items saved.`, inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save pharmaceuticals" });
  }
};


// Get all pharmaceuticals
exports.getAllPharmaceuticals = async (req, res) => {
  try {
    const pharmas = await Pharmaceutical.findAll();
    res.json(pharmas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pharmaceuticals" });
  }
};

// Get pharmaceutical by ID
exports.getPharmaceuticalById = async (req, res) => {
  try {
    const pharma = await Pharmaceutical.findByPk(req.params.id);
    if (!pharma) return res.status(404).json({ error: "Pharmaceutical not found" });
    res.json(pharma);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pharmaceutical" });
  }
};

// Create new pharmaceutical
exports.createPharmaceutical = async (req, res) => {
  try {
    const { material, material_description } = req.body;
    const newPharma = await Pharmaceutical.create({ material, material_description });
    res.status(201).json(newPharma);
  } catch (err) {
    res.status(500).json({ error: "Failed to create pharmaceutical" });
  }
};

// Update pharmaceutical
exports.updatePharmaceutical = async (req, res) => {
  try {
    const { material, material_description } = req.body;
    const pharma = await Pharmaceutical.findByPk(req.params.id);
    if (!pharma) return res.status(404).json({ error: "Pharmaceutical not found" });

    pharma.material = material || pharma.material;
    pharma.material_description = material_description || pharma.material_description;
    await pharma.save();
    res.json(pharma);
  } catch (err) {
    res.status(500).json({ error: "Failed to update pharmaceutical" });
  }
};

// Delete pharmaceutical
exports.deletePharmaceutical = async (req, res) => {
  try {
    const pharma = await Pharmaceutical.findByPk(req.params.id);
    if (!pharma) return res.status(404).json({ error: "Pharmaceutical not found" });
    await pharma.destroy();
    res.json({ message: "Pharmaceutical deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete pharmaceutical" });
  }
};
