## Why

`ChatInterface.vue` 目前是一个带 TODO 的聊天界面骨架，消息展示、输入发送和交互反馈没有形成可验证的完整体验。补齐消息流基础能力可以让测试页面真实承载一轮对话，并为后续接入实际消息服务提供稳定、可测试的组件行为。

## What Changes

- Render incoming and outgoing messages as visually distinct bubbles aligned to the appropriate side.
- Send trimmed text messages from the button and keyboard, clear the composer, expose the existing `send` event, and represent transient sending state.
- Provide an accessible common-emoji picker that inserts the selected emoji into the composer and closes after selection.
- Render a localized time label for every message and a visible sending indicator while a message is pending.
- Render the correct avatar for user and assistant messages, with per-message avatar overrides and component defaults.
- Keep the message viewport at the latest message after initial load, external updates, and newly sent messages, with smooth scrolling.
- Add focused component-level checks for each capability before moving to the next implementation task; the implementation workflow pauses after each tested requirement for repository upload.

## Capabilities

### New Capabilities

- `chat-message-flow`: Complete the `ChatInterface.vue` message rendering, composer interactions, emoji insertion, metadata display, avatar handling, and latest-message scrolling contract.

### Modified Capabilities

- None.

## Impact

- Primary implementation surface: `hiring-demo/apps/stage-web/src/components/ChatInterface.vue`.
- Existing `ChatMessage` and `MessageRole` types remain the component contract; no backend or persistence API changes are required.
- Validation uses the existing Vue/Vite toolchain (`vue-tsc`, ESLint, and the project's available browser/component test setup). A small test harness may be added only if needed to exercise the component.
