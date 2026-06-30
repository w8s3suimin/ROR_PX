import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('../views/Docs.vue')
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/Pricing.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/download',
      name: 'download',
      component: () => import('../views/Download.vue')
    },
    {
      path: '/dashboard',
      component: () => import('../components/layout/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-index',
          component: () => import('../views/dashboard/Index.vue')
        },
        {
          path: 'monitor',
          name: 'monitor',
          component: () => import('../views/dashboard/Monitor.vue')
        },
        {
          path: 'characters',
          name: 'characters',
          component: () => import('../views/dashboard/Characters.vue')
        },
        {
          path: 'deploy',
          name: 'deploy',
          component: () => import('../views/dashboard/Deploy.vue')
        },
        {
          path: 'exchange',
          name: 'exchange',
          component: () => import('../views/dashboard/Exchange.vue')
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/dashboard/Admin.vue')
        }
      ]
    }
  ]
})

// Auth Guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const { data: { session } } = await supabase.auth.getSession()

  if (requiresAuth && !session) {
    next('/login')
  } else if (to.path === '/login' && session) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
