const express = require("express");
const fs = require("fs");
const app = express();

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

app.get("/", (req, res) => {
  res.send("ezymetrics is running .......");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
