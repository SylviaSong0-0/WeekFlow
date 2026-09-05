/**
 * Serverless Webhook Endpoint for Dify Tool: manage_project
 * Handles project category actions (create_project, update_project)
 */

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};
  const action = body.action || 'create_project';
  const name = body.name || '新项目';
  const color = body.color || '';
  const newName = body.newName || '';

  console.log(`[WeekFlow Webhook] manage_project called with action: ${action}, name: ${name}, color: ${color}, newName: ${newName}`);

  return res.status(200).json({
    success: true,
    code: 200,
    message: `Project action [${action}] accepted successfully for: ${name}`,
    data: {
      action,
      name,
      color,
      newName,
      receivedAt: new Date().toISOString()
    }
  });
}
