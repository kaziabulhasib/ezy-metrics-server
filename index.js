const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const PDFDocument = require("pdfkit");
const { sendEmailNotification } = require("./emailService");
const fs = require("fs");
const app = express();

const Lead = require("./models/Lead");
const Campaign = require("./models/Campaign");

const connectionString = process.env.DB_STRING;
console.log(process.env.DB_STRING);
// MongoDB connection
mongoose
  .connect(connectionString, {
    autoIndex: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// Route to get leads data
app.get("/api/leads", (req, res) => {
  fs.readFile("./data/leads.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading leads data" });
    }
    const leads = JSON.parse(data);
    res.json(leads);
  });
});

// // Store leads in MongoDB
// app.get("/api/store/leads", async (req, res) => {
//   try {
//     const data = fs.readFileSync("./data/leads.json", "utf-8");
//     const leads = JSON.parse(data);
//     await Lead.insertMany(leads); // Save leads to MongoDB
//     res.json({ message: "Leads stored successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error storing leads" });
//   }
// });

// Store leads in MongoDB
app.get("/api/store/leads", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/leads.json", "utf-8");
    const leads = JSON.parse(data);
    await Lead.insertMany(leads);

    //  email notification
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
// Route to get campaigns data
app.get("/api/campaigns", (req, res) => {
  fs.readFile("./data/campaigns.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading campaigns data" });
    }
    const campaigns = JSON.parse(data);
    res.json(campaigns);
  });
});

app.get("/api/store/campaigns", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/campaigns.json", "utf-8");
    const campaigns = JSON.parse(data);
    await Campaign.insertMany(campaigns); // Save campaigns to MongoDB

    // Check cost per lead for each campaign
    campaigns.forEach(async (campaign) => {
      const costPerLead = campaign.cost / campaign.leads_generated;
      if (costPerLead > 5) {
        // Send email notification if cost per lead exceeds $5
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

// PDF report endpoint
app.get("/api/reports/pdf", async (req, res) => {
  try {
    const leads = await Lead.find({});
    const campaigns = await Campaign.find({});

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');
    doc.pipe(res);

    doc.fontSize(16).text("Campaign Performance Report", { align: "center" });
    doc.moveDown();

    campaigns.forEach((campaign) => {
      doc.fontSize(12).text(`Campaign Name: ${campaign.name}`);
      doc.text(`Platform: ${campaign.platform}`);
      doc.text(`Leads Generated: ${campaign.leads_generated}`);
      doc.text(`Cost: $${campaign.cost}`);
      doc.text(
        `Cost per Lead: $${(campaign.cost / campaign.leads_generated).toFixed(
          2
        )}`
      );
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating report");
  }
});

app.get("/", (req, res) => {
  res.send("ezymetrics is running .......");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
