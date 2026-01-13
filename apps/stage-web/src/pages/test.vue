<script setup lang="ts">
/**
 * Test Page - 测试页面
 *
 * This page integrates all components for testing purposes.
 * Candidates can use this page to test their implementations.
 *
 * 此页面整合所有组件用于测试目的。
 * 求职者可以使用此页面测试他们的实现。
 */

import { onMounted, ref } from 'vue'
import type { AIStatus, ChatMessage } from '../types'
import ChatInterface from '../components/ChatInterface.vue'
import InputControls from '../components/InputControls.vue'
import StatusIndicator from '../components/StatusIndicator.vue'
import { useSettingsStore } from '../stores/settings'

// ============================================
// Store - Store
// ============================================

const settingsStore = useSettingsStore()

// ============================================
// State - 状态
// ============================================

/** 当前助手状态（测试用） */
const aiStatus = ref<AIStatus>('online')

/** Demo messages */
const messages = ref<ChatMessage[]>([
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 60000),
    status: 'sent',
  },
])

/** Active tab */
const activeTab = ref<'chat' | 'settings'>('chat')

// ============================================
// Methods - 方法
// ============================================

/**
 * Handle message send
 * 处理消息发送
 */
function handleSendMessage(content: string, images?: string[]): void {
  // 模拟助手处理流程
  aiStatus.value = 'thinking'

  // 模拟延迟响应
  setTimeout(() => {
    aiStatus.value = 'responding'

    // 添加响应消息
    setTimeout(() => {
      messages.value.push({
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `I received your message: "${content}". This is a demo response. ${images?.length ? `You also attached ${images.length} image(s).` : ''}`,
        timestamp: new Date(),
        status: 'sent',
      })

      aiStatus.value = 'online'
    }, 1500)
  }, 1000)
}

/**
 * Handle voice input
 * 处理语音输入
 */
function handleVoiceStop(audioBlob: Blob): void {
  console.log('Voice recording completed:', audioBlob.size, 'bytes')
  // 真实场景可用于语音转写
}

/**
 * Handle image selection
 * 处理图像选择
 */
function handleImageSelect(file: File, preview: string): void {
  console.log('Image selected:', file.name, preview.length)
  // 真实场景可挂载到消息发送参数
}

/**
 * Cycle through helper statuses for demo
 * 循环切换助手状态用于演示
 */
function cycleStatus(): void {
  const statuses: AIStatus[] = ['online', 'thinking', 'responding', 'offline', 'error']
  const currentIndex = statuses.indexOf(aiStatus.value)
  const nextIndex = (currentIndex + 1) % statuses.length
  aiStatus.value = statuses[nextIndex]
}

// ============================================
// Lifecycle - 生命周期
// ============================================

onMounted(() => {
  settingsStore.initialize()
})
</script>

<template>
  <div flex="~ col" min-h-screen bg="gray-50 dark:gray-900">
    <!-- Header -->
    <header
      flex="~ items-center justify-between"
      bg="white dark:gray-800"
      border="b gray-200 dark:gray-700"
      px-4 py-3
    >
      <div flex="~ items-center gap-4">
        <h1 text="xl gray-900 dark:gray-100" font-bold>
          Frontend Test Bench
        </h1>
        <StatusIndicator
          :status="aiStatus"
          size="sm"
          @click="cycleStatus"
        />
      </div>

      <!-- Theme Toggle -->
      <button
        p-2 rounded-lg
        bg="gray-100 dark:gray-700 hover:gray-200 dark:hover:gray-600"
        transition-colors
        @click="settingsStore.toggleDark()"
      >
        <div
          v-if="settingsStore.isDark"
          text="yellow-500 20"
          i-solar:sun-2-bold-duotone
        />
        <div
          v-else
          text="gray-600 20"
          i-solar:moon-bold-duotone
        />
      </button>
    </header>

    <!-- Tab Navigation -->
    <nav
      flex="~"
      bg="white dark:gray-800"
      border="b gray-200 dark:gray-700"
      px-4
    >
      <div flex="~ gap-4">
        <button
          border="b-2"
          :class="activeTab === 'chat' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'"
          px-4 py-3
          transition-colors
          @click="activeTab = 'chat'"
        >
          Chat Interface
        </button>
        <button
          border="b-2"
          :class="activeTab === 'settings' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'"
          px-4 py-3
          transition-colors
          @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main flex-1>
      <!-- Chat Tab -->
      <div v-if="activeTab === 'chat'" flex="~ col" h="[calc(100vh-120px)]">
        <!-- Chat Interface -->
        <div flex-1 overflow-hidden>
          <ChatInterface
            :messages="messages"
            placeholder="Type your message here..."
            @send="handleSendMessage"
          />
        </div>

        <!-- Input Controls -->
        <div
          p-4
          border="t gray-200 dark:gray-700"
          bg="white dark:gray-800"
        >
          <InputControls
            @voice-stop="handleVoiceStop"
            @image-select="handleImageSelect"
            @error="(msg) => console.error(msg)"
          />
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" p-6>
        <div max-w-2xl mx-auto>
          <h2 text="xl gray-900 dark:gray-100" font-bold mb-6>
            User Preferences
          </h2>

          <!-- Theme Setting -->
          <div mb-6 p-4 bg="white dark:gray-800" rounded-lg shadow-sm>
            <label text="sm gray-700 dark:gray-300" font-medium mb-2 block>
              Theme Mode
            </label>
            <div flex="~ gap-2">
              <button
                v-for="mode in ['light', 'dark', 'system'] as const"
                :key="mode"
                :class="settingsStore.theme === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
                px-4 py-2 rounded-lg capitalize
                transition-colors
                @click="settingsStore.setTheme(mode)"
              >
                {{ mode }}
              </button>
            </div>
          </div>

          <!-- Font Size Setting -->
          <div mb-6 p-4 bg="white dark:gray-800" rounded-lg shadow-sm>
            <label text="sm gray-700 dark:gray-300" font-medium mb-2 block>
              Font Size
            </label>
            <div flex="~ gap-2">
              <button
                v-for="size in ['small', 'medium', 'large'] as const"
                :key="size"
                :class="settingsStore.fontSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
                px-4 py-2 rounded-lg capitalize
                transition-colors
                @click="settingsStore.setFontSize(size)"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Toggle Settings -->
          <div mb-6 p-4 bg="white dark:gray-800" rounded-lg shadow-sm space-y-4>
            <div flex="~ items-center justify-between">
              <span text="gray-700 dark:gray-300">Sound Effects</span>
              <button
                :class="settingsStore.soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                relative w-12 h-6 rounded-full
                transition-colors
                @click="settingsStore.updateSetting('soundEnabled', !settingsStore.soundEnabled)"
              >
                <span
                  :class="settingsStore.soundEnabled ? 'translate-x-6' : 'translate-x-1'"
                  absolute top-1 w-4 h-4 bg-white rounded-full
                  transition-transform shadow
                />
              </button>
            </div>

            <div flex="~ items-center justify-between">
              <span text="gray-700 dark:gray-300">Notifications</span>
              <button
                :class="settingsStore.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                relative w-12 h-6 rounded-full
                transition-colors
                @click="settingsStore.updateSetting('notificationsEnabled', !settingsStore.notificationsEnabled)"
              >
                <span
                  :class="settingsStore.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'"
                  absolute top-1 w-4 h-4 bg-white rounded-full
                  transition-transform shadow
                />
              </button>
            </div>

            <div flex="~ items-center justify-between">
              <span text="gray-700 dark:gray-300">Send on Enter</span>
              <button
                :class="settingsStore.sendOnEnter ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
                relative w-12 h-6 rounded-full
                transition-colors
                @click="settingsStore.updateSetting('sendOnEnter', !settingsStore.sendOnEnter)"
              >
                <span
                  :class="settingsStore.sendOnEnter ? 'translate-x-6' : 'translate-x-1'"
                  absolute top-1 w-4 h-4 bg-white rounded-full
                  transition-transform shadow
                />
              </button>
            </div>
          </div>

          <!-- Reset Button -->
          <button
            w-full py-3
            border="~ red-500"
            text="red-500"
            rounded-lg
            bg="hover:red-50 dark:hover:red-900/20"
            transition-colors
            @click="settingsStore.resetToDefault()"
          >
            Reset to Default Settings
          </button>
        </div>
      </div>
    </main>

    <!-- Instructions Panel -->
    <aside
      fixed bottom-4 right-4
      max-w-sm
      bg="white dark:gray-800"
      rounded-lg shadow-lg
      border="~ gray-200 dark:gray-700"
      p-4
      z-50
    >
      <h3 font-bold text="gray-900 dark:gray-100" mb-2>
        Test Instructions
      </h3>
      <ul text="sm gray-600 dark:gray-400" space-y-1>
        <li>• Click status indicator to cycle through states</li>
        <li>• Test chat interface messaging</li>
        <li>• Try voice and image input controls</li>
        <li>• Switch between tabs to test settings</li>
        <li>• Toggle dark mode with the button in header</li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  aside {
    left: 16px;
    right: 16px;
    max-width: none;
  }
}
</style>

<route lang="yaml">
name: TestPage
meta:
  layout: plain
</route>
