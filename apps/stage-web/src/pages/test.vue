<script setup lang="ts">
/**
 * Test Page - 修复版 (Safe Mode)
 * 移除了可能导致崩溃的 Store 依赖，使用纯本地状态
 */

import { ref } from 'vue'
import type { AIStatus, ChatMessage } from '../types'
import ChatInterface from '../components/ChatInterface.vue'
import StatusIndicator from '../components/StatusIndicator.vue'

// ============================================
// State (本地状态，不再依赖 Store)
// ============================================

/** 当前助手状态 */
const aiStatus = ref<AIStatus>('online')
/** 暗黑模式状态 */
const isDark = ref(false)

/** 初始消息数据 */
const messages = ref<ChatMessage[]>([
  {
    id: 'init_1',
    role: 'assistant',
    content: 'Hello! I\'m your assistant. How can I help you today?',
    timestamp: new Date(),
    status: 'sent',
  },
])

/** 当前激活的标签页 */
const activeTab = ref<'chat' | 'settings'>('chat')

// ============================================
// Methods
// ============================================

/** * 处理消息发送 
 * 包含完整的模拟回复逻辑
 */
function handleSendMessage(content: string) {
  // 1. 立即把状态改为“思考中”
  aiStatus.value = 'thinking'

  // 2. 模拟网络延迟 (1秒)
  setTimeout(() => {
    aiStatus.value = 'responding'

    // 3. 模拟打字/生成延迟 (再过0.5秒)
    setTimeout(() => {
      messages.value.push({
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `我收到了你的消息：\n"${content}"\n(这是一个模拟回复)`,
        timestamp: new Date(),
        status: 'sent',
      })

      // 4. 回复完成，变回在线
      aiStatus.value = 'online'
    }, 500)
  }, 1000)
}

/** 切换状态演示 */
function cycleStatus() {
  const statuses: AIStatus[] = ['online', 'thinking', 'responding', 'offline', 'error']
  const idx = statuses.indexOf(aiStatus.value)
  aiStatus.value = statuses[(idx + 1) % statuses.length]
}

/** 切换暗黑模式 (本地模拟) */
function toggleTheme() {
  isDark.value = !isDark.value
  // 简单的 DOM 操作切换 class
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <header class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0 z-20 shadow-sm">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          Frontend Test Bench
        </h1>
        <StatusIndicator
          :status="aiStatus"
          size="sm"
          @click="cycleStatus"
        />
      </div>

      <button
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        @click="toggleTheme"
        title="Toggle Theme"
      >
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
      </button>
    </header>

    <nav class="flex px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0 z-10">
      <div class="flex gap-6">
        <button
          class="py-3 px-2 border-b-2 transition-colors font-medium text-sm"
          :class="activeTab === 'chat' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'chat'"
        >
          Chat Interface
        </button>
        <button
          class="py-3 px-2 border-b-2 transition-colors font-medium text-sm"
          :class="activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="activeTab = 'settings'"
        >
          Settings (Demo)
        </button>
      </div>
    </nav>

    <main class="flex-1 flex flex-col overflow-hidden relative">
      
      <div v-if="activeTab === 'chat'" class="absolute inset-0 flex flex-col">
        <ChatInterface
          :messages="messages"
          placeholder="Send a message..."
          @send="handleSendMessage"
        />
      </div>

      <div v-else class="p-8 max-w-2xl mx-auto w-full">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-bold mb-4 dark:text-white">Settings Demo</h2>
          <p class="text-gray-500">This section is simplified for the test.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* 全局重置，确保高度占满 */
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden; /* 防止最外层出现滚动条 */
}
</style>

<route lang="yaml">
name: TestPage
meta:
  layout: plain
</route>