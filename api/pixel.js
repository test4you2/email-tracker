export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'];
  const query = req.query;

  const logPayload = {
    type: "open",
    email: query.email || "",
    campaign: query.campaign || "",
    ip,
    ua,
  };

  await fetch("https://script.google.com/macros/s/AKfycbzwDruR-Eh06iWS-tMnims3n2IyRzQ4G5vwpvCUmCPHy8_3Ksgz15M8r8aS0PPmXm4t/exec", {
    method: "POST",
    body: JSON.stringify(logPayload),
    headers: { "Content-Type": "application/json" },
  });

  const img = Buffer.from('R0lGODlhAQABAAAAACwAAAAAAQABAAA=', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(img);
}
