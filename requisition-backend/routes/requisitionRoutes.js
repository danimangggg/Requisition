const express = require("express");
const router = express.Router();
const controller = require("../controllers/requisitionController");

router.get("/", controller.getAllRequisitions);
router.post("/", controller.createRequisition);   // Customer submission
router.put("/:id", controller.updateRequisition); // Employee processing
router.delete("/:id", controller.deleteRequisition);

module.exports = router;
