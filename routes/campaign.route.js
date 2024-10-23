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

// Store campaigns in MongoDB only if there is new data
router.post("/store", async (req, res) => {
  try {
    // Read the campaigns from the JSON file
    const data = fs.readFileSync("./data/campaigns.json", "utf-8");
    const campaigns = JSON.parse(data);

    // Find all existing campaigns in MongoDB
    const existingCampaigns = await Campaign.find({});

    // Filter out campaigns that are already in the database
    const newCampaigns = campaigns.filter(
      (campaign) =>
        !existingCampaigns.some((existing) => existing.name === campaign.name)
    );

    if (newCampaigns.length > 0) {
      // Insert only the new campaigns into MongoDB
      await Campaign.insertMany(newCampaigns);

      // Cost per lead for each campaign
      newCampaigns.forEach(async (campaign) => {
        const costPerLead = campaign.cost / campaign.leads_generated;
        if (costPerLead > 5) {
          // Email notification for high cost per lead
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

      res.json({
        message: `${newCampaigns.length} new campaign(s) stored successfully`,
        newCampaigns,
      });
    } else {
      res.json({ message: "No new campaigns to store" });
    }
  } catch (error) {
    await sendEmailNotification(
      "Error Storing Campaigns",
      "An error occurred while storing campaigns: " + error.message
    );
    res.status(500).json({ message: "Error storing campaigns" });
  }
});

module.exports = router;
