import {
  LOGIN_ACCOUNT,
  LOGIN_ERROR_MESSAGE,
} from '@/features/public/constants/login-account'

/**
 * 입력한 계정이 허용 계정과 일치하는지 검사한다.
 * 통과하면 null, 실패하면 사용자에게 보여줄 오류 문구를 돌려준다.
 */
export function validateLogin(userId: string, password: string): string | null {
  const normalizedUserId = userId.trim()

  if (!normalizedUserId) return LOGIN_ERROR_MESSAGE.emptyUserId
  if (!password) return LOGIN_ERROR_MESSAGE.emptyPassword
  if (normalizedUserId !== LOGIN_ACCOUNT.userId) {
    return LOGIN_ERROR_MESSAGE.unknownUserId
  }
  if (password !== LOGIN_ACCOUNT.password) {
    return LOGIN_ERROR_MESSAGE.wrongPassword
  }

  return null
}
