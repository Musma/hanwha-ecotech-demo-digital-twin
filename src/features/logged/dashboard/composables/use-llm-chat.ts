import { onScopeDispose, ref } from 'vue'

import { FAKE_LLM_RESPONSE } from '@/features/logged/dashboard/constants/llm-chat'
import type { LlmChatMessage } from '@/features/logged/dashboard/types/llm-chat'

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
  const isThinking = ref(false)

  let hasResponded = false
  let messageSeq = 0
  let replyTimer: ReturnType<typeof setTimeout> | null = null

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
    replyTimer = setTimeout(
      () => {
        messageSeq += 1
        messages.value.push({
          id: `assistant-${messageSeq}`,
          role: 'assistant',
          text: FAKE_LLM_RESPONSE,
          time: formatTime(new Date()),
        })
        hasResponded = true
        isThinking.value = false
      },
      1900 + Math.random() * 900,
    )
  }

  onScopeDispose(() => {
    if (replyTimer !== null) clearTimeout(replyTimer)
  })

  return { messages, isThinking, ask }
}
