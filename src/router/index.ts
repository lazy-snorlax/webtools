import AppLayout from '@/layouts/AppLayout.vue'
import Home from '@/pages/Home.vue'
import JsonConverter from '@/pages/JsonConverter.vue'
import JsonFormatter from '@/pages/JsonFormatter.vue'
import UnitConverter from '@/pages/UnitConverter.vue'
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
  {
    path: "/json-converter",
    component: JsonConverter,
    meta: { layout: AppLayout }
  },
  {
    path: "/unit-converter",
    component: UnitConverter,
    meta: { layout: AppLayout }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
