<script setup lang="ts">
/**
 * Memory Settings Page
 * 记忆配置页面 - 包含表单校验、持久化存储和用户体验优化
 */

import { onMounted, reactive, ref } from 'vue'

// ============================================
// Types & Constants
// ============================================

interface MemoryConfig {
  enabled: boolean
  contextWindow: number
  maxHistoryMessages: number
  strategy: 'summary' | 'buffer' | 'vector'
  autoSummaryThreshold: number
}

interface FormErrors {
  contextWindow?: string
  maxHistoryMessages?: string
  autoSummaryThreshold?: string
}

const STORAGE_KEY = 'memory_config'

const DEFAULT_CONFIG: MemoryConfig = {
  enabled: true,
  contextWindow: 4096,
  maxHistoryMessages: 20,
  strategy: 'buffer',
  autoSummaryThreshold: 100,
}

// ============================================
// State
// ============================================

const formData = reactive<MemoryConfig>({ ...DEFAULT_CONFIG })
const errors = reactive<FormErrors>({})
const isLoading = ref(false)
const isSaving = ref(false)
const toastMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)

// ============================================
// Validation Logic
// ============================================

function validateField(field: keyof FormErrors) {
  errors[field] = undefined

  switch (field) {
    case 'contextWindow':
      if (!formData.contextWindow) {
        errors.contextWindow = 'Context window is required'
      } else if (formData.contextWindow < 1024 || formData.contextWindow > 128000) {
        errors.contextWindow = 'Value must be between 1024 and 128000'
      }
      break
    
    case 'maxHistoryMessages':
      if (!formData.maxHistoryMessages) {
        errors.maxHistoryMessages = 'History limit is required'
      } else if (formData.maxHistoryMessages < 1 || formData.maxHistoryMessages > 100) {
        errors.maxHistoryMessages = 'Value must be between 1 and 100'
      }
      break

    case 'autoSummaryThreshold':
      if (formData.strategy === 'summary') {
        if (!formData.autoSummaryThreshold) {
          errors.autoSummaryThreshold = 'Threshold is required'
        } else if (formData.autoSummaryThreshold < 10) {
          errors.autoSummaryThreshold = 'Minimum threshold is 10 messages'
        }
      }
      break
  }
}

function validateForm(): boolean {
  validateField('contextWindow')
  validateField('maxHistoryMessages')
  validateField('autoSummaryThreshold')
  return !Object.values(errors).some(msg => msg !== undefined)
}

// ============================================
// Actions
// ============================================

function loadSettings() {
  isLoading.value = true
  // 模拟从后端加载
  setTimeout(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        Object.assign(formData, JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load memory settings', e)
    } finally {
      isLoading.value = false
    }
  }, 500)
}

async function saveSettings() {
  if (!validateForm()) {
    showToast('error', 'Please fix the validation errors')
    return
  }
  isSaving.value = true
  // 模拟 API 保存延迟
  await new Promise(resolve => setTimeout(resolve, 800))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    showToast('success', 'Memory settings saved successfully')
  } catch (e) {
    showToast('error', 'Failed to save settings')
  } finally {
    isSaving.value = false
  }
}

function resetDefaults() {
  if (confirm('Are you sure you want to reset all memory settings to default?')) {
    Object.assign(formData, DEFAULT_CONFIG)
    errors.contextWindow = undefined
    errors.maxHistoryMessages = undefined
    errors.autoSummaryThreshold = undefined
    showToast('success', 'Settings reset to defaults')
  }
}

function showToast(type: 'success' | 'error', text: string) {
  toastMessage.value = { type, text }
  setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="memory-settings bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-4">
    <div class="mb-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span>🧠</span> Memory Configuration
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Configure how the AI remembers and manages context from your conversations.
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="space-y-8">
      <div class="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100">Enable Long-term Memory</h3>
          <p class="text-xs text-gray-500 mt-1">Allow AI to retain context across sessions</p>
        </div>
        <button 
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
          :class="formData.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
          @click="formData.enabled = !formData.enabled"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="formData.enabled ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <div 
        class="space-y-6 transition-opacity duration-200"
        :class="{ 'opacity-50 pointer-events-none': !formData.enabled }"
      >
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-4 uppercase tracking-wider text-xs">Basic Constraints</h3>
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Context Window (Tokens)</label>
              <input 
                v-model.number="formData.contextWindow"
                type="number"
                class="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                :class="errors.contextWindow ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @blur="validateField('contextWindow')"
              >
              <p v-if="errors.contextWindow" class="mt-1 text-xs text-red-500">{{ errors.contextWindow }}</p>
              <p v-else class="mt-1 text-[10px] text-gray-400">Max tokens (1024 - 128k)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max History Messages</label>
              <input 
                v-model.number="formData.maxHistoryMessages"
                type="number"
                class="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                :class="errors.maxHistoryMessages ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @blur="validateField('maxHistoryMessages')"
              >
              <p v-if="errors.maxHistoryMessages" class="mt-1 text-xs text-red-500">{{ errors.maxHistoryMessages }}</p>
              <p v-else class="mt-1 text-[10px] text-gray-400">Recent messages to keep active</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-4 uppercase tracking-wider text-xs">Strategy</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button 
                v-for="strat in ['buffer', 'summary', 'vector'] as const" 
                :key="strat"
                class="px-3 py-2 rounded-lg border text-left transition-all text-sm"
                :class="formData.strategy === strat 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'"
                @click="formData.strategy = strat"
              >
                <div class="font-medium capitalize">{{ strat }}</div>
              </button>
            </div>

            <div v-if="formData.strategy === 'summary'" class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auto-Summary Threshold: <span class="font-mono">{{ formData.autoSummaryThreshold }}</span>
              </label>
              <input 
                v-model.number="formData.autoSummaryThreshold"
                type="range" min="10" max="500" step="10"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button 
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        @click="resetDefaults"
      >
        Reset
      </button>
      <button 
        class="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
        :disabled="isSaving || isLoading"
        @click="saveSettings"
      >
        <span v-if="isSaving" class="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></span>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <Transition name="fade">
      <div 
        v-if="toastMessage"
        class="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 text-sm font-medium"
        :class="toastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        {{ toastMessage.text }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<route lang="yaml">
meta:
  layout: settings
  stageTransition:
    name: slide
</route>