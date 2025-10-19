const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Employee login
router.post("/api/auth/employee/login", authController.employeeLogin);

// Customer login
//router.post("/customer/login", authController.customerLogin);

module.exports = router;
 