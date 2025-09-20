<template>
  <section class="space-y-6">
    <h2 class="text-3xl font-bold">JSON Formatter</h2>

    <!-- Controls -->
    <div class="rounded-xl border backdrop-blur-sm">
      <div class="p-4">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <button class="btn btn-primary" @click="formatJson" :disabled="loading">Format</button>
        </div>
      </div>
    </div>
    
    <div v-if="error" class="rounded-xl border backdrop-blur-sm border-error text-error">
      <div class="p-4">
        <p>{{ error }}</p>
      </div>
    </div>
    <div v-else class="rounded-xl border backdrop-blur-sm border-success text-success">
      <div class="p-4">
        <p>Valid JSON</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input textarea -->
      <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold">Input</h3>
        </div>
        <div class="p-0">
          <textarea v-model="rawInput" placeholder="Paste raw JSON here" rows="20" class="flex w-full textarea "></textarea>
        </div>
      </div>
        
      <!-- Output / error -->
      <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold">Output</h3>
        </div>
        <div class="p-0">
          <textarea v-model="formatted" rows="20" class="flex w-full textarea "></textarea>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

// Reactive state
const rawInput = ref('');
const formatted = ref('');
const error = ref('');
const loading = ref(false);
const indent = ref(2);
const tab = '\t'; // allow a “tab” option

// Main formatting function
function formatJson() {
  error.value = '';
  formatted.value = '';
  loading.value = true;

  try {
    // Determine spacing: number or a literal tab character
    const spaces = typeof indent.value === 'number' ? indent.value : '\t';
    const parsed = JSON.parse(rawInput.value);
    formatted.value = JSON.stringify(parsed, null, spaces);
  } catch (e) {
    error.value = `❌ Invalid JSON – ${e.message}`;
  } finally {
    loading.value = false;
  }
}
</script>