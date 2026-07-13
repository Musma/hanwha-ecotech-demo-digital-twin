export type LlmChatRole = 'assistant' | 'user'

export interface LlmChatMessage {
  id: string
  role: LlmChatRole
  text: string
  time: string
}
