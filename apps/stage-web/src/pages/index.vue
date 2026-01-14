<script setup lang="ts">
/**
 * Index Page - 主页
 * 集成了 Live2D、语音识别 (VAD) 和你修复的聊天组件
 */
import type { ChatProvider } from '@xsai-ext/shared-providers'
import workletUrl from '@proj-airi/stage-ui/workers/vad/process.worklet?worker&url'

import { WidgetStage } from '@proj-airi/stage-ui/components/scenes'
import { useAudioRecorder } from '@proj-airi/stage-ui/composables/audio/audio-recorder'
import { useVAD } from '@proj-airi/stage-ui/stores/ai/models/vad'
import { useChatStore } from '@proj-airi/stage-ui/stores/chat'
import { useLive2d } from '@proj-airi/stage-ui/stores/live2d'
import { useConsciousnessStore } from '@proj-airi/stage-ui/stores/modules/consciousness'
import { useHearingSpeechInputPipeline } from '@proj-airi/stage-ui/stores/modules/hearing'
import { useProvidersStore } from '@proj-airi/stage-ui/stores/providers'
import { useSettingsAudioDevice } from '@proj-airi/stage-ui/stores/settings'
import { useTheme } from '@proj-airi/ui'
import { breakpointsTailwind, useBreakpoints, useMouse } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import Cross from '../components/Backgrounds/Cross.vue'
import Header from '../components/Layouts/Header.vue'
import MobileHeader from '../components/Layouts/MobileHeader.vue'
import AnimatedWave from '../components/Widgets/AnimatedWave.vue'

// 引入你修复的组件
import ChatInterface from '../components/ChatInterface.vue'
import StatusIndicator from '../components/StatusIndicator.vue'
import type { ChatMessage, AIStatus } from '../types'

import { themeColorFromPropertyOf, useThemeColor } from '../composables/theme-color'

const { isDark: dark } = useTheme()
const paused = ref(false)

const positionCursor = useMouse()
const { scale, position, positionInPercentageString } = storeToRefs(useLive2d())
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md')

const { updateThemeColor } = useThemeColor(themeColorFromPropertyOf('.widgets.top-widgets .colored-area', 'background-color'))
watch(dark, () => updateThemeColor(), { immediate: true })
onMounted(() => updateThemeColor())

// ==========================================
// 聊天逻辑 (从 test.vue 移植并增强)
// ==========================================
const aiStatus = ref<AIStatus>('online')
const messages = ref<ChatMessage[]>([
  {
    id: 'init-1',
    role: 'assistant',
    content: '你好！我是 Airi。你可以通过文字或语音与我交流。',
    timestamp: new Date(),
    status: 'sent',
  }
])

function handleSendMessage(content: string) {
  // 1. 状态：思考中
  aiStatus.value = 'thinking'

  // 2. 模拟网络延迟
  setTimeout(() => {
    aiStatus.value = 'responding'

    // 3. 模拟回复生成
    setTimeout(() => {
      let replyText = ''
      if (content.includes('你好') || content.includes('Hello')) {
        replyText = '你好呀！今天过得怎么样？'
      } else if (content.includes('名字') || content.includes('Who')) {
        replyText = '我是 Airi，你的虚拟助手。'
      } else {
        replyText = `我听到了你说："${content}"。这很有趣！`
      }

      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
        status: 'sent',
      }
      
      messages.value = [...messages.value, newMsg]
      aiStatus.value = 'online'
    }, 600)
  }, 1000)
}

// ==========================================
// 音频 + VAD 管道 (保留原有逻辑并对接 UI)
// ==========================================
const settingsAudioDeviceStore = useSettingsAudioDevice()
const { stream, enabled } = storeToRefs(settingsAudioDeviceStore)
const { startRecord, stopRecord, onStopRecord } = useAudioRecorder(stream)
const { transcribeForRecording } = useHearingSpeechInputPipeline()

const {
  init: initVAD,
  dispose: disposeVAD,
  start: startVAD,
  loaded: vadLoaded,
} = useVAD(workletUrl, {
  threshold: ref(0.6),
  onSpeechStart: () => {
    startRecord()
    aiStatus.value = 'thinking' // 语音开始时变色
  },
  onSpeechEnd: () => stopRecord(),
})

let stopOnStopRecord: (() => void) | undefined

async function startAudioInteraction() {
  try {
    await initVAD()
    if (stream.value) await startVAD(stream.value)

    stopOnStopRecord = onStopRecord(async (recording) => {
      // 1. 转录语音
      const text = await transcribeForRecording(recording)
      if (!text || !text.trim()) {
        aiStatus.value = 'online'
        return
      }

      // 2. 将语音转出的文字上屏 (模拟用户发送)
      const voiceMsg: ChatMessage = {
        id: `voice_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
        status: 'sent'
      }
      messages.value = [...messages.value, voiceMsg]

      // 3. 触发回复逻辑
      handleSendMessage(text)
    })
  } catch (e) {
    console.error('Audio interaction init failed:', e)
    aiStatus.value = 'error'
  }
}

function stopAudioInteraction() {
  try {
    stopOnStopRecord?.()
    stopOnStopRecord = undefined
    disposeVAD()
  } catch {}
}

watch(enabled, async (val) => {
  if (val) await startAudioInteraction()
  else stopAudioInteraction()
}, { immediate: true })

onUnmounted(() => stopAudioInteraction())

watch([stream, () => vadLoaded.value], async ([s, loaded]) => {
  if (enabled.value && loaded && s) {
    try { await startVAD(s) } catch (e) { console.error(e) }
  }
})
</script>

<template>
  <Cross>
    <AnimatedWave
      class="widgets top-widgets"
      :fill-color="dark
        ? 'oklch(35% calc(var(--chromatic-chroma) * 0.6) var(--chromatic-hue))'
        : 'color-mix(in srgb, oklch(95% calc(var(--chromatic-chroma-50) * 0.5) var(--chromatic-hue)) 80%, oklch(100% 0 360))'"
    >
      <div relative flex="~ col" z-2 h-100dvh w-100vw of-hidden>
        <div class="px-0 py-1 md:px-3 md:py-3 relative z-50" w-full gap-2>
          <div class="absolute right-4 top-4 flex gap-2">
            <StatusIndicator :status="aiStatus" size="sm" />
          </div>
          <Header class="hidden md:flex" />
          <MobileHeader class="flex md:hidden" />
        </div>

        <div relative flex="~ 1 row gap-y-0 gap-x-2 <md:col">
          
          <WidgetStage
            flex-1 min-w="1/2"
            :paused="paused"
            :focus-at="{ x: positionCursor.x.value, y: positionCursor.y.value }"
            :x-offset="`${isMobile ? position.x : position.x - 10}%`"
            :y-offset="positionInPercentageString.y"
            :scale="scale"
          />

          <div 
            v-if="!isMobile" 
            class="absolute right-6 top-20 bottom-6 w-[400px] flex flex-col z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
          >
            <ChatInterface 
              :messages="messages"
              @send="handleSendMessage"
              placeholder="Chat with Airi..."
            />
          </div>

        </div>
      </div>
    </AnimatedWave>
  </Cross>
</template>

<route lang="yaml">
name: IndexScenePage
meta:
  layout: stage
  stageTransition:
    name: bubble-wave-out
</route>