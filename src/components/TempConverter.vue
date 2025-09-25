<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">Temperature Converter</h3>
        </div>
        <div class="p-6 pt-0">
            <div class="space-y-2">
                <label class="text-sm font-medium text-zinc-300"> From:</label>
                <div class="flex gap-3">
                    <input v-model="inputValue" type="number" placeholder="Enter number" class="input w-full" />
                    <select v-model="fromUnit" class="select">
                        <option v-for="u in units" :key="u.key" :value="u.key">{{ u.label }}</option>
                    </select>
                </div>
            </div>
            <div class="py-5 text-center">
                <button @click="swapUnits" class="btn btn-primary text-lg">⇅</button>
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium text-zinc-300"> To: </label>
                <div class="flex gap-3">
                    <input class="input w-full" v-model="result" />
                    <select v-model="toUnit" class="select">
                        <option v-for="u in units" :key="u.key" :value="u.key">{{ u.label }}</option>
                    </select>
                </div>
            </div>
            <div class="p-4 rounded-lg">
                <p class="text-center text-lg" v-html="formattedResult"></p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Unit {
    key: string
    label: string
    str: string
}
const units: Unit[] = [
    { key: 'C', label: 'Celsius', str: '°C' },
    { key: 'F', label: 'Farenheit', str: '°F'  },
    { key: 'K', label: 'Kelvin', str: 'K'  },
]

const inputValue = ref<number>(1)
const fromUnit = ref<string>('C')
const toUnit = ref<string>('F')

function swapUnits() {
  const tmp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = tmp
}

const toCelsius = (val: number, unit: string) => {
    switch (unit) {
        case 'C':
            return val;
        case 'F':
            return ((val - 32) * 5) / 9
        case 'K':
            return val - 273.15
        default:
            throw new Error(`Unsupported target unit: ${unit}`)
    }
}

const fromCelsius = (c: number, unit: string) => {
    switch (unit) {
        case 'C':
            return Math.round(c * 10)/10;
        case 'F':
            return Math.round(((c * 9) / 5 + 32)*10)/10
        case 'K':
            return c + 273.15
        default:
            throw new Error(`Unsupported target unit: ${unit}`)
    }
}

const result = computed(() => {
    const from = units.find(u => u.key === fromUnit.value)!
    const to   = units.find(u => u.key === toUnit.value)!

    const c = toCelsius(inputValue.value, from.key)
    return fromCelsius(c, to.key)
})

const formattedResult = computed(() => {
  const r = result.value
  return `<span class="text-cyan-400 font-mono">${inputValue.value}</span> <span class="text-zinc-400 mx-2">${units.find(u => u.key === fromUnit.value)?.str}</span><span class="text-zinc-500 mx-2"> = </span><span class="text-green-400 font-mono">${Number(r)}</span> <span class="text-zinc-400 mx-2">${units.find(u => u.key === toUnit.value)?.str}</span>`
})

</script>