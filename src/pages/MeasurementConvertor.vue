<template>
    <section class="space-y-6">
        <h2 class="text-3xl font-bold">Unit Converter</h2>

        <!-- Categories -->
         <div class="rounded-xl border backdrop-blur-sm">
            <div class="p-4">
                <h3 class="text-xl pb-4">Categories</h3>
                <div class="flex flex-wrap items-center gap-2 text-sm">
                    <button class="btn btn-primary">Length</button>
                </div>
            </div>
         </div>

        <div class="rounded-xl border backdrop-blur-sm">
            <div class="p-4">
                
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
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

/* ------------------------------------------------------------------
   1️⃣ Define supported units and conversion factors.
   All factors are expressed relative to *meters* (the base unit).
------------------------------------------------------------------- */
interface Unit {
    key: string
    label: string
    factor: number // meters per unit
}
const units: Unit[] = [
    { key: 'mm', label: 'Millimeters', factor: 0.001 },
    { key: 'cm', label: 'Centimeters', factor: 0.01 },
    { key: 'm',  label: 'Meters', factor: 1 },
    { key: 'km', label: 'Kilometers', factor: 1000 },

    { key: 'in', label: 'Inches', factor: 0.0254 },
    { key: 'ft', label: 'Feet', factor: 0.3048 },
    { key: 'yd', label: 'Yard', factor: 0.9144 },
    { key: 'mi', label: 'Mile', factor: 1609.344 },
    { key: 'nmi', label: 'Nautical miles', factor: 1852 },
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

    const meters = inputValue.value * from.factor
    return (meters / to.factor).toPrecision(6)
})

const formattedResult = computed(() => {
  const r = result.value
  return `<span class="text-cyan-400 font-mono">${inputValue.value}</span> <span class="text-zinc-400 mx-2">${fromUnit.value}</span><span class="text-zinc-500 mx-2"> = </span><span class="text-green-400 font-mono">${Number(r)}</span> <span class="text-zinc-400 mx-2">${toUnit.value}</span>`
})
</script>