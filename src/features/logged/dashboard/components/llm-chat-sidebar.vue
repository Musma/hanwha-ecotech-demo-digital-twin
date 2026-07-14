<script setup lang="ts">
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'

import { useLlmChat } from '@/features/logged/dashboard/composables/use-llm-chat'

const emit = defineEmits<{
  close: []
  'open-process-twin': []
}>()

const { messages, isThinking, isTyping, ask } = useLlmChat()

const PRESET_SCHEDULE_QUERY = `다음주 7/27일부터 8/2일까지 장마가 예정되어 있어.

그에 따라, 외업으로 계획된 블록 일부를 내업으로 돌리고,
불가피할 경우에는 인력을 더 투입해서 납기 일자에 맞추려고해.

아래 3개 작업이 조정된 스케줄을 수립해줘.
- 2579호선 501블록 대조의장 작업을 내업 작업으로 전환
- 2579호선 502블록 대조의장 작업을 내업 작업으로 전환
- 2583호선 50A블록 PE의장 작업 완료일을 단축`

const draft = shallowRef(PRESET_SCHEDULE_QUERY)
const messageListEl = useTemplateRef<HTMLElement>('messageList')

interface ResponseResult {
  target: string
  action: string
}

interface AssistantResponse {
  body: string
  results: ResponseResult[]
  caution: string
}

const parseAssistantResponse = (text: string): AssistantResponse => {
  const [body, resultContent] = text.split('\n조정 결과\n')

  if (!resultContent) return { body: text, results: [], caution: '' }

  const [resultLines, cautionContent] = resultContent.split('\n\n단, ')
  const results = (resultLines ?? '')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':')

      if (separatorIndex < 0) return { target: line, action: '' }

      return {
        target: line.slice(0, separatorIndex).trim(),
        action: line.slice(separatorIndex + 1).trim(),
      }
    })

  return {
    body: body?.trim() ?? text,
    results,
    caution: cautionContent ? `단, ${cautionContent.trim()}` : '',
  }
}

const formattedMessages = computed(() =>
  messages.value.map((message) => ({
    ...message,
    response:
      message.role === 'assistant'
        ? parseAssistantResponse(message.text)
        : null,
  })),
)

const submit = () => {
  ask(draft.value)
  draft.value = ''
}

watch(
  () => {
    const lastMessage = messages.value[messages.value.length - 1]
    return [messages.value.length, lastMessage?.text.length, isThinking.value]
  },
  async () => {
    await nextTick()

    if (isTyping.value && messageListEl.value) {
      messageListEl.value.scrollTop = messageListEl.value.scrollHeight
      return
    }

    messageListEl.value?.scrollTo({
      top: messageListEl.value.scrollHeight,
      behavior: 'smooth',
    })
  },
)
</script>

<template>
  <div class="llm-chat-sidebar">
    <div class="chat-panel">
      <div class="chat-header">
        <div class="chat-title-wrap">
          <img
            class="chat-title-icon"
            src="@/assets/images/screen-16/icon9.svg"
            alt=""
          />
          <div class="chat-title">LLM</div>
        </div>
        <button class="close-button" type="button" @click="emit('close')">
          ✕
        </button>
      </div>

      <div ref="messageList" class="chat-messages">
        <div
          v-for="message in formattedMessages"
          :key="message.id"
          class="chat-message"
          :class="`chat-message--${message.role}`"
        >
          <div class="chat-bubble">
            <template v-if="message.response">
              <div class="assistant-response-body">
                {{ message.response.body }}
              </div>

              <section
                v-if="message.response.results.length"
                class="response-summary"
                aria-label="조정 결과"
              >
                <div class="response-summary-heading">
                  <span class="response-summary-icon" aria-hidden="true"
                    >✓</span
                  >
                  <div>
                    <span>Schedule updated</span>
                    <h3>조정 결과</h3>
                  </div>
                </div>
                <ul class="response-result-list">
                  <li
                    v-for="(result, index) in message.response.results"
                    :key="result.target"
                    class="response-result-item"
                  >
                    <span class="response-result-index">{{ index + 1 }}</span>
                    <div>
                      <strong>{{ result.target }}</strong>
                      <span>{{ result.action }}</span>
                    </div>
                  </li>
                </ul>
              </section>

              <aside
                v-if="message.response.caution"
                class="response-caution"
                aria-label="최종 확인 필요"
              >
                <span class="response-caution-icon" aria-hidden="true">!</span>
                <div>
                  <strong>최종 확인 필요</strong>
                  <p>{{ message.response.caution }}</p>
                </div>
              </aside>
            </template>
            <template v-else>{{ message.text }}</template>
            <button
              v-if="message.role === 'assistant' && !isTyping"
              class="confirm-button"
              type="button"
              @click="emit('open-process-twin')"
            >
              확인
            </button>
          </div>
          <div class="chat-time">{{ message.time }}</div>
        </div>
        <div v-if="isThinking" class="chat-message chat-message--assistant">
          <div class="chat-bubble chat-bubble--thinking">
            <span class="thinking-dot" />
            <span class="thinking-dot" />
            <span class="thinking-dot" />
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <input
          v-model="draft"
          class="chat-input"
          type="text"
          placeholder="Ask me anything . . ."
          @keydown.enter.prevent="submit"
        />
        <button class="ask-button" type="button" @click="submit">Ask</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.llm-chat-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1140px;
  pointer-events: none;
}

.chat-panel {
  position: absolute;
  top: 110px;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 390px;
  height: 990px;
  overflow: clip;
  pointer-events: auto;
  background: rgba(20, 20, 20, 0.95);
  border-left: 1px solid #444444;
}

.chat-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 14px 0 16px;
  background: #2a2a2a;
  border-bottom: 1px solid #111111;
}

.chat-title-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
}

.chat-title-icon {
  width: 22px;
  height: 22px;
}

.chat-title {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.close-button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  color: #ffffff;
  cursor: pointer;
  border-radius: 4px;
}

.chat-messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  padding: 16px 12px;
  overflow-y: auto;
}

.chat-message {
  display: flex;
  flex-direction: column;
  max-width: 86%;
}

.chat-message--assistant {
  width: 100%;
  max-width: 100%;
  align-items: flex-start;
  align-self: flex-start;
}

.chat-message--user {
  align-items: flex-end;
  align-self: flex-end;
}

.chat-bubble {
  padding: 10px 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  color: #ffffff;
  white-space: pre-line;
  border-radius: 8px;
}

.chat-message--assistant .chat-bubble {
  width: 100%;
  padding: 14px;
  color: #f4f6f8;
  background: #292d33;
  border: 1px solid #434951;
  border-radius: 2px 8px 8px 8px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
}

.chat-message--user .chat-bubble {
  background: #ed7100;
  border-radius: 8px 2px 8px 8px;
}

.assistant-response-body {
  line-height: 1.62;
  color: #e7eaee;
  white-space: pre-line;
}

.response-summary {
  margin-top: 16px;
  padding: 12px;
  white-space: normal;
  background: linear-gradient(
    145deg,
    rgba(237, 113, 0, 0.17),
    rgba(22, 27, 33, 0.96)
  );
  border: 1px solid rgba(237, 113, 0, 0.62);
  border-left: 4px solid #f58a2b;
  border-radius: 8px;
}

.response-summary-heading {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 10px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  span:not(.response-summary-icon) {
    color: #f5a45d;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  h3 {
    margin: 0;
    color: #ffffff;
    font-size: 15px;
    line-height: 1.3;
  }
}

.response-summary-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  background: #ed7100;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(237, 113, 0, 0.14);
}

.response-result-list {
  display: grid;
  gap: 7px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.response-result-item {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 9px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;

  > div {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    color: #ffffff;
    font-size: 12.5px;
    line-height: 1.35;
  }

  > div > span {
    color: #cdd8e3;
    font-size: 12.5px;
    line-height: 1.45;
  }
}

.response-result-index {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #ffb16d;
  font-size: 10px;
  font-weight: 800;
  background: rgba(237, 113, 0, 0.16);
  border: 1px solid rgba(237, 113, 0, 0.42);
  border-radius: 5px;
}

.response-caution {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 11px;
  margin-top: 10px;
  color: #f8e4b9;
  white-space: normal;
  background: rgba(247, 190, 73, 0.1);
  border: 1px solid rgba(247, 190, 73, 0.46);
  border-radius: 7px;

  > div {
    min-width: 0;
  }

  strong {
    display: block;
    margin-bottom: 4px;
    color: #ffd47d;
    font-size: 13px;
  }

  p {
    margin: 0;
    color: #e8dcc5;
    font-size: 12.5px;
    line-height: 1.6;
  }
}

.response-caution-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #30230b;
  font-size: 13px;
  font-weight: 900;
  background: #f7be49;
  border-radius: 50%;
}

.confirm-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  margin-top: 12px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  background: #ed7100;
  border: 1px solid #ff9840;
  border-radius: 6px;

  &:hover {
    background: #f47a0c;
  }
}

.chat-time {
  margin-top: 4px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 11px;
  color: #aaaaaa;
}

.chat-bubble--thinking {
  display: flex;
  gap: 5px;
  align-items: center;
  height: 34px;
}

.thinking-dot {
  width: 6px;
  height: 6px;
  background: #bbbbbb;
  border-radius: 50%;
  animation: thinking-bounce 1.2s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.15s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }
}

@keyframes thinking-bounce {
  0%,
  60%,
  100% {
    opacity: 0.4;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.chat-input-area {
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-top: 1px solid #333333;
}

.chat-input {
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 14px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #ed7100;
  border-radius: 8px;

  &::placeholder {
    color: #888888;
  }
}

.ask-button {
  flex-shrink: 0;
  width: 72px;
  height: 42px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  background: #ed7100;
  border-radius: 8px;
}
</style>
