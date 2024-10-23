const express = require("express");
const fs = require("fs");
const { sendEmailNotification } = require("../emailService");
const Campaign = require("../models/Campaign");

const router = express.Router();

// get campaigns data
router.get("/", (req, res) => {
  fs.readFile("./data/campaigns.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading campaigns data" });
    }
    const campaigns = JSON.parse(data);
    res.json(campaigns);
  });
});

// Store data in db
router.post("/store", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/campaigns.json", "utf-8");
    const campaigns = JSON.parse(data);
    const existingCampaigns = await Campaign.find({});
    const newCampaigns = campaigns.filter(
      (campaign) =>
        !existingCampaigns.some((existing) => existing.name === campaign.name)
    );

    if (newCampaigns.length > 0) {
      await Campaign.insertMany(newCampaigns);
      newCampaigns.forEach(async (campaign) => {
        const costPerLead = campaign.cost / campaign.leads_generated;
        if (costPerLead > 5) {
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
