# 前端开发测试规范

## 测试说明

本测试用于 60 分钟技术面试，候选人可跨子项自选实现。可使用任意工具，最终以可运行代码和完成度为准。

### 测试模式
- 时间: 60 分钟
- 选题: 完成 1 个高星（★★★★☆/★★★★★）或若干中低星子项，可跨主题组合
- 提交: 确保能运行，说明已完成子项，必要时附最小验证步骤

### 考察维度
- 功能完成度: 达成子项目标并覆盖关键边界
- 代码质量: 类型/校验、职责拆分、命名与可读性、避免重复和死代码
- 用户体验: 交互反馈、动画与状态可视化、移动端适配、基础可访问性
- 工程习惯: 最小自测步骤、错误提示、符合现有样式与状态管理约定

## 任务子项详细说明

### 聊天与多模态

#### ★★★★★ 多模态输入整合
**文件**: `apps/stage-web/src/components/InputControls.vue`

**达成标准**:
- 语音触发流程: 启动/结束/错误提示
- 图片上传与预览: 文件选择、缩略图展示、删除操作
- 输入模式切换: 文本/语音/图片模式切换，状态指示同步
- 异常处理: 无权限、文件过大、格式错误等边界情况

**验收要点**:
- 按钮状态与异常提示可见
- 图片预览无刷新闪烁
- 移动端触控可用
- 模式切换流畅且状态一致

#### ★★★★☆ 消息流体验
**文件**: `apps/stage-web/src/components/ChatInterface.vue`

**达成标准**:
- 发送/接收气泡样式: 区分用户和助手消息，包含头像和时间戳
- 表情插入: 表情面板选择，插入到输入框光标位置
- 自动滚动: 发送后自动滚动到最新消息，长列表性能优化

**验收要点**:
- 气泡对齐与头像/时间戳显示清晰
- 表情能正确插入文本且位置准确
- 长列表滚动流畅，无明显卡顿
- 新消息进入时自动定位到底部

#### ★★★☆☆ 输入状态指示
**文件**: `apps/stage-web/src/components/StatusIndicator.vue`

**达成标准**:
- 状态类型: 发送中/上传中/录音中/空闲等
- 视觉呈现: 颜色编码、加载动画、文字提示
- 状态联动: 与输入/上传逻辑联动，实时更新

**验收要点**:
- 状态切换平滑，无闪烁
- 动画效果清晰可见
- 不同状态颜色区分明显
- 无长时间卡在过渡态

#### ★★☆☆☆ 表情插入与文本发送
**文件**: `apps/stage-web/src/components/ChatInterface.vue`

**达成标准**:
- 表情面板: 显示常用表情，支持点击选择
- 文本发送: 基础发送链路，包含输入框清空和状态重置
- 快捷操作: 支持回车发送

**验收要点**:
- 表情正确插入到输入框
- 发送后清空输入框
- 发送按钮状态正确（禁用/启用）
- 基础键盘快捷键可用

### 配置与偏好

#### ★★★★☆ 记忆配置可靠性
**文件**: `apps/stage-web/src/pages/settings/memory/index.vue`

**达成标准**:
- 参数验证: 范围检查（如记忆条数 1-100）、格式校验
- 错误提示: 即时反馈，提示位置合理
- 保存/加载流程: 数据持久化，刷新后仍能加载
- 边界回退策略: 非法值自动回退到默认值

**验收要点**:
- 输入非法值有即时提示
- 保存后刷新页面仍能正确加载
- 移动端表单可操作
- 错误提示位置不遮挡输入框

#### ★★★☆☆ 用户偏好持久化
**文件**: `apps/stage-web/src/stores/settings.ts`, `apps/stage-web/src/pages/test.vue`

**达成标准**:
- 主题切换: 亮色/暗色主题切换，全局生效
- 本地存储同步: 使用 localStorage/sessionStorage
- 设置变化实时响应: 切换后 UI 立即更新

**验收要点**:
- 刷新后仍保留主题选择
- 切换无明显闪屏或重绘
- 多标签页可同步（可模拟）
- 数据结构合理，易扩展

#### ★★☆☆☆ 配置表单可用性
**文件**: `apps/stage-web/src/pages/settings/memory/index.vue`

**达成标准**:
- 表单分组: 逻辑相关的配置项分组展示
- 提示文案: 每个配置项有清晰的说明文字
- 基础校验: 必填项、格式检查、提交/重置流程

**验收要点**:
- 表单布局清晰，分组合理
- 提示文案易于理解
- 必填项验证正确
- 键盘和触控操作流畅

### 状态可视化

#### ★★★☆☆ 助手状态展示
**文件**: `apps/stage-web/src/components/StatusIndicator.vue`

**达成标准**:
- 状态类型: 在线/思考/响应/离线等
- 颜色编码: 每种状态有独特的颜色标识
- 过渡动画: 状态切换时有平滑动画
- 文字标签: 除颜色外还有文字说明

**验收要点**:
- 状态切换动画平滑
- 颜色和文字标签同步
- 可适配暗色模式
- 动画不影响性能

#### ★★☆☆☆ 状态数据接入
**文件**: `apps/stage-web/src/components/StatusIndicator.vue`

**达成标准**:
- 数据源: 从现有 store 或 composable 读取状态
- 空态保护: 无数据时有默认显示
- 错误态保护: 状态切换不抛异常

**验收要点**:
- 成功读取 store 中的状态数据
- 无数据时显示默认状态
- 状态更新时 UI 同步刷新
- 异常情况不导致崩溃

## 路由与入口

### 页面路由
```
/                                    -> 主页
/test                                -> 测试整合页面
/settings/memory                     -> 记忆配置
/settings/system                     -> 系统设置
/settings/system/developer           -> 开发者设置
/devtools/audio-record               -> 音频录制工具
/devtools/background-removal         -> 背景移除工具
/devtools/gesture-circle             -> 手势圆圈工具
```

### 组件入口
以下组件无独立路由，需在页面中挂载验证:
- `apps/stage-web/src/components/ChatInterface.vue`
- `apps/stage-web/src/components/InputControls.vue`
- `apps/stage-web/src/components/StatusIndicator.vue`

建议在 `/test` 页面或自行创建测试页面进行验证。

## 技术约定

### TypeScript 类型定义
所有组件和函数需要完整的类型定义:
```typescript
// 示例: Props 定义
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

// 示例: Emits 定义
const emit = defineEmits<{
  send: [message: string]
  delete: [id: string]
}>()
```

### Pinia Store 规范
```typescript
// 示例: Store 定义
export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])

  function addMessage(message: ChatMessage) {
    messages.value.push(message)
  }

  return { messages, addMessage }
})
```

### UnoCSS 样式规范
优先使用原子化类名:
```vue
<!-- 推荐 -->
<div class="flex items-center gap-2 p-4 bg-white dark:bg-gray-800">

<!-- 不推荐 -->
<div class="custom-container">
```

### 错误处理规范
```typescript
// 示例: 异步操作错误处理
async function uploadImage(file: File) {
  try {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('文件大小不能超过 5MB')
    }

    const result = await api.upload(file)
    return result
  } catch (error) {
    console.error('上传失败:', error)
    // 显示错误提示
    showError(error.message)
  }
}
```

## 调试与验证

### 本地开发
```bash
# 启动开发服务器
pnpm dev

# 访问测试页面
http://localhost:5173/test
```

### 功能验证步骤

#### 聊天功能验证
1. 打开 `/test` 页面
2. 输入文本并发送
3. 检查消息是否正确显示
4. 检查自动滚动是否生效

#### 配置功能验证
1. 打开 `/settings/memory` 页面
2. 修改配置项
3. 点击保存
4. 刷新页面检查是否保留

#### 状态显示验证
1. 触发状态变化（如发送消息）
2. 检查状态指示器是否正确更新
3. 检查动画效果是否流畅

### 常见问题排查

#### 问题: 组件不显示
- 检查组件是否正确导入
- 检查路由配置是否正确
- 检查控制台是否有错误

#### 问题: 样式不生效
- 检查 UnoCSS 类名是否正确
- 检查是否在 uno.config.ts 中配置
- 检查浏览器控制台的样式计算

#### 问题: 状态不更新
- 检查是否使用了响应式 API（ref/reactive）
- 检查是否正确调用 store 的 actions
- 检查组件是否正确订阅状态变化

## 提交说明

### 提交内容
- 所有修改的源代码文件
- 必要的配置文件修改
- 简要的功能说明（可在 commit message 中）

### 提交格式建议
```bash
git add .
git commit -m "feat: 实现多模态输入整合功能

- 添加语音录制触发逻辑
- 实现图片上传与预览
- 完善输入状态切换
- 增加错误处理和边界保护
"
```

### 验证清单
在提交前请确认:
- [ ] 代码可以正常运行（pnpm dev 无报错）
- [ ] 实现的功能经过基本测试
- [ ] 代码有必要的类型定义
- [ ] 关键逻辑有注释说明
- [ ] 无明显的代码质量问题
