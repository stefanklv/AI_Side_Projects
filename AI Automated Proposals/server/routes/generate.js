// server/routes/generate.js
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const puppeteer = require('puppeteer');
const Settings = require('../models/settingsModel'); // Import the Settings model

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/proposal', async (req, res) => {
  const { clientInfo, projectDetails, hourlyRate, generatePDF, timeEstimate, language } = req.body;
  console.log('Request received with body:', req.body);
  
  try {
    // Fetch settings from the database
    const settings = await Settings.findOne({});
    if (!settings) {
      throw new Error('Settings not found');
    }

    const formattedClientInfo = `
    **Name**: ${clientInfo[0]}
    **Industry**: ${clientInfo[1]}
    **Company Size**: ${clientInfo[2]}
    **Contact Information**: ${clientInfo[3]}
    **Primary Contact Person**: ${clientInfo[4]}
    `;

    const formattedProjectDetails = `
    **Goal**: ${projectDetails[0]}
    **Problems or Needs**: ${projectDetails[1]}
    **Importance**: ${projectDetails[2]}
    `;

    const formattedSettings = `
    **Prepared by**: ${settings.preparedBy}
    **Contact Information**: ${settings.contactInfo}
    **Date**: ${new Date().toLocaleDateString()}
    `;

    const prompt = `
    Create a detailed project plan proposal in ${language === 'no' ? 'Norwegian' : 'English'} based on the following client information and project details:

    ## Client Information:
    ${formattedClientInfo}

    ## Project Details:
    ${formattedProjectDetails}

    ## Settings:
    ${formattedSettings}

    The proposal should include:
    - Project Overview
    - Project Phases and Activities
    - Estimated Time for Each Phase in Hours
    - Overall Timeline in Hours (within the range of ${timeEstimate})
    - Estimated Costs Based on an Hourly Rate of ${hourlyRate} NOK excluding VAT
    - Objectives and Deliverables
    - Additional Relevant Information
    `;

    console.log('Generated prompt:', prompt);

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    });

    const proposal = completion.choices[0].message.content;
    console.log('Generated proposal:', proposal);

    if (generatePDF) {
      const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1, h2, h3 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          table, th, td { border: 1px solid #ccc; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .section { margin-bottom: 40px; }
        </style>
      </head>
      <body>
        ${proposal.replace(/\n/g, '<br />')}
      </body>
      </html>
      `;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
    } else {
      res.json({ proposal });
    }
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({ error: 'Failed to generate proposal', details: error.message });
  }
});

module.exports = router;
