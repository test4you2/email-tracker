/**
 * Email Open Tracking Pixel
 * This API route serves a 1x1 transparent pixel and logs email opens
 */

// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzT1XCA5uHLxvIntWOGCqiOV_ZdsYcWsI2st5IDaQTIP_yuM1XcCMPKuRYGzbyOn_Pl2A/exec';

export default async function handler(req, res) {
  try {
    // Extract tracking parameters
    const { email, campaign, sentTime } = req.query;
    
    // Validate required parameters
    if (!email || !campaign) {
      console.error('Missing required parameters:', { email, campaign });
      return serveTrackingPixel(res);
    }

    // Get user agent and IP for tracking
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

    // Prepare tracking data
    const trackingData = {
      email: decodeURIComponent(email),
      campaign: decodeURIComponent(campaign),
      type: 'open',
      userAgent: userAgent,
      ipAddress: ipAddress,
      sentTime: sentTime ? decodeURIComponent(sentTime) : '',
      timestamp: new Date().toISOString()
    };

    // Send data to Google Sheets (non-blocking)
    sendToGoogleSheets(trackingData).catch(error => {
      console.error('Failed to send tracking data:', error);
    });

    // Serve the tracking pixel
    return serveTrackingPixel(res);

  } catch (error) {
    console.error('Error in pixel tracking:', error);
    return serveTrackingPixel(res);
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
    console.log('Tracking data sent successfully:', result);
    return result;

  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    throw error;
  }
}

function serveTrackingPixel(res) {
  // Create 1x1 transparent PNG pixel
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );

  // Set headers for the pixel
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Length', pixel.length);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  res.status(200).send(pixel);
}

// Handle preflight requests
export const config = {
  api: {
    externalResolver: true,
  },
}
