<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="p-6">
            <div class="flex flex-col space-y-1 mb-5">
                <h3 class="text-lg flex items-center gap-2">UUID Generator</h3>
            </div>
        </div>

        <!-- ==== Version selector (buttons) ==== -->
        <div class="space-y-4">
            <div class="p-4 grid grid-cols-3 gap-3">
                <button v-for="opt in versionOptions" :key="opt.value" class="btn btn-primary" :class="['btn-outline', { active: config.version === opt.value }]" @click="config.version = opt.value">
                    {{ opt.label }}
                </button>
            </div>
        </div>

        <!-- ==== Case selector (buttons) ==== -->
        <div class="space-y-4">
            <div class="p-4">
                <span class="label">Letter Case:</span>
                <div class="grid grid-cols-6 gap-4">
                    <button class="btn btn-primary" :class="['btn-outline', { active: config.uppercase }]" @click="config.uppercase = true">UPPERCASE</button>
                    <button class="btn btn-primary" :class="['btn-outline', { active: !config.uppercase }]" @click="config.uppercase = false">lowercase</button>
                    <label class="label">
                        <input type="checkbox" class="checkbox" :checked="['checked' == config.hyphens ]" @click="config.hyphens = !config.hyphens" />
                        Include Hyphens
                    </label>
                </div>
            </div>
        </div>

        <div class="p-4">
            <button class="btn btn-primary" @click="generate">Generate</button>
        </div>
    </div>
    <div class="rounded-xl border backdrop-blur-sm mt-4">
        <div class="p-6">
            <!-- Result -->
            <p v-if="uuid" class="result">
                <strong>Result:</strong> {{ uuid }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid'

// ------------------------------------------------------------------
// Reactive configuration state
// ------------------------------------------------------------------
const config = ref({
  version: 'v4',      // 'v4' | 'v1' | 'nil'
  uppercase: false,  // true → UPPERCASE, false → lowercase
  hyphens: true       // true → keep hyphens, false → strip them
})

// Options for the version button group (kept separate for readability)
const versionOptions = [
  { label: 'v4 (random)', value: 'v4' },
  { label: 'v1 (timestamp)', value: 'v1' },
  { label: 'NIL (all zeros)', value: 'nil' }
]

// Holds the generated UUID string
const uuid = ref('')

// ------------------------------------------------------------------
// Helper: format a raw UUID according to the UI settings
// ------------------------------------------------------------------
function formatUuid(raw) {
  let out = raw

  // Upper / lower case
  out = config.value.uppercase ? out.toUpperCase() : out.toLowerCase()

  // Hyphen handling
  if (!config.value.hyphens) {
    out = out.replace(/-/g, '')
  }

  return out
}

// ------------------------------------------------------------------
// Main generation routine
// ------------------------------------------------------------------
function generate() {
  let raw

  switch (config.value.version) {
    case 'v4':
      raw = uuidv4()
      break
    case 'v1':
      raw = uuidv1()
      break
    case 'nil':
      raw = '00000000-0000-0000-0000-000000000000'
      break
    default:
      raw = ''
  }

  uuid.value = formatUuid(raw)
}
</script>