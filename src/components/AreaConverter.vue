<template>
    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1 p-6">
            <h3 class="text-lg flex items-center gap-2">Area Converter</h3>
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
    { key: 'mm', label: 'Square Millimeters', factor: 0.000001 },
    { key: 'cm', label: 'Square Centimeters', factor: 0.0001 },
    { key: 'm',  label: 'Square Meters', factor: 1 },
    { key: 'km', label: 'Square Kilometers', factor: 1000000 },

    { key: 'in', label: 'Square Inches', factor: 0.00064516 },
    { key: 'ft', label: 'Square Foot', factor: 0.09290304 },
    { key: 'yd', label: 'Square Yard', factor: 0.83612736 },
    { key: 'mi', label: 'Square Mile', factor: 2589988.110336 },
    { key: 'ha', label: 'Hectare', factor: 10000 },
    { key: 'ac', label: 'Acre', factor: 4046.8564224 },
]

const inputValue = ref<number>(1)
const fromUnit = ref<string>('km')
const toUnit = ref<string>('m')

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
  return `<span class="text-cyan-400 font-mono">${inputValue.value}</span> <span class="text-zinc-400 mx-2">${(fromUnit.value != 'ha' && fromUnit.value != 'ac') ? fromUnit.value + '<sup>2</sup>' : fromUnit.value }</span><span class="text-zinc-500 mx-2"> = </span><span class="text-green-400 font-mono">${Number(r)}</span> <span class="text-zinc-400 mx-2">${(toUnit.value != 'ha' && toUnit.value != 'ac') ? toUnit.value + '<sup>2</sup>' : toUnit.value}</span>`
})

</script>