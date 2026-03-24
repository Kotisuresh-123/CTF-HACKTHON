const mongoose = require("mongoose");

const leakSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique : true
  },

  maskedKey: {
    type: String,
  },

  type: {
    type: String,
    required: true,
  },

  source: {
    type: String, 
    required: true,
  },

  risk: {
    type: String, 
    required: true,
  },

  riskScore: {
    type: Number, 
  },

  detectedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Leak", leakSchema);