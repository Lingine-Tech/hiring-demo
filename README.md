# 前端开发能力测试项目

> **⚠️ 候选人请注意：** 本测试使用**三步流程**，请先完整阅读本文件，再开始操作。更多细节见 [INTERVIEW_NOTES.md](./INTERVIEW_NOTES.md) 与 [TEST_SPEC.md](./TEST_SPEC.md)。

## 项目概述

这是一个用于评估前端开发者能力的**三步结构化**技术测试项目，基于 AIRI 平台的 stage-web 架构。项目包含已完成的基础框架和待实现的功能模块，旨在考察候选人完整的能力闭环：**读懂现有代码 → 实际做出功能 → 复盘并讲清思路**。

**测试时长**: 60 分钟
**可用工具**: 任何自助工具（AI 助手、搜索引擎、文档等）
**评估标准**: 三步完成质量 + 可运行代码 + 复盘阐述能力

---

## 三步评估流程

本测试按以下三步依次进行，每步均为独立评分项。请按顺序完成，并在最后统一提交。

### 第一步：Review 现有代码

**目标**：在动手写代码前，先系统性地 review 现有代码，输出一份**评审文档**。

**做什么**：
- 通读 `apps/stage-web/src/components/`、`apps/stage-web/src/pages/`、`apps/stage-web/src/stores/` 中的待实现代码
- 找出**存在的问题代码点**，每个问题点需给出：
  - `文件:行号` 定位
  - 问题描述（它错在哪、为什么是个问题）
  - **可选**的改进建议（怎么改、改完会怎样）

**评审文档要求**：
- 以 `REVIEW.md`（可放在仓库根目录）的形式产出
- 问题按严重程度或主题分组，结构清晰
- 覆盖范围建议至少包括：**输入/聊天组件、状态指示、设置存储**这三块中的两块以上
- 这一页着重考察**技术判断力**——你是否能一眼看到问题、是否知道更坏的边界情况、给出的建议是否可落地

> **提示**：这一步不要求你立刻改代码，但你的 review 结论可以作为第三步「自评讲解」的素材。

### 第二步：写 Feature（需录屏）

**目标**：基于第一步的 review，实现一个（或一组）功能，并**全程录制屏幕**，回放时**重点看候选人如何与 agent 交互**。

**做什么**：
- 从下方「任务池」中**自选** 1 个高星（★★★★☆/★★★★★）或若干中低星子项
- 实现该功能，确保可在 `/test` 页面运行
- **全程录屏**（系统自带录屏工具或 OBS 均可），录屏需要覆盖：
  - 你如何向 AI 助手提出需求 / 追问 / 修正
  - 你如何阅读、验证 agent 产出的代码
  - 你如何定位并修复 agent 遗漏的问题

**录屏重点**：考官会**回放录屏**，重点观察**候选人如何与 agent 交互**——包括提问的质量、是否盲目接受 agent 输出、校验与纠错习惯、返工节奏。**代码完成度与交互质量同等重要**。

**提交**：
- 功能代码（提交到本地 Git 仓库）
- 录屏文件（存放到指定位置或按约定命名，见下方「提交要求」）

### 第三步：Review 自己写的 Feature 代码

**目标**：对你自己在第二步写的代码做一次自我 review，**挑出其中几个点，解释你的实现思路**。

**做什么**：
- 重读你第二步的代码
- 挑出 **2–4 个**你认为最能体现设计意图的关键点（例如：状态管理的取舍、边界处理、组件拆分、错误路径）
- 针对每个点说明：
  - 当初**为什么这么写**（取舍依据）
  - 有哪些**可改进 / 已知的不足**（不要只挑好的说）
  - 如果时间允许，会怎么**进一步优化**

**产出**：可将这段自评写进 commit message 或单独一份 `SELF_REVIEW.md`。

---

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
├── TEST_SPEC.md                      # 详细测试说明（含各子项达成标准）
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

## 任务池（第二步选题来源）

### 选择规则
- 时长: 60 分钟（含三步全程）
- 策略: 从任务池中自选 1 个高星（★★★★☆/★★★★★）或若干中低星
- 评分: 完成度优先，代码质量同等重要

### 聊天与多模态
- ★★★★★ 多模态输入整合（全链路） - `InputControls.vue`
  语音触发 + 图片上传预览 + 输入态切换与状态指示

- ★★★★☆ 消息流体验 - `ChatInterface.vue`
  发送/接收气泡 + 表情选择 + 自动滚动保持最新

- ★★★☆☆ 输入状态指示 - `StatusIndicator.vue`
  发送中/上传中/录音中状态可视化，含颜色与动画

- ★★☆☆☆ 表情插入与文本发送 - `ChatInterface.vue`
  表情面板接入、基础文本发送链路

### 配置与偏好
- ★★★★☆ 记忆配置可靠性 - `settings/memory/index.vue`
  参数验证（范围/格式）、错误提示、保存与加载逻辑

- ★★★☆☆ 用户偏好持久化 - `stores/settings.ts`
  主题切换、本地存储同步、设置变化实时响应

- ★★☆☆☆ 配置表单可用性 - `settings/memory/index.vue`
  表单分组、提示文案、基础校验反馈

### 状态可视化
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

### 第一步 · 代码 Review
- 问题定位是否准确、是否命中关键代码点
- 对问题成因（而非表象）的分析是否到位
- 改进建议是否具体、可落地
- 覆盖面与组织（分组、优先级、可读性）

### 第二步 · Feature 实现
- 功能完成度：是否达成自选子项的目标、边界情况是否完善
- 代码质量：类型完整性、职责拆分、命名语义化、无冗余/死代码
- 用户体验：即时反馈、动画/状态可视化、移动端友好、基础可访问性
- 工程习惯：最小自测步骤、错误提示、遵循现有约定、注释清晰

### 第二步 · 与 Agent 交互（回放录屏重点）
- **提问质量**：能否把需求拆成清晰、可执行的问题
- **校验意识**：是否盲目接受 agent 输出，还是主动读码、验证、跑测试
- **纠错与返工**：发现问题时能否准确定位、有效引导 agent 修正
- **节奏把控**：是否有效利用 agent 提速，而非被它牵着走

### 第三步 · 自评与讲解
- 是否挑到真正有设计意图的关键点（而非流水账）
- 对取舍的解释是否自洽、有依据
- 是否有自省的「不足与可改进」意识
- 沟通是否清晰、结构化

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
- 完成**三步流程**中的每一步并产出对应交付物：
  - 第一步：`REVIEW.md`（代码评审文档）
  - 第二步：功能代码 + **录屏文件**（覆盖与 agent 交互过程）
  - 第三步：自评讲解（commit message 或 `SELF_REVIEW.md`）
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
- [ ] `REVIEW.md` 已产出（第一步）
- [ ] 已录制与 agent 交互的屏幕视频（第二步）
- [ ] 已提交自评讲解（第三步）

---

# 祝你测试顺利
