import { getUserStore, setUserStore, setCorsHeaders } from './_store.js';

function getOffsetDate(baseDateStr, offset) {
  const d = new Date(baseDateStr);
  d.setDate(d.getDate() + offset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = req.body || {};
  const userId = body.userId || req.query.userId || req.headers['x-user-id'] || 'default_user';
  const userData = getUserStore(userId);

  const act = (body.action || 'create_task').toLowerCase();
  const title = body.title || body.text || '新任务';
  const date = body.date || '';
  const projectName = body.projectName || body.project || '工作';
  const newTitle = body.newTitle || '';
  const startTime = body.startTime || '';
  const endTime = body.endTime || '';
  const status = body.status || 'todo';

  console.log(`[BFF Task] User: ${userId} | Action: ${act} | Title: ${title} | Date: ${date} | Proj: ${projectName}`);

  // 1. CREATE TASK
  if (act === 'create_task' || act === 'create' || act === 'add') {
    const newTask = {
      id: 't_' + Math.random().toString(36).substring(2, 7),
      title: title,
      date: date || '2026-09-04',
      projectName: projectName,
      startTime: startTime,
      endTime: endTime,
      status: status
    };
    userData.tasks.push(newTask);
    setUserStore(userId, userData);
    return res.status(200).json({
      success: true,
      message: `已为用户 ${userId} 创建卡片: ${title}`,
      actionResult: { action: 'create_task', task: newTask },
      data: userData
    });
  }

  // 2. UPDATE TASK
  if (act === 'update_task' || act === 'update' || act === 'edit') {
    const match = title.toLowerCase();
    const task = userData.tasks.find(t => t.title.toLowerCase().includes(match) || (t.id === body.id));
    if (task) {
      if (date) task.date = date;
      if (projectName) task.projectName = projectName;
      if (newTitle) task.title = newTitle;
      if (body.status) task.status = body.status;
      if (startTime) task.startTime = startTime;
      if (endTime) task.endTime = endTime;
      setUserStore(userId, userData);
      return res.status(200).json({
        success: true,
        message: `已更新卡片: ${task.title}`,
        actionResult: { action: 'update_task', task: task },
        data: userData
      });
    }
  }

  // 3. DELETE TASK
  if (act === 'delete_task' || act === 'delete' || act === 'remove') {
    const match = title.toLowerCase();
    const initialCount = userData.tasks.length;
    userData.tasks = userData.tasks.filter(t => !t.title.toLowerCase().includes(match));
    setUserStore(userId, userData);
    return res.status(200).json({
      success: true,
      message: `已删除卡片: ${title}`,
      actionResult: { action: 'delete_task', deleted: userData.tasks.length < initialCount },
      data: userData
    });
  }

  // 4. CLEAR TASKS
  if (act === 'clear_tasks' || act === 'clear') {
    userData.tasks = [];
    setUserStore(userId, userData);
    return res.status(200).json({
      success: true,
      message: `已清空全部卡片`,
      actionResult: { action: 'clear_tasks' },
      data: userData
    });
  }

  return res.status(200).json({
    success: true,
    message: `Action accepted: ${act}`,
    data: userData
  });
}
