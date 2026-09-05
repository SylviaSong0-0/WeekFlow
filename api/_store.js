/**
 * In-Memory & File Persistence Store for WeekFlow BFF
 * Automatically isolates data per User ID
 */

// In-memory tenant store (for instant serverless execution)
const tenantStore = new Map();

// Default initial state for new users
function getDefaultUserData(userId) {
  return {
    userId: userId || 'default_user',
    projects: [
      { id: 'p1', name: '工作', color: '#06b6d4', order: 1 },
      { id: 'p2', name: '生活', color: '#22c55e', order: 2 },
      { id: 'p3', name: '学习', color: '#8b5cf6', order: 3 }
    ],
    tasks: [
      { id: 't1', title: '完成 WeekFlow PRD', date: '2026-09-04', projectName: '工作', projectId: 'p1', status: 'todo' },
      { id: 't2', title: '买猫粮与猫砂', date: '2026-09-05', projectName: '生活', projectId: 'p2', status: 'todo' },
      { id: 't3', title: '复习 LeetCode 3道', date: '2026-09-06', projectName: '学习', projectId: 'p3', status: 'todo' }
    ],
    updatedAt: new Date().toISOString()
  };
}

export function getUserStore(userId = 'default_user') {
  const uid = String(userId).trim() || 'default_user';
  if (!tenantStore.has(uid)) {
    tenantStore.set(uid, getDefaultUserData(uid));
  }
  return tenantStore.get(uid);
}

export function setUserStore(userId = 'default_user', data) {
  const uid = String(userId).trim() || 'default_user';
  data.updatedAt = new Date().toISOString();
  tenantStore.set(uid, data);
  return data;
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id'
  );
}
