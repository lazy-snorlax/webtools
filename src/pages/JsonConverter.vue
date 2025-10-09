<template>
    <section class="space-y-6">
    <h2 class="text-3xl font-bold">JSON Converter</h2>

    <!-- Controls -->
    <div class="rounded-xl border backdrop-blur-sm">
      <div class="p-4">
        <div class="flex flex-wrap items-center gap-2 text-sm">
            <select v-model="conversion" class="select select-primary">
                <!-- <option disabled selected>Pick a Conversion</option> -->
                <option>PHP Array</option>
                <option>Go Slice</option>
                <option>XML</option>
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
const conversion = ref('PHP Array')

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
            case "XML":
                formatted.value = jsonToXml(parsed)
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

/**
 * Convert a JavaScript value (already parsed from JSON) to XML.
 *
 * @param {*} data           The value to convert.
 * @param {string} nodeName The name of the current XML element.
 * @param {number} depth     Current indentation depth (used internally).
 * @returns {string} XML fragment.
 */
function jsonToXml(data, nodeName = 'root', depth = 0) {
    const indent = '  '.repeat(depth);               // two‑space indent
    const nl = '\n';

    // Helper to escape characters that are illegal inside XML text/attributes
    const escape = (str) =>
        String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    // ----- Primitive values -------------------------------------------------
    if (
        data === null ||
        typeof data === 'number' ||
        typeof data === 'boolean' ||
        typeof data === 'string'
    ) {
        const text = data === null ? '' : escape(data);
        return `${indent}<${nodeName}>${text}</${nodeName}>`;
    }

    // ----- Arrays -----------------------------------------------------------
    if (Array.isArray(data)) {
        // An empty array → self‑closing tag
        if (data.length === 0) {
            return `${indent}<${nodeName}/>`;
        }

        // Each item becomes its own element with the same name (or <item> if you prefer)
        return data.map((item) => jsonToXml(item, nodeName, depth)).join(nl);
    }

    // ----- Objects -----------------------------------------------------------
    // Separate attributes (keys that start with '@') from child elements
    const attrs = [];
    const children = [];

    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('@')) {
            // Attribute – strip the leading '@' for the real attribute name
            attrs.push(`${key.slice(1)}="${escape(value)}"`);
        } else if (key === '#text') {
            // Special key for raw text content inside the element
            children.push(escape(value));
        } else {
            // Normal child element
            children.push(jsonToXml(value, key, depth + 1));
        }
    }

    const attrString = attrs.length ? ' ' + attrs.join(' ') : '';

    // No children → self‑closing tag
    if (children.length === 0) {
        return `${indent}<${nodeName}${attrString}/>`;
    }

    // One text child without further nesting → inline representation
    if (children.length === 1 && !children[0].includes('\n')) {
        return `${indent}<${nodeName}${attrString}>${children[0]}</${nodeName}>`;
    }

    // Otherwise, pretty‑print with line breaks
    const inner = children.join(nl);
    return `${indent}<${nodeName}${attrString}>${nl}${inner}${nl}${indent}</${nodeName}>`;
}
</script>