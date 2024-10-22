const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  campaign_id: String,
  name: String,
  platform: String,
  leads_generated: Number,
  cost: Number,
});

module.exports = mongoose.model("Campaign", campaignSchema);
