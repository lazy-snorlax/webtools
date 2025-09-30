<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">Pressure Converter</h3>
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
    factor: number
}
const units: Unit[] = [
  { key: 'pa',   label: 'Pascal (Pa)',          factor: 1 },
  { key: 'kpa',  label: 'Kilopascal (kPa)',     factor: 1_000 },
  { key: 'bar',  label: 'Bar (bar)',            factor: 100_000 },
  { key: 'psi',  label: 'PSI (psi)',            factor: 6_894.75729 },
  { key: 'atm',  label: 'Atmosphere (atm)',     factor: 101_325 },
  { key: 'torr', label: 'Torr (Torr)',          factor: 133.322368421 }
]

const inputValue = ref<number>(1)
const fromUnit = ref<string>('kpa')
const toUnit = ref<string>('pa')

function swapUnits() {
  const tmp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = tmp
}

const result = computed(() => {
    const from = units.find(u => u.key === fromUnit.value)!
    const to   = units.find(u => u.key === toUnit.value)!

    // Guard against division by zero (should never happen with our data)
    if (!from?.factor || !to?.factor) return 0

    const unit = inputValue.value * from.factor
    return (unit / to.factor)
})

const formattedResult = computed(() => {
  const r = result.value.toPrecision(6)
  return `<span class="text-cyan-400 font-mono">${inputValue.value}</span> <span class="text-zinc-400 mx-2">${fromUnit.value}</span><span class="text-zinc-500 mx-2"> = </span><span class="text-green-400 font-mono">${r}</span> <span class="text-zinc-400 mx-2">${toUnit.value}</span>`
})

</script>