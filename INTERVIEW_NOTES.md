# 面试候选人须知

## 重要提示

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

3. 开始实现选定的任务
   - 选择 1 个高星任务（★★★★☆ 或 ★★★★★）
   - 或选择若干中低星任务组合

4. 在 `/test` 页面验证功能

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

- [ ] 代码可在 `/test` 页面正常运行
- [ ] 实现的功能符合任务要求
- [ ] TypeScript 类型定义完整
- [ ] 无控制台错误（WebSocket 错误可忽略）
- [ ] 移动端响应式布局正常
- [ ] 代码风格与项目一致（使用 UnoCSS Attributify）

---

**祝你面试顺利！** 🎉

如有任何技术问题，请查阅 README.md 和 TEST_SPEC.md 获取详细说明。
