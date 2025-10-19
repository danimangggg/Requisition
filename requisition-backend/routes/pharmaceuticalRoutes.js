const express = require("express");
const router = express.Router();
const pharmaController = require("../controllers/pharmaceuticalController");

// Define routes and link them to controller functions
router.get("/", pharmaController.getAllPharmaceuticals);
router.get("/:id", pharmaController.getPharmaceuticalById);
router.post("/", pharmaController.createPharmaceutical);
router.put("/:id", pharmaController.updatePharmaceutical);
router.delete("/:id", pharmaController.deletePharmaceutical);

module.exports = router;
