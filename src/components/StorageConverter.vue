<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">Digital Storage Converter</h3>
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
    factor: number // meters per unit
}
const units: Unit[] = [
    { key: 'bit', label: 'Bit', factor: 1 },
    { key: 'B', label: 'Bytes', factor: 8 },
    { key: 'KB', label: 'KiloByte', factor: 8 * 1024 },
    { key: 'MB',  label: 'MegaByte', factor: 8 * 1024 ** 2},
    { key: 'GB',  label: 'GigaByte', factor: 8 * 1024 ** 3},
    { key: 'TB',  label: 'TeraByte', factor: 8 * 1024 ** 4},
    { key: 'PB',  label: 'PetaByte', factor: 8 * 1024 ** 5},
]

const inputValue = ref<number>(1)
const fromUnit = ref<string>('KB')
const toUnit = ref<string>('B')

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
  const r = result.value
  return `<span class="text-cyan-400 font-mono">${inputValue.value}</span> <span class="text-zinc-400 mx-2">${fromUnit.value}</span><span class="text-zinc-500 mx-2"> = </span><span class="text-green-400 font-mono">${Number(r)}</span> <span class="text-zinc-400 mx-2">${toUnit.value}</span>`
})

</script>