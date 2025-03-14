const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  contact: { type: String, default: null },
  email: { type: String, default: null },
  photo: { type: String, default: null }, // Stores file path
  idCard: { type: String, default: null }, // Stores file path
});

module.exports = mongoose.model("Passenger", PassengerSchema);
