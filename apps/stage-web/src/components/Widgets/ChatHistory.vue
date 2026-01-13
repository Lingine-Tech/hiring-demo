<script setup lang="ts">
import { ChatHistory as ChatHistoryBase } from '@proj-airi/stage-ui/components'
import { useChatStore } from '@proj-airi/stage-ui/stores/chat'
import { storeToRefs } from 'pinia'

const { messages, streamingMessage, sending } = storeToRefs(useChatStore())
</script>

<template>
  <ChatHistoryBase
    :messages="messages"
    :streaming-message="streamingMessage"
    :sending="sending"
  />
</template>
