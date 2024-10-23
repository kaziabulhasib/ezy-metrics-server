const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const PDFDocument = require("pdfkit");
const { sendEmailNotification } = require("./emailService");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// models
const Lead = require("./models/Lead");
const Campaign = require("./models/Campaign");

// Import routes
const leadsRoutes = require("./routes/leads.route");
const campaignRoutes = require("./routes/campaign.route");
const pdfRoutes = require("./routes/pdfreports.route");

const connectionString = process.env.DB_STRING;
console.log(process.env.DB_STRING);

// MongoDB connection
mongoose
  .connect(connectionString, {
    autoIndex: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

// use route route
app.use("/api/leads", leadsRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/reports", pdfRoutes);

app.get("/", (req, res) => {
  res.send("ezymetrics is running .......");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
