import AppLayout from '@/layouts/AppLayout.vue'
import About from '@/pages/About.vue'
import Contact from '@/pages/Contact.vue'
import Home from '@/pages/Home.vue'
import JsonConverter from '@/pages/JsonConverter.vue'
import JsonFormatter from '@/pages/JsonFormatter.vue'
import LoremGenerator from '@/pages/LoremGenerator.vue'
import TimestampConverter from '@/pages/TimestampConverter.vue'
import UnitConverter from '@/pages/UnitConverter.vue'
import UUIDGenerator from '@/pages/UUIDGenerator.vue'
import WorldClock from '@/pages/WorldClock.vue'
import XMLFormatter from '@/pages/XMLFormatter.vue'
import XMLConverter from '@/pages/XMLConverter.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    component: Home,
    meta: { layout: AppLayout }
  },
  {
    path: "/about",
    component: About,
    meta: { layout: AppLayout }
  },
  {
    path: "/contact",
    component: Contact,
    meta: { layout: AppLayout }
  },
  {
    path: "/xml-formatter",
    component: XMLFormatter,
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
    path: "/xml-converter",
    component: XMLConverter,
    meta: { layout: AppLayout }
  },
  {
    path: "/unit-converter",
    component: UnitConverter,
    meta: { layout: AppLayout }
  },
  {
    path: "/world-clock",
    component: WorldClock,
    meta: { layout: AppLayout }
  },
  {
    path: "/timestamp-converter",
    component: TimestampConverter,
    meta: { layout: AppLayout }
  },
  {
    path: "/lorem-generator",
    component: LoremGenerator,
    meta: { layout: AppLayout }
  },
  {
    path: "/uuid-generator",
    component: UUIDGenerator,
    meta: { layout: AppLayout }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
