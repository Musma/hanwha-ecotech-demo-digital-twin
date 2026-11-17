import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'

import type { DashboardModal } from '@/features/logged/dashboard/composables/use-dashboard-overlays'
import { useSessionStore } from '@/shared/stores/session'

const dashboardPage = () => import('@/pages/dashboard/index.vue')
const safetyAlertDashboardModal: DashboardModal = 'cctv'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: { public: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboardPage,
  },
  {
    path: '/dashboard/safety-alert',
    name: 'dashboard-safety-alert',
    alias: '/safety-alert',
    component: dashboardPage,
    meta: { dashboardModal: safetyAlertDashboardModal },
  },
  {
    path: '/tablet',
    name: 'tablet',
    component: () => import('@/pages/tablet/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// 로그인 화면 외의 모든 경로는 로그인한 사용자만 들어갈 수 있다.
router.beforeEach((to) => {
  if (to.meta.public === true) return true

  const session = useSessionStore()
  if (session.isLoggedIn) return true

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
