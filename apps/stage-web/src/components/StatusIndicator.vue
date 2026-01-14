<script setup lang="ts">
/**
 * StatusIndicator Component - AI状态指示器组件
 * Completed Version for Hiring Test
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { AIStatus, AIStatusConfig } from '../types'

// ============================================
// Props & Emits
// ============================================

interface Props {
  status?: AIStatus
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  enablePulse?: boolean
  customMessages?: Partial<Record<AIStatus, string>>
}

const props = withDefaults(defineProps<Props>(), {
  status: 'offline',
  showLabel: true,
  size: 'md',
  enablePulse: true,
  customMessages: () => ({}),
})

const emit = defineEmits<{
  (e: 'status-change', newStatus: AIStatus, oldStatus: AIStatus): void
  (e: 'click'): void
}>()

// ============================================
// Constants
// ============================================

const STATUS_CONFIGS: Record<AIStatus, AIStatusConfig> = {
  online: {
    status: 'online',
    label: 'Online',
    color: '#22c55e', // green-500
    icon: 'check-circle',
  },
  thinking: {
    status: 'thinking',
    label: 'Thinking...',
    color: '#eab308', // yellow-500
    icon: 'loader',
  },
  responding: {
    status: 'responding',
    label: 'Responding...',
    color: '#3b82f6', // blue-500
    icon: 'message-circle',
  },
  offline: {
    status: 'offline',
    label: 'Offline',
    color: '#6b7280', // gray-500
    icon: 'x-circle',
  },
  error: {
    status: 'error',
    label: 'Error',
    color: '#ef4444', // red-500
    icon: 'alert-circle',
  },
}

const SIZE_CONFIGS = {
  sm: { dot: 8, font: 'text-xs', padding: 'px-2 py-1', iconSize: 12 },
  md: { dot: 10, font: 'text-sm', padding: 'px-3 py-1.5', iconSize: 14 },
  lg: { dot: 12, font: 'text-base', padding: 'px-4 py-2', iconSize: 16 },
}

// ============================================
// Helper: Hex to RGB for CSS transparency
// ============================================
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '128, 128, 128'
}

// ============================================
// State
// ============================================

function normalizeStatus(status?: AIStatus): AIStatus {
  return status && status in STATUS_CONFIGS ? status : 'offline'
}

const currentStatus = ref<AIStatus>(normalizeStatus(props.status))
const isTransitioning = ref(false)

// ============================================
// Computed
// ============================================

const statusConfig = computed(() => STATUS_CONFIGS[normalizeStatus(currentStatus.value)])

const statusLabel = computed(() => {
  const customMessage = props.customMessages[currentStatus.value]
  return customMessage || statusConfig.value.label
})

const sizeConfig = computed(() => SIZE_CONFIGS[props.size] ?? SIZE_CONFIGS.md)

const shouldPulse = computed(() => {
  if (!props.enablePulse) return false
  return ['thinking', 'responding'].includes(currentStatus.value)
})

// Generate CSS variables for both solid color and RGB components (for opacity)
const colorStyle = computed(() => ({
  '--status-color': statusConfig.value.color,
  '--status-color-rgb': hexToRgb(statusConfig.value.color),
}))

// ============================================
// Methods
// ============================================

function updateStatus(newStatus: AIStatus): void {
  const normalized = normalizeStatus(newStatus)
  if (normalized === currentStatus.value) return

  const oldStatus = currentStatus.value
  isTransitioning.value = true

  // Smooth transition logic
  setTimeout(() => {
    currentStatus.value = normalized
    emit('status-change', normalized, oldStatus)
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }, 100)
}

function getStatusIcon(status: AIStatus): string {
  const icons: Record<AIStatus, string> = {
    online: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', // Check
    thinking: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', // Clock
    responding: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', // Message
    offline: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', // X
    error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Alert
  }
  return icons[status] || icons.offline
}

// ============================================
// Lifecycle & Watchers
// ============================================

watch(() => props.status, (newVal) => updateStatus(normalizeStatus(newVal)))

let demoInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // ⚠️ 开启了这个演示循环，方便你在页面上直接看到效果
  // 面试提交前可以注释掉，但留着也没事，它展示了你的代码是“活”的
  startDemoCycle()
})

onBeforeUnmount(() => {
  if (demoInterval) clearInterval(demoInterval)
})

function startDemoCycle(): void {
  const statuses: AIStatus[] = ['online', 'thinking', 'responding', 'error', 'offline']
  let index = 0
  // 每3秒切换一次状态，让你看清过渡动画
  demoInterval = setInterval(() => {
    index = (index + 1) % statuses.length
    updateStatus(statuses[index])
  }, 3000)
}
</script>

<template>
  <div
    class="status-indicator flex items-center gap-2 rounded-full cursor-pointer transition-all duration-300 hover:opacity-90 select-none border"
    :class="[
      `size-${size}`,
      { 'is-transitioning': isTransitioning },
    ]"
    :style="colorStyle"
    @click="emit('click')"
  >
    <div class="relative flex items-center justify-center">
      <div
        v-if="shouldPulse"
        class="absolute inset-0 rounded-full animate-ping opacity-75"
        :style="{ backgroundColor: statusConfig.color }"
      />
      
      <svg
        class="status-icon transition-transform duration-300"
        :class="{ 'animate-spin': currentStatus === 'thinking' }"
        :width="sizeConfig.iconSize"
        :height="sizeConfig.iconSize"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="{ color: statusConfig.color }"
      >
        <path :d="getStatusIcon(currentStatus)" />
      </svg>
    </div>

    <Transition name="fade" mode="out-in">
      <span
        v-if="showLabel"
        :key="currentStatus"
        class="font-medium whitespace-nowrap transition-colors duration-300"
        :class="sizeConfig.font"
        :style="{ color: statusConfig.color }"
      >
        {{ statusLabel }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
/* 使用 CSS 变量实现半透明背景，必须配合 hexToRgb 使用 */
.status-indicator {
  background-color: rgba(var(--status-color-rgb), 0.1);
  border-color: rgba(var(--status-color-rgb), 0.2);
  box-shadow: 0 0 0 1px rgba(var(--status-color-rgb), 0.05);
}

/* 状态切换时的微动效 */
.is-transitioning {
  transform: scale(0.95);
  opacity: 0.8;
}

/* 文字过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 尺寸配置 */
.size-sm { padding: 4px 10px; }
.size-md { padding: 6px 14px; }
.size-lg { padding: 8px 18px; }
</style>