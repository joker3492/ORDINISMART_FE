import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import About from '@/views/About.vue'
import Dashboard from '@/views/Dashboard.vue'

import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/about', name: 'About', component: About },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (_, __, next) => {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        next()
      } else {
        alert('Accesso negato: devi essere autenticato.')
        next('/login')
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
