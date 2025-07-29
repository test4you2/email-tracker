/**
 * System Status API
 * Simple endpoint to verify the tracking system is working
 */

export default function handler(req, res) {
  const status = {
    service: 'Email Tracking System',
    status: 'operational',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      pixel: '/api/pixel?email=pixel@example.com&campaign=july',
      redirect: '/api/redirect?email=redirect@example.com&campaign=redirect&url=https://deltaraqiya.com'
    },
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(status);
}
