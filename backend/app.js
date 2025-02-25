const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("✅ Middleware loaded");
process.stdout.write("✅ Middleware loaded\n");

// Register API routes
app.get("/", (req, res) => {
  res.send("✅ Express Server is Running!");
  console.log("✅ Root Route Accessed: GET /");
});

module.exports
