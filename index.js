const mongoose = require("mongoose");
const express = require("express");
// const PDFDocument = require("pdfkit");

const fs = require("fs");
const app = express();

const Lead = require("./models/Lead");
const Campaign = require("./models/Campaign");

// const connectionString = process.env.DB_STRING;
// console.log(process.env.DB_STRING);
// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://ezymetricsUser:f8s06nzLqkQPOiqw@cluster0.ggulbwq.mongodb.net/ezymetDb?retryWrites=true&w=majority&appName=Cluster0",
    {
      autoIndex: true,
    }
  )
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

// Store leads in MongoDB
app.get("/api/store/leads", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/leads.json", "utf-8");
    const leads = JSON.parse(data);
    await Lead.insertMany(leads); // Save leads to MongoDB
    res.json({ message: "Leads stored successfully" });
  } catch (error) {
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

// Store campaigns in MongoDB
app.get("/api/store/campaigns", async (req, res) => {
  try {
    const data = fs.readFileSync("./data/campaigns.json", "utf-8");
    const campaigns = JSON.parse(data);
    await Campaign.insertMany(campaigns); // Save campaigns to MongoDB
    res.json({ message: "Campaigns stored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error storing campaigns" });
  }
});

app.get("/", (req, res) => {
  res.send("ezymetrics is running .......");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
