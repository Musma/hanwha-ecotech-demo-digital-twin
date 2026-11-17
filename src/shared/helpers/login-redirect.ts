/**
 * 메인 앱 로그인 화면 주소를 만든다.
 * redirectPath를 주면 로그인 후 그 경로로 돌아간다.
 */
export function buildLoginUrl(redirectPath?: string): string {
  const query = redirectPath
    ? `?redirect=${encodeURIComponent(redirectPath)}`
    : ''
  return `${import.meta.env.BASE_URL}#/login${query}`
}

/**
 * 라우터가 없는 화면(tablet.html)에서 로그인 화면으로 보낸다.
 * iframe 안이면 바깥 창을 이동한다.
 */
export function redirectToLogin(redirectPath?: string) {
  const loginUrl = buildLoginUrl(redirectPath)
  try {
    window.top!.location.replace(loginUrl)
  } catch {
    window.location.replace(loginUrl)
  }
}
