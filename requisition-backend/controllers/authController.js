const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");

// 🔑 JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "a_default_secret_for_development";

exports.customerLogin = async (req, res) => {
  const { user_name, password } = req.body; 
  const customer_id = user_name; // frontend sends user_name, mapped to customer_id

  try {
    const customer = await Customer.findOne({ where: { customer_id } });

    if (!customer) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare passwords (plain vs hashed)
    const isMatch = await bcrypt.compare(password, customer.password);
    // ⚠️ If passwords are stored as plain text in DB (not hashed), use:
    // const isMatch = password === customer.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: customer.id,
        user_name: customer.customer_id,
        user_type: "customer",
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });

    res.json({ token, user: payload.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error during customer login");
  }
};

// ===============================
// EMPLOYEE LOGIN
// ===============================
exports.employeeLogin = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const employee = await Employee.findOne({ where: { user_name } });

    if (!employee) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, employee.password);
    // ⚠️ If not hashed:
    // const isMatch = password === employee.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: employee.id,
        user_name: employee.user_name,
        user_type: "employee",
        position: employee.position,
        department: employee.department,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });

    res.json({ token, user: payload.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error during employee login");
  }
};
