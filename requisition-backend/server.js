// ============================
//  server.js - Main Server File
// ============================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authController = require("./controllers/authController");
const sequelize = require("./db"); // Sequelize connection
const authenticateEmployee = require("./routes/authRoutes"); // Model
const pharmaRoutes = require("./routes/pharmaceuticalRoutes"); // Routes

dotenv.config(); // Load .env variables

const app = express();

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON body

app.get("/", (req, res) => {
  res.send("💊 Pharmaceutical Requisition API is running...");
});

app.use("/api/pharmaceuticals", pharmaRoutes);
app.use("/api/auth/employee/login", authController.employeeLogin);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync models (creates/updates tables)
    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized with database.");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

startServer();
