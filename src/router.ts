import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router'

import type { DashboardModal } from '@/features/logged/dashboard/composables/use-dashboard-overlays'

const dashboardPage = () => import('@/pages/dashboard/index.vue')
const safetyAlertDashboardModal: DashboardModal = 'cctv'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboardPage,
  },
  {
    path: '/dashboard/safety-alert',
    name: 'dashboard-safety-alert',
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

export default router
