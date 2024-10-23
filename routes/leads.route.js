const express = require("express");
const fs = require("fs");
const { sendEmailNotification } = require("../emailService");
const Lead = require("../models/Lead");
const router = express.Router();

// data route
router.get("/", (req, res) => {
  fs.readFile("./data/leads.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading leads data" });
    }
    const leads = JSON.parse(data);
    res.json(leads);
  });
});

// Store leads in db
router.post("/store", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/leads.json", "utf-8");
    const leads = JSON.parse(data);

    const existingLeads = await Lead.find({});

    const newLeads = leads.filter(
      (lead) =>
        !existingLeads.some((existingLead) => existingLead.email === lead.email)
    );

    if (newLeads.length > 0) {
      await Lead.insertMany(newLeads);

      await sendEmailNotification(
        "Leads Stored Successfully",
        `${newLeads.length} new lead(s) have been stored in the database.`
      );

      res.json({ message: "New leads stored successfully", newLeads });
    } else {
      res.json({ message: "No new leads to store" });
    }
  } catch (error) {
    await sendEmailNotification(
      "Error Storing Leads",
      "An error occurred while storing leads: " + error.message
    );
    res.status(500).json({ message: "Error storing leads" });
  }
});

module.exports = router;
