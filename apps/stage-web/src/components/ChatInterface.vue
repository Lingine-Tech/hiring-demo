<script setup lang="ts">
/**
 * ChatInterface Component - 聊天界面 (最终完整版)
 * 集成了语音模拟按钮
 */

import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { ChatMessage, MessageRole } from '../types'

// ============================================
// Props & Emits
// ============================================

interface Props {
  messages?: ChatMessage[]
  userAvatar?: string
  assistantAvatar?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  assistantAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Airi',
  placeholder: 'Type a message... (Shift+Enter for new line)',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'send', message: string, images?: string[]): void
  (e: 'typing', isTyping: boolean): void
}>()

// ============================================
// State
// ============================================

function normalizeMessage(message: ChatMessage): ChatMessage {
  const parsedTimestamp = (() => {
    if (message.timestamp instanceof Date) return message.timestamp
    const parsed = new Date(message.timestamp ?? Date.now())
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  })()

  return {
    id: message.id ?? generateId(),
    role: message.role ?? 'assistant',
    content: message.content ?? '',
    timestamp: parsedTimestamp,
    status: message.status ?? 'sent',
    images: message.images ?? [],
    avatar: message.avatar,
  }
}

const messageList = ref<ChatMessage[]>(props.messages.map(normalizeMessage))
const inputText = ref('')
const chatContainerRef = ref<HTMLElement | null>(null)
const showEmojiPicker = ref(false)
const isSending = ref(false)
const isRecording = ref(false) // 新增：录音状态

// ============================================
// Computed
// ============================================

const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !isSending.value && !props.disabled
})

// ============================================
// Methods
// ============================================

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function formatTimestamp(date: Date | string | number): string {
  const parsed = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function scrollToBottom(): Promise<void> {
  await nextTick()
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRef.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

async function sendMessage(): Promise<void> {
  if (!canSend.value) return

  const content = inputText.value.trim()
  if (!content) return

  const tempId = generateId()
  const newMessage = normalizeMessage({
    id: tempId,
    role: 'user',
    content,
    timestamp: new Date(),
    status: 'sending',
    avatar: props.userAvatar,
  } as ChatMessage)

  messageList.value.push(newMessage)
  const rawInput = content
  inputText.value = ''
  isSending.value = true
  showEmojiPicker.value = false
  
  await scrollToBottom()
  emit('send', rawInput)

  setTimeout(() => {
    const msg = messageList.value.find(m => m.id === tempId)
    if (msg) msg.status = 'sent'
    isSending.value = false
  }, 600)
}

function handleEmojiSelect(emoji: string): void {
  inputText.value += emoji
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function getMessageClass(role: MessageRole): string {
  return role === 'user' ? 'message-user' : 'message-assistant'
}

/**
 * 模拟语音录制
 */
function toggleRecording() {
  if (isRecording.value) {
    // 停止录音
    isRecording.value = false
  } else {
    // 开始录音
    isRecording.value = true
    // 模拟2秒后识别出文字
    setTimeout(() => {
      if (isRecording.value) {
        inputText.value = "Hello Airi, what time is it now?" // 模拟识别结果
        isRecording.value = false
        // 可选：自动发送
        // sendMessage() 
      }
    }, 2000)
  }
}

// ============================================
// Watchers & Lifecycle
// ============================================

watch(() => props.messages, (newMessages) => {
  if (newMessages.length > messageList.value.length) {
    const newItems = newMessages.slice(messageList.value.length).map(normalizeMessage)
    messageList.value.push(...newItems)
    scrollToBottom()
  }
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})

const commonEmojis = [ 
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',

  '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',

  '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥',

  '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜',

  '👍', '👎', '👏', '🙌', '🤝', '💪', '❤️', '🔥',]
</script>

<template>
  <div class="chat-interface" flex="~ col" h-full w-full relative>
    <div
      ref="chatContainerRef"
      class="messages-container"
      flex-1 overflow-y-auto p-4 space-y-6
    >
      <div
        v-for="message in messageList"
        :key="message.id"
        class="message-item group"
        :class="getMessageClass(message.role)"
        flex w-full
        :justify="message.role === 'user' ? 'end' : 'start'"
      >
        <div v-if="message.role === 'assistant'" class="avatar shrink-0 mr-3 self-end">
          <img :src="message.avatar || assistantAvatar" class="w-8 h-8 rounded-full bg-gray-200 object-cover">
        </div>

        <div class="flex flex-col" :class="message.role === 'user' ? 'items-end' : 'items-start'" style="max-width: 75%;">
          <div
            class="message-bubble relative px-4 py-2.5 shadow-sm text-sm md:text-base"
            :class="[
              message.role === 'user' 
                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-600'
            ]"
          >
            <p class="whitespace-pre-wrap break-words leading-relaxed">{{ message.content }}</p>
          </div>
          <div class="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1" :class="{'flex-row-reverse': message.role === 'user'}">
            <span>{{ formatTimestamp(message.timestamp) }}</span>
          </div>
        </div>

        <div v-if="message.role === 'user'" class="avatar shrink-0 ml-3 self-end">
          <img :src="message.avatar || userAvatar" class="w-8 h-8 rounded-full bg-gray-200 object-cover">
        </div>
      </div>
    </div>

    <div class="input-area z-10 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
      <Transition name="slide-up">
        <div v-if="showEmojiPicker" class="emoji-picker absolute bottom-20 left-35 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3">
          <div class="grid grid-cols-7 gap-1">
            <button v-for="emoji in commonEmojis" :key="emoji" class="text-xl p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click="handleEmojiSelect(emoji)">
              {{ emoji }}
            </button>
          </div>
        </div>
      </Transition>

      <div class="flex items-end gap-2 max-w-4xl mx-auto">
        <button
          class="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="showEmojiPicker = !showEmojiPicker"
        >
          <div class="i-solar:smile-circle-bold text-xl" />
         
        </button>

        <button
          class="p-2.5 rounded-full transition-all duration-300 relative"
          :class="isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'"
          @click="toggleRecording"
          title="Voice Input"
        >
          <span v-if="isRecording" class="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></span>
          
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        <div class="flex-1 relative">
          <textarea
            v-model="inputText"
            :placeholder="isRecording ? 'Listening...' : placeholder"
            rows="1"
            class="w-full max-h-32 min-h-[44px] py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-sm text-sm"
            @keydown="handleKeydown"
          />
        </div>

        <button
          class="p-2.5 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
          :class="canSend ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'"
          :disabled="!canSend"
          @click="sendMessage"
        >
          <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.message-item { animation: message-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes message-pop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(10px); }
</style>