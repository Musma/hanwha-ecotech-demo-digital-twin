import { onScopeDispose, reactive, readonly, ref, shallowRef } from 'vue'

import { FAKE_LLM_RESPONSE } from '@/features/logged/dashboard/constants/llm-chat'
import type { LlmChatMessage } from '@/features/logged/dashboard/types/llm-chat'

const LLM_RESPONSE_DELAY_MS = 3000
const LLM_TYPING_INTERVAL_MS = 30

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 가짜 LLM 대화 상태. 실제 모델 호출 없이 질문을 넣으면
 * 잠깐의 "생각 중" 지연 후 준비된 응답을 한 번만 돌려준다.
 */
export const useLlmChat = () => {
  const messages = ref<LlmChatMessage[]>([])
  const isThinking = shallowRef(false)
  const isTyping = shallowRef(false)

  let hasResponded = false
  let messageSeq = 0
  let replyTimer: ReturnType<typeof setTimeout> | null = null
  let typingTimer: ReturnType<typeof setTimeout> | null = null

  const typeResponse = (message: LlmChatMessage) => {
    const characters = Array.from(FAKE_LLM_RESPONSE)
    let characterIndex = 0

    isTyping.value = true

    const typeNextCharacter = () => {
      message.text += characters[characterIndex]
      characterIndex += 1

      if (characterIndex >= characters.length) {
        typingTimer = null
        isTyping.value = false
        return
      }

      typingTimer = setTimeout(typeNextCharacter, LLM_TYPING_INTERVAL_MS)
    }

    typeNextCharacter()
  }

  const ask = (question: string) => {
    const text = question.trim()
    if (!text || isThinking.value || hasResponded) return

    messageSeq += 1
    messages.value.push({
      id: `user-${messageSeq}`,
      role: 'user',
      text,
      time: formatTime(new Date()),
    })

    isThinking.value = true
    replyTimer = setTimeout(() => {
      replyTimer = null
      messageSeq += 1

      const assistantMessage = reactive<LlmChatMessage>({
        id: `assistant-${messageSeq}`,
        role: 'assistant',
        text: '',
        time: formatTime(new Date()),
      })

      messages.value.push(assistantMessage)
      hasResponded = true
      isThinking.value = false
      typeResponse(assistantMessage)
    }, LLM_RESPONSE_DELAY_MS)
  }

  onScopeDispose(() => {
    if (replyTimer !== null) clearTimeout(replyTimer)
    if (typingTimer !== null) clearTimeout(typingTimer)
  })

  return {
    messages: readonly(messages),
    isThinking: readonly(isThinking),
    isTyping: readonly(isTyping),
    ask,
  }
}
