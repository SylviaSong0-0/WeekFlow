import { getUserStore, setUserStore, setCorsHeaders } from './_store.js';

function resolveColorHex(str) {
  if (!str) return '';
  const s = String(str).toLowerCase().trim();
  if (s.startsWith('#')) return s;
  const map = {
    '蓝': '#06b6d4', '蓝色': '#06b6d4', '天蓝': '#06b6d4', '深蓝': '#6366f1', 'blue': '#06b6d4',
    '粉': '#ec4899', '粉色': '#ec4899', 'pink': '#ec4899',
    '绿': '#22c55e', '绿色': '#22c55e', '草地绿': '#22c55e', 'green': '#22c55e',
    '紫': '#8b5cf6', '紫色': '#8b5cf6', 'purple': '#8b5cf6',
    '橙': '#f97316', '橙色': '#f97316', 'orange': '#f97316',
    '黄': '#eab308', '黄色': '#eab308', 'yellow': '#eab308',
    '红': '#ef4444', '红色': '#ef4444', 'red': '#ef4444',
    '青': '#14b8a6', '青色': '#14b8a6', 'cyan': '#14b8a6'
  };
  for (const k in map) {
    if (s.includes(k)) return map[k];
  }
  return str;
}

export default function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = req.body || {};
  const userId = body.userId || req.query.userId || req.headers['x-user-id'] || 'default_user';
  const userData = getUserStore(userId);

  const act = (body.action || 'create_project').toLowerCase();
  const name = body.name || '新项目';
  const color = resolveColorHex(body.color) || '#06b6d4';
  const newName = body.newName || '';

  console.log(`[BFF Project] User: ${userId} | Action: ${act} | Name: ${name} | Color: ${color} | NewName: ${newName}`);

  // 1. CREATE PROJECT
  if (act === 'create_project' || act === 'create' || act === 'add_project') {
    const newProj = {
      id: 'p_' + Math.random().toString(36).substring(2, 7),
      name: name,
      color: color,
      order: userData.projects.length + 1
    };
    userData.projects.push(newProj);
    setUserStore(userId, userData);
    return res.status(200).json({
      success: true,
      message: `已创建项目分类: ${name}`,
      actionResult: { action: 'create_project', id: newProj.id, name: newProj.name, color: newProj.color }
    });
  }

  // 2. UPDATE PROJECT
  if (act === 'update_project' || act === 'update' || act === 'edit_project') {
    const match = name.toLowerCase();
    const proj = userData.projects.find(p => p.name.toLowerCase().includes(match) || match.includes(p.name.toLowerCase()));
    if (proj) {
      if (body.color) proj.color = resolveColorHex(body.color);
      if (newName) proj.name = newName;
      setUserStore(userId, userData);
      return res.status(200).json({
        success: true,
        message: `已更新项目: ${proj.name}`,
        actionResult: { action: 'update_project', id: proj.id, name: proj.name, color: proj.color }
      });
    }
  }

  // 3. SET WEEKLY GOAL & MAIN FOCUS
  if (act === 'set_weekly_goal' || act === 'set_goal' || act === 'set_main_focus' || act === 'set_focus') {
    const match = name.toLowerCase();
    const proj = userData.projects.find(p => p.name.toLowerCase().includes(match) || match.includes(p.name.toLowerCase()));
    if (proj) {
      if (!userData.weeklyGoals) userData.weeklyGoals = {};
      const weekId = body.weekId || 'current';
      if (!userData.weeklyGoals[weekId]) userData.weeklyGoals[weekId] = {};
      if (!userData.weeklyGoals[weekId][proj.id]) userData.weeklyGoals[weekId][proj.id] = { isFocus: false, goal: '' };

      if (body.goal !== undefined) userData.weeklyGoals[weekId][proj.id].goal = body.goal;
      if (body.isFocus !== undefined) userData.weeklyGoals[weekId][proj.id].isFocus = Boolean(body.isFocus);

      setUserStore(userId, userData);
      return res.status(200).json({
        success: true,
        message: `已更新【${proj.name}】的本周目标与主线状态`,
        actionResult: {
          action: act,
          id: proj.id,
          name: proj.name,
          goal: userData.weeklyGoals[weekId][proj.id].goal,
          isFocus: userData.weeklyGoals[weekId][proj.id].isFocus
        }
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: `Project action accepted: ${act}`
  });
}
