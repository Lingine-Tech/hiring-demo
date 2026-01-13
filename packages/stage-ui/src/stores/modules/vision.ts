import { defineStore } from 'pinia'
import { computed } from 'vue'

interface VisionAnalysisResult {
  content: string
}

export const useVisionStore = defineStore('vision-store', () => {
  const configured = computed(() => false)

  async function analyzeImageDirect(_imageBase64: string, _prompt?: string): Promise<VisionAnalysisResult> {
    throw new Error('Vision provider is not configured.')
  }

  return {
    configured,
    analyzeImageDirect,
  }
})
