<template>
    <section class="space-y-6">
    <h2 class="text-3xl font-bold">JSON Convertor</h2>

    <!-- Controls -->
    <div class="rounded-xl border backdrop-blur-sm">
      <div class="p-4">
        <div class="flex flex-wrap items-center gap-2 text-sm">
            <select v-model="conversion" class="select select-primary">
                <!-- <option disabled selected>Pick a Conversion</option> -->
                <option>PHP Array</option>
                <option>Go Slice</option>
            </select>
            <button class="btn btn-primary" @click="convertJson">Convert</button>
            <button class="btn btn-primary" @click="clearJson">Clear</button>
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
const conversion = ref('')

function clearJson() {
  rawInput.value = '';
  error.value = '';
  formatted.value = '';
}

function convertJson() {
    error.value = '';
    try {
        const parsed = JSON.parse(rawInput.value);        
        console.log(">>>> ", conversion.value, parsed)
        switch (conversion.value) {
            case "PHP Array":
                formatted.value = jsonToPhpArray(parsed)
                break;
            case "Go Slice":
                formatted.value = jsonToGoSlice(parsed)
                break;
            default:
                break;
        }
    } catch (e) {
        error.value = `❌ Invalid JSON – ${e.message}`;
    }
}

function jsonToPhpArray(data, indentLevel = 0) {
    const indent = '    '.repeat(indentLevel); // 4 spaces per level

    // Primitive values
    if (data === null) { return 'null'; }
    if (typeof data === 'boolean') { return data ? 'true' : 'false'; }
    if (typeof data === 'number') { return Number.isFinite(data) ? data.toString() : 'null'; }
    if (typeof data === 'string') {
        // Escape backslashes and single quotes for PHP single‑quoted strings
        const escaped = data.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `'${escaped}'`;
    }

    // Arrays
    if (Array.isArray(data)) {
        if (data.length === 0) { return '[]'; }
        const items = data.map(item => jsonToPhpArray(item, indentLevel + 1));
        return `[\n${indent}    ${items.join(`,\n${indent}    `)}\n${indent}]`;
    }

    // Objects (associative arrays)
    const keys = Object.keys(data);
    if (keys.length === 0) {
        return '[]';
    }
    const entries = keys.map(key => {
        const phpKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
            ? key                     // bare identifier – no quotes needed
            : `'${key.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`; // quoted key
        const phpValue = jsonToPhpArray(data[key], indentLevel + 1);
        return `${phpKey} => ${phpValue}`;
    });
    return `[\n${indent}    ${entries.join(`,\n${indent}    `)}\n${indent}]`;
}

function jsonToGoSlice(data, indentLvl = 0) {
    const indent = '    '.repeat(indentLvl); // 4‑space indentation

    // ---------- Primitive values ----------
    if (data === null) { return 'nil'; }
    if (typeof data === 'boolean') { return data ? 'true' : 'false'; }
    if (typeof data === 'number') { return Number.isInteger(data) ? `${data}` : `${data}`; }
    if (typeof data === 'string') {
        // Escape backslashes and double quotes for Go string literals.
        const esc = data
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
        return `"${esc}"`;
    }

    // Arrays (slices)
    if (Array.isArray(data)) {
        if (data.length === 0) { return '[]interface{}{}'; }
        const elems = data.map(v => jsonToGoSlice(v, indentLvl + 1));
        return `[]interface{}{\n${indent}    ${elems.join(`,\n${indent}    `)}\n${indent}}`;
    }

    // Objects (maps)
    const keys = Object.keys(data);
    if (keys.length === 0) { return 'map[string]interface{}{}'; }
    const entries = keys.map(k => {
        // Escape key for Go string literal
        const escKey = k
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
        const val = jsonToGoSlice(data[k], indentLvl + 1);
        return `"${escKey}": ${val}`;
    });
    return `map[string]interface{}{\n${indent}    ${entries.join(`,\n${indent}    `)}\n${indent}}`;
}
</script>