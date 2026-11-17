<script setup lang="ts">
import { nextTick } from 'vue'

import hanwhaMarkUrl from '@/assets/images/hanwha-mark.svg'
import { Button } from '@/shared/components/ui/button'
import { redirectToLogin } from '@/shared/helpers/login-redirect'
import { useSessionStore } from '@/shared/stores/session'

const session = useSessionStore()

// 태블릿 화면은 라우터가 없는 별도 진입점이므로 주소를 직접 바꿔 로그인 화면으로 보낸다.
const handleLogout = async () => {
  session.logout()
  // 로그아웃 상태가 저장소에 기록된 뒤 이동해야 다음 진입에서 다시 막힌다.
  await nextTick()
  redirectToLogin()
}
</script>

<template>
  <header
    class="flex items-center justify-between flex-shrink-0 h-[56px] px-6 bg-hw-white-main border-b border-hw-white-dark"
  >
    <div class="flex min-w-0 items-center gap-2.5">
      <img
        :src="hanwhaMarkUrl"
        alt="Hanwha"
        class="h-7 w-8 flex-shrink-0 object-contain"
      />
      <span
        class="min-w-0 truncate font-hanwha text-h6 font-bold leading-[1.2] tracking-[-0.4px] text-hw-gray-darker"
        >한화오션에코텍</span
      >
    </div>

    <div class="flex items-center gap-3.5">
      <span
        class="font-normal text-sm leading-none tracking-[-0.2px] text-hw-gray-dark"
      >
        <b class="font-semibold text-hw-gray-darker">홍길동</b>님 로그인
        되었습니다.
      </span>
      <Button
        type="button"
        variant="brand-ghost"
        size="brand-icon"
        class="relative"
        title="로그아웃"
        @click="handleLogout"
      >
        <i class="ti ti-logout" />
      </Button>
      <Button
        type="button"
        variant="brand-ghost"
        size="brand-icon"
        class="relative"
        title="알림"
      >
        <i class="ti ti-bell" />
        <span
          class="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-[3px] rounded-md bg-hw-red-main text-white font-numeric font-semibold text-[10px] leading-[15px] text-center"
          >1</span
        >
      </Button>
    </div>
  </header>
</template>
