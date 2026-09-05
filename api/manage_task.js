/**
 * Serverless Webhook Endpoint for Dify Tool: manage_task
 * Handles task card actions (create_task, update_task, delete_task, clear_tasks)
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
  const action = body.action || 'create_task';
  const title = body.title || body.text || '新任务';
  const date = body.date || '';

  console.log(`[WeekFlow Webhook] manage_task called with action: ${action}, title: ${title}, date: ${date}`);

  return res.status(200).json({
    success: true,
    code: 200,
    message: `Task action [${action}] accepted successfully for: ${title}`,
    data: {
      action,
      title,
      date,
      receivedAt: new Date().toISOString()
    }
  });
}
