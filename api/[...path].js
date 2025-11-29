export default async function handler(req, res) {
  try {
    // Extract the path after /api/
    const { path } = req.query;
    const targetUrl = `${process.env.BACKEND_URL}/${path.join('/')}`;

    // Forward the request to your .NET backend
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(process.env.BACKEND_URL).host, // ensure correct Host header
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    // Copy headers (including cookies) back to client
    backendRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Stream response back
    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
