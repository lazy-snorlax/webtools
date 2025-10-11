<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">World Clock</h3>
        </div>
        <div class="p-6 pt-0">
            <div class="grid grid-cols-2">
                <div class="">
                    <label class="text-sm font-medium text-zinc-300"> From:</label>
                    <div class="flex gap-12">
                        <!-- <input v-model="inputValue" type="number" placeholder="Enter number" class="input w-full" /> -->
                        <select v-model="srcTz" class="select">
                            <option v-for="tz in timeZones" :key="tz" :value="tz">{{ tz }}</option>
                        </select>
                        <p class="text-center text-lg"> {{ srcTime }}</p>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium text-zinc-300"> To: </label>
                    <div class="flex gap-12">
                        <!-- <input class="input w-full" v-model="result" /> -->
                        <select v-model="tgtTz" class="select">
                            <option v-for="tz in timeZones" :key="tz" :value="tz">{{ tz }}</option>
                        </select>
                        <p class="text-center text-lg"> {{ tgtTime }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

// ------------------------------------------------------------------
// List of time‑zones
// ------------------------------------------------------------------
const timeZones = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Australia/Adelaide',
  'New_Zealand/Auckland',
  'New_Zealand/Wellington',
]

// ------------------------------------------------------------------
// Reactive state
// ------------------------------------------------------------------
const now = ref(new Date())
const srcTz = ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const tgtTz = ref('UTC')

// Keep 'now' up to date
setInterval(() => (now.value = new Date()), 1000)

function swapUnits() {
  const tmp = srcTz.value
  srcTz.value = tgtTz.value
  tgtTz.value = tmp
}

function formatInZone(date, zone) {
  return new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: zone,
    hour12: false,
  }).format(date)
}

const srcTime = computed(() => formatInZone(now.value, srcTz.value))
const tgtTime = computed(() => formatInZone(now.value, tgtTz.value))
</script>