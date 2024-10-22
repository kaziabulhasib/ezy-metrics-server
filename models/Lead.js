const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  lead_id: String,
  name: String,
  email: String,
  campaign: String,
});

module.exports = mongoose.model("Lead", leadSchema);
