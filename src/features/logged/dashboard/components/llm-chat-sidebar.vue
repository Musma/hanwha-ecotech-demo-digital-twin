<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import { useLlmChat } from '@/features/logged/dashboard/composables/use-llm-chat'

const emit = defineEmits<{
  close: []
}>()

const { messages, isThinking, ask } = useLlmChat()

const draft = ref('')
const messageListEl = ref<HTMLElement | null>(null)

const submit = () => {
  ask(draft.value)
  draft.value = ''
}

watch(
  () => [messages.value.length, isThinking.value],
  async () => {
    await nextTick()
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

      <div ref="messageListEl" class="chat-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          class="chat-message"
          :class="`chat-message--${message.role}`"
        >
          <div class="chat-bubble">{{ message.text }}</div>
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
          @keydown.enter="submit"
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
  width: 340px;
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
  background: #4a4a4a;
  border-radius: 2px 8px 8px 8px;
}

.chat-message--user .chat-bubble {
  background: #ed7100;
  border-radius: 8px 2px 8px 8px;
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
  flex-direction: column;
  flex-shrink: 0;
  gap: 10px;
  padding: 12px;
  border-top: 1px solid #333333;
}

.chat-input {
  height: 44px;
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
  height: 40px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  background: #ed7100;
  border-radius: 8px;
}
</style>
