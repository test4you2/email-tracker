/**
 * Click Tracking Redirect
 * This API route logs link clicks and redirects to the original URL
 */

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzT1XCA5uHLxvIntWOGCqiOV_ZdsYcWsI2st5IDaQTIP_yuM1XcCMPKuRYGzbyOn_Pl2A/exec';

export default async function handler(req, res) {
  try {
    // Extract tracking parameters
    const { email, campaign, url, sentTime } = req.query;
    
    // Validate required parameters
    if (!email || !campaign || !url) {
      console.error('Missing required parameters:', { email, campaign, url });
      return res.status(400).json({ 
        error: 'Missing required parameters: email, campaign, url' 
      });
    }

    // Decode the destination URL
    const destinationUrl = decodeURIComponent(url);
    
    // Validate URL format
    if (!isValidUrl(destinationUrl)) {
      console.error('Invalid URL provided:', destinationUrl);
      return res.status(400).json({ error: 'Invalid destination URL' });
    }

    // Get user agent and IP for tracking
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    const referer = req.headers['referer'] || '';

    // Prepare tracking data
    const trackingData = {
      email: decodeURIComponent(email),
      campaign: decodeURIComponent(campaign),
      type: 'click',
      userAgent: userAgent,
      ipAddress: ipAddress,
      referer: referer,
      destinationUrl: destinationUrl,
      sentTime: sentTime ? decodeURIComponent(sentTime) : '',
      timestamp: new Date().toISOString()
    };

    // Send data to Google Sheets (non-blocking)
    sendToGoogleSheets(trackingData).catch(error => {
      console.error('Failed to send tracking data:', error);
    });

    // Redirect to the original URL
    res.writeHead(302, {
      'Location': destinationUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.end();

  } catch (error) {
    console.error('Error in click tracking:', error);
    
    // Try to redirect anyway if URL is available
    const { url } = req.query;
    if (url) {
      const destinationUrl = decodeURIComponent(url);
      if (isValidUrl(destinationUrl)) {
        res.writeHead(302, { 'Location': destinationUrl });
        return res.end();
      }
    }
    
    return res.status(500).json({ error: 'Internal server error' });
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
    console.log('Click tracking data sent successfully:', result);
    return result;

  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    throw error;
  }
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}
