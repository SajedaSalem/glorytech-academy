const express = require("express");
const courseRoutes = require("./routes/courses");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Basic root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to GloryTech Academy API",
    version: "1.0.0"
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "glorytech-backend",
    timestamp: new Date().toISOString()
  });
});

// Course routes
app.use("/api/courses", courseRoutes);

// 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

module.exports = app;