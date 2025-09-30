<template>
    <section class="space-y-6">
        <h2 class="text-3xl font-bold">Unit Converter</h2>

        <!-- Categories -->
         <div class="rounded-xl border backdrop-blur-sm">
            <div class="p-4">
                <h3 class="text-xl pb-4">Categories</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <button v-for="c in categories" :key="c.key" class="btn btn-primary" :class="{ 'btn-outline': activeKey !== c.key }" @click="loadComponent(c.key)" type="button">
                        {{ c.label }}
                    </button>
                </div>
            </div>
         </div>

         <Suspense>
            <component :is="currentComponent" />
            <template #fallback>
                <p class="loading">Loading…</p>
            </template>
        </Suspense>
    </section>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, shallowRef } from 'vue'

const categories = [
  { key: 'length', label: 'Length' },
  { key: 'weight', label: 'Weight' },
  { key: 'temp',   label: 'Temperature' },
  { key: 'area',   label: 'Area' },
  { key: 'volume',   label: 'Volume' },
  { key: 'time',   label: 'Time' },
  { key: 'storage',   label: 'Digital Storage' },
  { key: 'speed',   label: 'Speed' },
  { key: 'energy',   label: 'Energy' },
  { key: 'pressure',   label: 'Pressure' },
]

const activeKey = ref('length')
let currentComponent = shallowRef(null)

function loadComponent(key) {
    activeKey.value = key

    // Map the key to the async component import
    const loaderMap = {
        length: () => import('../components/LengthConverter.vue'),
        weight: () => import('../components/WeightConverter.vue'),
        temp:   () => import('../components/TempConverter.vue'),
        area:   () => import('../components/AreaConverter.vue'),
        volume:   () => import('../components/VolumeConverter.vue'),
        time:   () => import('../components/TimeConverter.vue'),
        storage:   () => import('../components/StorageConverter.vue'),
        speed:   () => import('../components/SpeedConverter.vue'),
        energy:   () => import('../components/EnergyConverter.vue'),
        pressure:   () => import('../components/PressureConverter.vue'),
    }

    // `defineAsyncComponent` gives us a component that Vite will code‑split
    currentComponent.value = defineAsyncComponent(loaderMap[key])
}

// Load the default component on mount
loadComponent(activeKey.value)
</script>