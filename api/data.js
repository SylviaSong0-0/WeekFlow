import { getUserStore, setUserStore, setCorsHeaders } from './_store.js';

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const userId = req.query.userId || req.headers['x-user-id'] || req.body?.userId || 'default_user';

  if (req.method === 'GET') {
    const data = getUserStore(userId);
    return res.status(200).json({
      success: true,
      code: 200,
      data
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const updated = setUserStore(userId, body);
    return res.status(200).json({
      success: true,
      code: 200,
      data: updated
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
