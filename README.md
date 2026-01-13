# 前端开发能力测试项目

> **⚠️ 候选人请注意：** 请先阅读 [INTERVIEW_NOTES.md](./INTERVIEW_NOTES.md) 获取重要的测试说明和入口页面信息。

## 项目概述

这是一个用于评估前端开发者能力的技术测试项目，基于 AIRI 平台的 stage-web 架构。项目包含已完成的基础框架和待实现的功能模块，旨在考察候选人在实际开发场景中的问题解决能力、代码质量和工程实践。

**测试时长**: 60 分钟
**可用工具**: 任何自助工具（AI 助手、搜索引擎、文档等）
**评估标准**: 可运行的代码和功能完成度

## 技术栈

### 核心框架
- Vue 3 - Composition API、响应式系统
- TypeScript - 类型安全、接口定义
- Vite - 快速构建、HMR
- Pinia - 轻量级状态管理

### UI 与样式
- UnoCSS - 原子化 CSS 框架
- @proj-airi/unocss-preset-chromatic - 色彩系统
- unocss-preset-scrollbar - 滚动条样式

### 构建工具链
- pnpm - 包管理器
- Turbo - Monorepo 构建优化
- ESLint - 代码质量检查

## 项目结构

```
hiring-demo/
├── apps/
│   └── stage-web/                    # 主 Web 应用
│       ├── src/
│       │   ├── components/           # 可复用组件
│       │   │   ├── ChatInterface.vue     # 聊天界面 ☱
│       │   │   ├── InputControls.vue     # 多模态输入 ☱
│       │   │   └── StatusIndicator.vue   # 状态指示器 ☱
│       │   ├── pages/                # 页面组件
│       │   │   ├── test.vue              # 测试整合页面
│       │   │   └── settings/
│       │   │       └── memory/
│       │   │           └── index.vue     # 记忆配置 ☱
│       │   ├── stores/               # Pinia 状态管理
│       │   │   ├── chat.ts               # 聊天 Store
│       │   │   └── settings.ts           # 设置 Store ☱
│       │   ├── types/                # TypeScript 类型定义
│       │   └── utils/                # 工具函数
│       └── package.json
├── packages/                         # 共享包（Monorepo）
│   ├── audio/                        # 音频处理
│   ├── ccc/                          # Character Card Core
│   ├── font-*/                       # 字体包
│   ├── i18n/                         # 国际化
│   ├── server-sdk/                   # 服务端 SDK
│   ├── stage-ui/                     # 舞台 UI
│   ├── ui/                           # UI 组件库
│   └── vite-plugin-warpdrive/        # Vite 插件
├── docs/                             # 文档
├── TEST_SPEC.md                      # 详细测试说明
└── README.md                         # 本文件
```

☱标文件为主要测试目标

## 快速开始

### 环境要求
- Node.js >= 20.0.0
- pnpm >= 9.0.0

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建应用
pnpm build
```

### 访问应用
- **测试页面（推荐）**: http://localhost:5173/test ← **请在此页面完成所有任务**
- 主页面: http://localhost:5173
- 记忆设置: http://localhost:5173/settings/memory

> **提示：** 所有待实现的组件都已集成到 `/test` 页面，请优先使用该页面进行开发和测试。

## 测试任务

### 选择规则
- 时长: 60 分钟
- 策略: 从任务池中自选 1 个高星（★★★★☆/★★★★★）或若干中低星
- 评分: 完成度优先，代码质量同等重要

### 任务池

#### 聊天与多模态
- ★★★★★ 多模态输入整合（全链路） - `InputControls.vue`
  语音触发 + 图片上传预览 + 输入态切换与状态指示

- ★★★★☆ 消息流体验 - `ChatInterface.vue`
  发送/接收气泡 + 表情选择 + 自动滚动保持最新

- ★★★☆☆ 输入状态指示 - `StatusIndicator.vue`
  发送中/上传中/录音中状态可视化，含颜色与动画

- ★★☆☆☆ 表情插入与文本发送 - `ChatInterface.vue`
  表情面板接入、基础文本发送链路

#### 配置与偏好
- ★★★★☆ 记忆配置可靠性 - `settings/memory/index.vue`
  参数验证（范围/格式）、错误提示、保存与加载逻辑

- ★★★☆☆ 用户偏好持久化 - `stores/settings.ts`
  主题切换、本地存储同步、设置变化实时响应

- ★★☆☆☆ 配置表单可用性 - `settings/memory/index.vue`
  表单分组、提示文案、基础校验反馈

#### 状态可视化
- ★★★☆☆ 助手状态展示 - `StatusIndicator.vue`
  在线/思考/响应/离线的颜色编码、过渡动画

- ★★☆☆☆ 状态数据接入 - `StatusIndicator.vue`
  从现有 store/composable 读取状态并驱动 UI

## 开发要求

### 代码质量
- 使用 TypeScript 进行类型安全编程
- 组件尽可能结构清晰，职责单一
- 合理使用 Composition API
- 尽可能遵循 Vue 3 最佳实践
- 注意避免重复代码，多提取可复用逻辑

### UI/UX
- 响应式设计，适配移动设备
- 保持一致的视觉风格
- 平滑的过渡动画，稍微注重网页性能

### 技术规范
- 优先使用 UnoCSS 进行样式开发
- 尽量使用 Pinia 进行状态管理
- 可描述的数据流设计
- 具备错误处理机制

## 评估维度

### 功能完成度
- 是否达成自选子项的目标
- 边界情况处理是否完善
- 功能是否可用且稳定

### 代码质量
- TypeScript 类型定义完整性
- 组件职责拆分合理性
- 变量/函数/组件命名语义化
- 代码简洁性，无冗余或死代码

### 用户体验
- 操作是否有即时反馈
- 动画/状态可视化流畅性
- 移动端触控操作友好性
- 基础可访问性支持

### 工程习惯
- 是否有最小验证步骤
- 异常情况错误提示清晰性
- 是否遵循现有项目约定
- 代码可运行性，注释清晰度

## 开发调试

### 命令行工具
```bash
# 安装依赖
pnpm install

# 开发服务器（端口 5173）
pnpm dev

# 类型检查
pnpm -F @proj-airi/stage-web typecheck

# 代码检查
pnpm -F @proj-airi/stage-web lint

# 构建预览
pnpm -F @proj-airi/stage-web build
pnpm -F @proj-airi/stage-web preview
```

### API 约定
当前无真实后端调用，所有逻辑在本地 store/composable 内模拟。如需对接自定义接口：
- 可在 `api/` 目录增加 Vercel Serverless 函数
- 或在 `apps/stage-web/src/stores/` 中添加 fetch/mock 逻辑

### 调试技巧
- 使用 Vue DevTools 查看组件状态
- 使用 Pinia DevTools 调试状态管理
- 查看控制台的 TypeScript 类型错误
- 代码中的 TODO 注释标记了需要完成的部分

## 提示与建议

### 开发技巧
- 代码中已标注 TODO 的地方是需要完成或优化的部分
- 可以自由添加新的组件和工具函数
- 鼓励使用现有的 UI 组件库（packages/ui）
- 遇到问题可以查阅相关文档

### 常见陷阱
- 不要直接修改 props，使用 v-model 或事件传递
- 注意响应式丢失问题（解构、函数传递等）
- watch 需要处理初始值情况
- 异步操作记得处理 loading 和 error 状态

### 参考资源
- Vue 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Pinia: https://pinia.vuejs.org/getting-started.html
- UnoCSS: https://unocss.dev/interactive/
- @vueuse/core: https://vueuse.org/

## 提交要求

### 必需完成
- 完成自选的功能任务
- 代码提交到本地 Git 仓库
- 确保项目可正常运行（pnpm dev 无报错）
- 代码注释清晰（中英文均可）

### 提交检查清单
- [ ] 运行 pnpm install 成功
- [ ] 运行 pnpm dev 启动成功
- [ ] 访问相关页面功能正常
- [ ] 无 TypeScript 类型错误
- [ ] 无 ESLint 警告（可接受少量）
- [ ] 已提交到 Git 仓库的新 PR 分支（git status 无未提交文件）

---

# 祝你测试顺利
