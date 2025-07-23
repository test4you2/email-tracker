export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ua = req.headers['user-agent'];
  const query = req.query;
  const destination = query.to;

  const logPayload = {
    type: "click",
    email: query.email || "",
    campaign: query.campaign || "",
    ip,
    ua,
  };

  await fetch("https://script.google.com/macros/s/AKfycbyt8aX1Xh1e4hBLZ187mzrX2XLOQCsaFjVaUVz8vglx5j2mteweoWF-SWY7u2eaKVP9/exec", {
    method: "POST",
    body: JSON.stringify(logPayload),
    headers: { "Content-Type": "application/json" },
  });

  if (destination) {
    res.writeHead(302, { Location: destination });
    res.end();
  } else {
    res.status(400).send("Missing 'to' parameter in redirect URL.");
  }
}
