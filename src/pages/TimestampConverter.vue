<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">Unix Timestamp Converter</h3>
        </div>

        <div class="p-6 pt-0">
          <div class="h3 text-md">Conversion Mode</div>
          <div class="flex items-justify gap-4">
            <button v-for="c in categories" :key="c.key" class="btn btn-primary" :class="{ 'btn-outline': activeKey !== c.key }" @click="setActiveKey(c.key)" type="button">
              {{ c.label }}
            </button>
          </div>
        </div>

        <div class="p-6 pt-0" v-if="activeKey=='tsDate'">
            <div class="space-y-2">
                <label for="raw" class="text-sm font-medium">Enter Unix timestamp (seconds or ms):</label>
                <div class="flex gap-3">
                    <input id="raw" class="input w-full" v-model="rawInput" placeholder="e.g. 1622548800 or 1622548800000" @input="update()" />
                </div>
                <small class="small">Accepts both seconds (10 digits) and milliseconds (13 digits)</small>
            </div>
        </div>

        <div class="p-6 pt-0 grid grid-cols-2 gap-6" v-if="activeKey=='dtTs'">
            <div class="space-y-2">
                <label for="raw" class="text-sm font-medium">Date</label>
                <div class="flex gap-3">
                    <input class="input w-full" type="date" v-model="rawDate" />
                </div>
            </div>
            <div class="space-y-2">
                <label for="raw" class="text-sm font-medium">Time</label>
                <div class="flex gap-3">
                    <input class="input w-full" type="time" v-model="rawTime" />
                </div>
            </div>
        </div>
    </div>

    <div class="rounded-xl border backdrop-blur-sm mt-8">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">Conversion Results</h3>
        </div>

        <div class="p-6 pt-0">
            <div class="space-y-3">
                <div v-for="value, label in formats" class="flex items-center justify-between rounded-lg p-4">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm text-zinc-400">{{ label }}</div>
                        <div class="font-mono text-white break-all">{{ value }}</div>
                    </div>
                    <button class="btn btn-ghost">
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const categories = [
  { key: 'tsDate', label: "Timestamp to Date" },
  { key: 'dtTs', label: "Date to Timestamp" },
]
const activeKey = ref('tsDate')

const rawInput = ref(String(Math.floor(Date.now() / 1000)))
const rawDate = ref(new Date().toISOString().slice(0,10))
const rawTime = ref(new Date().toTimeString().slice(0, 8))

function setActiveKey(key) {
  activeKey.value = key
}

function parseTimestamp(value) {
  const num = Number(value.trim())
  if (!Number.isFinite(num) || num <= 0) return null

  // Heuristic: numbers ≤ 10^10 are likely seconds, otherwise ms
  const ms = num < 1e11 ? num * 1000 : num
  const date = new Date(ms)

  // Guard against invalid dates (e.g., NaN)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Takes the values from the date and time inputs and returns a Date.
 * Returns null if either field is empty or the combination is invalid.
 */
function buildDateFromInputs(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null

  const isoLike = `${dateStr}T${timeStr}`
  const d = new Date(isoLike)
  return isNaN(d.getTime()) ? null : d
}

/* Mode aware computed sourceDate */
const sourceDate = computed(() => {
  if (activeKey.value === 'tsDate') {
    return parseTimestamp(rawInput.value)
  }
  if (activeKey.value === 'dtTs') {
    return buildDateFromInputs(rawDate.value, rawTime.value)
  }
  return null
})

/* ISO 8601 (always in UTC) */
const iso = computed(() => (sourceDate.value ? sourceDate.value.toISOString() : ''))

/* UTC string (RFC1123) */
const utcString = computed(() => (sourceDate.value ? sourceDate.value.toUTCString() : ''))

/* Local string – respects the browser’s locale */
const localString = computed(() =>
  sourceDate.value ? sourceDate.value.toLocaleString(undefined, { timeZoneName: 'short' }) : ''
)

/* Unix seconds (rounded) */
const unixSeconds = computed(() => (sourceDate.value ? Math.floor(sourceDate.value.getTime() / 1000) : ''))

/* Unix milliseconds (rounded) */
const unixMillis = computed(() => (sourceDate.value ? sourceDate.value.getTime() : ''))

/* Relative time – “x seconds/minutes/hours/days ago” */
const relative = computed(() => {
  if (!sourceDate.value) return ''

  const now = Date.now()
  const diffMs = now - sourceDate.value.getTime()
  const diffSec = Math.round(diffMs / 1000)

  // Future timestamps get a “in …” phrasing
  const future = diffSec < 0
  const absSec = Math.abs(diffSec)

  const units = [
    { name: 'year', secs: 31536000 },
    { name: 'month', secs: 2592000 },
    { name: 'day', secs: 86400 },
    { name: 'hour', secs: 3600 },
    { name: 'minute', secs: 60 },
    { name: 'second', secs: 1 }
  ]

  for (const u of units) {
    if (absSec >= u.secs) {
      const count = Math.floor(absSec / u.secs)
      const plural = count !== 1 ? 's' : ''
      return future
        ? `in ${count} ${u.name}${plural}`
        : `${count} ${u.name}${plural} ago`
    }
  }

  return future ? 'in a moment' : 'just now'
})

/* Bundle computed values for easy rendering */
const formats = computed(() => ({
  'ISO 8601': iso.value,
  'UTC string': utcString.value,
  'Local string': localString.value,
  'Unix (seconds)': unixSeconds.value,
  'Unix (milliseconds)': unixMillis.value,
  'Relative to now': relative.value
}))
</script>