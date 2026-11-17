/** 데모용으로 허용하는 유일한 로그인 계정. */
export const LOGIN_ACCOUNT = {
  userId: 'ecotec',
  password: 'hanwha',
} as const

export const LOGIN_ERROR_MESSAGE = {
  emptyUserId: '아이디를 입력해 주세요.',
  emptyPassword: '비밀번호를 입력해 주세요.',
  unknownUserId: '등록되지 않은 아이디입니다.',
  wrongPassword: '비밀번호가 일치하지 않습니다.',
} as const

export const LOGIN_TOAST_DURATION_MS = 2400
