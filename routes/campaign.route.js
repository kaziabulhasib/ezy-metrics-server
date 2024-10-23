const express = require("express");
const fs = require("fs");
const { sendEmailNotification } = require("../emailService");
const Campaign = require("../models/Campaign");

const router = express.Router();

// Route to get campaigns data
router.get("/", (req, res) => {
  fs.readFile("./data/campaigns.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading campaigns data" });
    }
    const campaigns = JSON.parse(data);
    res.json(campaigns);
  });
});

// Store campaigns in MongoDB
router.post("/store", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/campaigns.json", "utf-8");
    const campaigns = JSON.parse(data); // Parse the JSON data

    await Campaign.insertMany(campaigns); // Store campaigns in the database

    // Cost per lead for each campaign
    campaigns.forEach(async (campaign) => {
      const costPerLead = campaign.cost / campaign.leads_generated;
      if (costPerLead > 5) {
        // Email notification for lead exceeds
        await sendEmailNotification(
          "High Cost per Lead Alert",
          `Campaign "${
            campaign.name
          }" has a cost per lead of $${costPerLead.toFixed(
            2
          )}, which exceeds the $5 threshold.`
        );
      }
    });

    res.json({ message: "Campaigns stored successfully" });
  } catch (error) {
    await sendEmailNotification(
      "Error Storing Campaigns",
      "An error occurred while storing campaigns: " + error.message
    );
    res.status(500).json({ message: "Error storing campaigns" });
  }
});

module.exports = router;
