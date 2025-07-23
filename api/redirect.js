export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'];
  const query = req.query;
  const destination = query.to;
  const time = new Date().toISOString();

  console.log(`\n[LINK CLICKED]`);
  console.log(`Time: ${time}`);
  console.log(`IP: ${ip}`);
  console.log(`User Agent: ${ua}`);
  console.log(`Redirecting to: ${destination}`);
  console.log(`Query Params:`, query);

  if (destination) {
    res.writeHead(302, { Location: destination });
    res.end();
  } else {
    res.status(400).send("Missing 'to' parameter in redirect URL.");
  }
}
