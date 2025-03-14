const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Passenger = require("../models/Passenger");
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`📂 Uploading file: ${file.originalname} to ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// **Fix: Ensure router is correctly exported**
router.post("/", upload.any(), async (req, res) => {
  try {
    console.log("🔹 Received Body:", req.body);
    console.log("🔹 Received Files:", req.files);

    if (!req.body.passengers) {
      return res.status(400).json({ error: "❌ Missing passengers data" });
    }

    let passengers;
    try {
      passengers = JSON.parse(req.body.passengers);
    } catch (err) {
      console.error("❌ JSON Parsing Error:", err);
      return res
        .status(400)
        .json({ error: "Invalid JSON format in passengers data" });
    }

    const formattedPassengers = passengers.map((passenger) => ({
      name: passenger.name,
      age: passenger.age,
      gender: passenger.gender,
      contact: passenger.contact || null,
      email: passenger.email || null,
      photo: req.files.find((f) => f.fieldname === "photo")?.path || null,
      idCard: req.files.find((f) => f.fieldname === "idCard")?.path || null,
    }));

    console.log("✅ Formatted Passengers:", formattedPassengers);

    const savedPassengers = await Passenger.insertMany(formattedPassengers);
    res.status(201).json(savedPassengers);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const passengers = await Passenger.find();
    res.json(passengers);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
});
// **Fix: Make sure `router` is exported correctly**
module.exports = router;
