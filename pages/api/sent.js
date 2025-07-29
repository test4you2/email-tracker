/**
 * Email Sent Tracking API
 * This API route logs when emails are sent from Excel/Outlook
 * It creates entries with "Open or Not" = "No" initially
 */

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYgPqOAu6vjcRjP9WwgFGRTGUhBeO-UPpSfPamAtBu4mWiFkTr3aoiOC8Ao9Awo_sGnA/exec';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get parameters from either GET or POST
    const data = req.method === 'POST' ? req.body : req.query;
    const { email, campaign, sentTime } = data;
    
    // Validate required parameters
    if (!email || !campaign) {
      console.error('Missing required parameters:', { email, campaign });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: email, campaign' 
      });
    }

    // Get user agent for tracking
    const userAgent = req.headers['user-agent'] || 'Excel/Outlook Macro';

    // Prepare tracking data for "sent" event
    const trackingData = {
      email: decodeURIComponent(email),
      campaign: decodeURIComponent(campaign),
      type: 'sent', // Special type for sent emails
      userAgent: userAgent,
      sentTime: sentTime ? decodeURIComponent(sentTime) : new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    // Send data to Google Sheets
    const result = await sendToGoogleSheets(trackingData);
    
    return res.status(200).json({
      success: true,
      message: 'Email sent tracking recorded successfully',
      data: result
    });

  } catch (error) {
    console.error('Error in sent tracking:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

async function sendToGoogleSheets(data) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Sent tracking data recorded successfully:', result);
    return result;

  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    throw error;
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}
