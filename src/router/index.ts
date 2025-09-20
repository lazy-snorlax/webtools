import AppLayout from '@/layouts/AppLayout.vue'
import Home from '@/pages/Home.vue'
import JsonFormatter from '@/pages/JsonFormatter.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    component: Home,
    meta: { layout: AppLayout }
  },
  {
    path: "/json-formatter",
    component: JsonFormatter,
    meta: { layout: AppLayout }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
