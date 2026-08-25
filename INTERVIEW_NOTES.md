# 面试候选人须知

## 重要提示

### 测试流程（三步）

本测试按下述三步依次进行，**每一步都是独立评分项**。完整说明见 [README.md](./README.md) 的「三步评估流程」。

1. **第一步 · Review 现有代码** — 先通读待实现代码，输出一份 `REVIEW.md`（每个问题点给出 `文件:行号` + 问题描述 + 可选改进建议）。
2. **第二步 · 写 Feature（需录屏）** — 从任务池自选实现功能，并**全程录屏**。考官会回放录屏，重点看**你如何与 AI 助手交互**（如何提问、是否盲目接受输出、如何校验与纠错）。
3. **第三步 · Review 自己写的 Feature** — 挑 2–4 个关键点解释实现思路、取舍依据与可改进之处。

### 测试页面入口

**请使用以下页面进行功能测试：**

```
http://localhost:5173/test
```

该页面集成了所有需要实现的组件：
- **ChatInterface** - 聊天界面组件
- **InputControls** - 多模态输入控制
- **StatusIndicator** - 状态指示器
- **Settings** - 设置配置

### 快速开始

1. 启动开发服务器
   ```bash
   pnpm dev
   ```

2. 访问测试页面
   ```
   http://localhost:5173/test
   ```

3. **第一步**：通读待实现代码，产出 `REVIEW.md`

4. **第二步**：开始录制屏幕，并实现选定的任务
   - 选择 1 个高星任务（★★★★☆ 或 ★★★★★）
   - 或选择若干中低星任务组合
   - 录制与 AI 助手交互的全过程

5. **第三步**：在 `/test` 页面验证功能，重读自写代码并产出自评（`SELF_REVIEW.md` 或 commit message）

### 关键文件位置

```
apps/stage-web/src/
├── components/
│   ├── ChatInterface.vue       # 聊天界面（待实现）
│   ├── InputControls.vue       # 输入控制（待实现）
│   └── StatusIndicator.vue     # 状态指示（待实现）
├── pages/
│   ├── test.vue                # 测试页面（已完成，可直接使用）
│   └── settings/
│       └── memory/
│           └── index.vue       # 记忆配置（待实现）
└── stores/
    ├── chat.ts                 # 聊天 Store（已完成）
    └── settings.ts             # 设置 Store（待实现）
```

### 验证清单

在提交前请确认：

| 步骤 | 交付物 |
|------|--------|
| 第一步 | `REVIEW.md`（代码评审文档） |
| 第二步 | 功能代码 + **录屏文件**（覆盖与 AI 助手交互过程） |
| 第三步 | 自评讲解（`SELF_REVIEW.md` 或 commit message） |

- [ ] 代码可在 `/test` 页面正常运行
- [ ] 实现的功能符合任务要求
- [ ] TypeScript 类型定义完整
- [ ] 无控制台错误（WebSocket 错误可忽略）
- [ ] 移动端响应式布局正常
- [ ] 代码风格与项目一致（使用 UnoCSS Attributify）

---

**祝你面试顺利！** 🎉

如有任何技术问题，请查阅 README.md 和 TEST_SPEC.md 获取详细说明。
