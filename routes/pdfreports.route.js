const express = require("express");
const PDFDocument = require("pdfkit");
const Lead = require("../models/Lead");
const Campaign = require("../models/Campaign");
const router = express.Router();

// PDF report route
router.get("/pdf", async (req, res) => {
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

module.exports = router;
