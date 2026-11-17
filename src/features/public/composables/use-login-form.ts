import { onBeforeUnmount, ref } from 'vue'

import {
  LOGIN_ACCOUNT,
  LOGIN_TOAST_DURATION_MS,
} from '@/features/public/constants/login-account'
import { validateLogin } from '@/features/public/utils/validate-login'

/** 로그인 입력값, 검증, 실패 토스트 상태를 관리한다. */
export function useLoginForm(onSuccess: () => void) {
  const userId = ref<string>(LOGIN_ACCOUNT.userId)
  const password = ref<string>(LOGIN_ACCOUNT.password)
  const toastMessage = ref('')
  // 같은 문구가 연달아 나와도 토스트가 다시 그려지도록 키를 바꾼다.
  const toastKey = ref(0)

  let toastTimer: number | undefined

  function clearToastTimer() {
    if (toastTimer !== undefined) window.clearTimeout(toastTimer)
    toastTimer = undefined
  }

  function showToast(message: string) {
    clearToastTimer()
    toastMessage.value = message
    toastKey.value += 1
    toastTimer = window.setTimeout(() => {
      toastMessage.value = ''
      toastTimer = undefined
    }, LOGIN_TOAST_DURATION_MS)
  }

  function submit() {
    const errorMessage = validateLogin(userId.value, password.value)
    if (errorMessage) {
      showToast(errorMessage)
      return
    }

    clearToastTimer()
    toastMessage.value = ''
    onSuccess()
  }

  onBeforeUnmount(clearToastTimer)

  return { userId, password, toastMessage, toastKey, submit }
}
