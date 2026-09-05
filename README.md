# WeekFlow 🐱 · AI Agent 驱动的周看板与时间伴跑系统

> 一款专为多线程任务推进者打造的「无负罪感、高灵活性」周看板。内置 AI 智能伴跑猫咪，支持自然语言卡片调度与原生 Function Calling 架构。

---

## 🌟 核心特性

- 📅 **7 日矩阵周看板**：周一至周日一目了然，支持拖拽、多项目分类与色彩标签。
- 🐱 **AI 智能时间伴跑**：基于 Dify Agent 架构，支持打字机流式对话与温柔共情（零负罪感设计）。
- ⚡ **原生 Function Calling 闭环**：
  - 基于 OpenAPI 3.0 标准定义 `manage_task` 与 `manage_project` 工具。
  - 内置 Serverless Webhook 端点 (`/api/manage_task` & `/api/manage_project`)，与 Dify 实现 100% 结构化协议联动。
- 🧪 **自动化冷启动评测集**：配套 25 条黄金种子测试集（Gold Seeds）与三层 Oracle 质量打分看板。

---

## 🚀 部署架构

本项目支持一键部署至 **Vercel**：
- **前端静态托管**：`index.html` 全球 CDN 秒级加速。
- **后端 Serverless Webhook**：`/api/manage_task` 与 `/api/manage_project` 自动作为 Dify 工具的公网接收端。
