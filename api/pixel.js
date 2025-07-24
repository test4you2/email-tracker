export default async function handler(req, res) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ua = req.headers['user-agent'];
    const query = req.query;
    
    // Validate required parameters
    if (!query.email || !query.campaign) {
      console.log('Missing email or campaign parameters');
      // Still return the pixel even if tracking fails
      const img = Buffer.from('R0lGODlhAQABAAAAACwAAAAAAQABAAA=', 'base64');
      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).send(img);
    }
    
    const logPayload = {
      type: "open",
      email: query.email,
      campaign: query.campaign,
      ip,
      ua,
    };
    
    console.log('Sending tracking data:', logPayload);
    
    // Send tracking data to Google Apps Script
    const response = await fetch("https://script.google.com/macros/s/AKfycbxZc-PajBPbLmm6mx7iuR-ngKOAeLzLoBrUulrgNRSVDwSEXkBuwrKOxnuA86Fqebp_/exec", {
      method: "POST",
      body: JSON.stringify(logPayload),
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });
    
    // Log the response for debugging
    const responseText = await response.text();
    console.log('GAS Response Status:', response.status);
    console.log('GAS Response Text:', responseText);
    
    if (!response.ok) {
      console.error('Failed to send tracking data:', response.status, responseText);
    }
    
  } catch (error) {
    console.error('Error in pixel tracking:', error);
    // Don't fail the pixel request even if tracking fails
  }
  
  // Always return the tracking pixel
  const img = Buffer.from('R0lGODlhAQABAAAAACwAAAAAAQABAAA=', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Expires', '0');
  res.setHeader('Pragma', 'no-cache');
  res.status(200).send(img);
}
