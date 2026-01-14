import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Language, ThemeMode, UserSettings } from '../types'

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'user_settings'

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'zh-CN',
  soundEnabled: true,
  notificationsEnabled: true,
  fontSize: 'medium',
  sendOnEnter: true,
}

// ============================================
// Store Definition
// ============================================

export const useSettingsStore = defineStore('settings', () => {
  // ============================================
  // State
  // ============================================

  const theme = ref<ThemeMode>(DEFAULT_SETTINGS.theme)
  const language = ref<Language>(DEFAULT_SETTINGS.language)
  const soundEnabled = ref(DEFAULT_SETTINGS.soundEnabled)
  const notificationsEnabled = ref(DEFAULT_SETTINGS.notificationsEnabled)
  const fontSize = ref<'small' | 'medium' | 'large'>(DEFAULT_SETTINGS.fontSize)
  const sendOnEnter = ref(DEFAULT_SETTINGS.sendOnEnter)
  const isInitialized = ref(false)

  // 内部状态：用于追踪系统偏好是否为暗色
  const systemPreferredDark = ref(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  // ============================================
  // Computed
  // ============================================

  /** 判断是否为暗黑模式 (支持跟随系统) */
  const isDark = computed(() => {
    if (theme.value === 'dark') return true
    if (theme.value === 'light') return false
    return systemPreferredDark.value
  })

  const allSettings = computed<UserSettings>(() => ({
    theme: theme.value,
    language: language.value,
    soundEnabled: soundEnabled.value,
    notificationsEnabled: notificationsEnabled.value,
    fontSize: fontSize.value,
    sendOnEnter: sendOnEnter.value,
  }))

  const fontSizeValue = computed(() => {
    const sizes = { small: '14px', medium: '16px', large: '18px' }
    return sizes[fontSize.value]
  })

  // ============================================
  // Actions
  // ============================================

  function saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allSettings.value))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  function applyTheme(): void {
    if (typeof document === 'undefined') return
    const html = document.documentElement

    // 强制切换 class
    if (isDark.value) {
      html.classList.add('dark')
      html.setAttribute('data-theme', 'dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-theme', 'light')
      html.style.colorScheme = 'light'
    }
  }

  function applyFontSize(): void {
    if (typeof document === 'undefined') return
    // 设置根变量，配合 rem 使用
    document.documentElement.style.fontSize = fontSizeValue.value
  }

  function initialize(): void {
    if (isInitialized.value) return
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserSettings>
        if (parsed.theme) theme.value = parsed.theme
        if (parsed.language) language.value = parsed.language
        if (typeof parsed.soundEnabled === 'boolean') soundEnabled.value = parsed.soundEnabled
        if (typeof parsed.notificationsEnabled === 'boolean') notificationsEnabled.value = parsed.notificationsEnabled
        if (parsed.fontSize) fontSize.value = parsed.fontSize
        if (typeof parsed.sendOnEnter === 'boolean') sendOnEnter.value = parsed.sendOnEnter
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      applyTheme()
      applyFontSize()
      isInitialized.value = true
    }
  }

  function setTheme(newTheme: ThemeMode): void {
    theme.value = newTheme
    applyTheme()
    saveSettings()
  }

  function toggleDark(): void {
    if (theme.value === 'system') {
      theme.value = isDark.value ? 'light' : 'dark'
    } else {
      theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }
    applyTheme()
    saveSettings()
  }

  function setLanguage(newLanguage: Language): void {
    language.value = newLanguage
    saveSettings()
  }

  function setFontSize(size: 'small' | 'medium' | 'large'): void {
    fontSize.value = size
    applyFontSize()
    saveSettings()
  }

  function updateSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
    // @ts-ignore
    const targetRef = { theme, language, soundEnabled, notificationsEnabled, fontSize, sendOnEnter }[key]
    if (targetRef) {
      targetRef.value = value
      if (key === 'theme') applyTheme()
      if (key === 'fontSize') applyFontSize()
      saveSettings()
    }
  }

  function resetToDefault(): void {
    theme.value = DEFAULT_SETTINGS.theme
    language.value = DEFAULT_SETTINGS.language
    soundEnabled.value = DEFAULT_SETTINGS.soundEnabled
    notificationsEnabled.value = DEFAULT_SETTINGS.notificationsEnabled
    fontSize.value = DEFAULT_SETTINGS.fontSize
    sendOnEnter.value = DEFAULT_SETTINGS.sendOnEnter
    applyTheme()
    applyFontSize()
    saveSettings()
  }

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      systemPreferredDark.value = e.matches
      // 只有在 system 模式下才自动刷新样式
      if (theme.value === 'system') applyTheme()
    })
  }

  return {
    theme, language, soundEnabled, notificationsEnabled, fontSize, sendOnEnter, isInitialized,
    isDark, allSettings, fontSizeValue,
    initialize, saveSettings, setTheme, toggleDark, setLanguage, setFontSize, updateSetting, resetToDefault,
  }
})

export type SettingsStore = ReturnType<typeof useSettingsStore>