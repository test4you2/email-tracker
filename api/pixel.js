export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'];
  const query = req.query;
  const time = new Date().toISOString();

  console.log(`\n[EMAIL OPENED]`);
  console.log(`Time: ${time}`);
  console.log(`IP: ${ip}`);
  console.log(`User Agent: ${ua}`);
  console.log(`Query Params:`, query);

  const img = Buffer.from('R0lGODlhAQABAAAAACwAAAAAAQABAAA=', 'base64');
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(img);
}
