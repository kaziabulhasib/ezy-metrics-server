const express = require("express");
const fs = require("fs");
const { sendEmailNotification } = require("../emailService");
const Lead = require("../models/Lead");
const router = express.Router();

// Leads data route
router.get("/", (req, res) => {
  fs.readFile("./data/leads.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading leads data" });
    }
    const leads = JSON.parse(data);
    res.json(leads);
  });
});

// Store leads in MongoDB
router.post("/store", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/leads.json", "utf-8");
    const leads = JSON.parse(data); // Parse the JSON data

    await Lead.insertMany(leads); // Store leads in the database

    // Email notification
    await sendEmailNotification(
      "Leads Stored Successfully",
      "All leads have been stored in the database."
    );
    res.json({ message: "Leads stored successfully" });
  } catch (error) {
    await sendEmailNotification(
      "Error Storing Leads",
      "An error occurred while storing leads: " + error.message
    );
    res.status(500).json({ message: "Error storing leads" });
  }
});

module.exports = router;
