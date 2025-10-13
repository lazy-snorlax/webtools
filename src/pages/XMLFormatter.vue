<template>
  <section class="space-y-6">
    <h2 class="text-3xl font-bold">XML Formatter</h2>

    <!-- Controls -->
    <div class="rounded-xl border backdrop-blur-sm">
      <div class="p-4">
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <button class="btn btn-primary" @click="formatXml">Format</button>
          <button class="btn btn-primary" @click="minifyXml">Minify</button>
          <button class="btn btn-primary" @click="clearXml">Clear</button>
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
        <p>Valid XML</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input textarea -->
      <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-lg font-semibold">Input</h3>
        </div>
        <div class="p-0">
          <textarea v-model="rawInput" placeholder="Paste raw XML here" rows="20" class="flex w-full textarea "></textarea>
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

    <div class="rounded-xl border backdrop-blur-sm">
        <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold text-white">Sample XML</h3>
        </div>
        <div class="p-6 pt-0">
            <p class="text-sm text-zinc-400 mb-3">Here is some sample XML for testing the formatter:</p>
            <pre class="text-xs text-zinc-300 bg-zinc-800 p-3 rounded overflow-x-auto">{{ sample }}</pre>
            <button class="btn btn-ghost mt-3" @click="loadSample">Load This Sample</button>
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
const sample = "<root><name>Jane Smith</name><age>25</age><city>Canberra</city><hobbies>cycling</hobbies><hobbies>reading</hobbies><address><street>123 Main Street</street><postcode>2601</postcode></address></root>"

// Main formatting function
function formatXml() {
    error.value = '';
    formatted.value = '';

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawInput.value, 'application/xml');

        const parserError = doc.getElementsByTagName('parsererror')[0];
        if (parserError) throw new Error(parserError.textContent || 'Invalid XML');

        const serializer = new XMLSerializer();
        const rawSerialized = serializer.serializeToString(doc);

        // Change the second argument to whatever you prefer:
        //   '\t'  → one tab per level
        //   '  '  → two spaces per level
        //   '    '→ four spaces per level
        formatted.value = prettyPrintXml(rawSerialized, '\t');
    } catch (e) {
        error.value = `❌ Invalid XML – ${e.message}`;
    }
}

// Helper: adds line breaks and indentation to a raw XML string
function prettyPrintXml(xmlStr, indent = '  ') {
    const INDENT = indent;                     // keep the exact characters you passed
    const reg = /(>)(<)(\/*)/g;                // split tags
    let pad = 0;
    let result = '';

    // Insert a newline between every adjacent tag pair
    xmlStr = xmlStr.replace(reg, '$1\r\n$2$3');
    const lines = xmlStr.split('\r\n');

    console.log("lines: ", lines)

    for (let line of lines) {
        const isClosing   = /^<\/\w/.test(line);      // </tag>
        const isSelfClose = /\/>$/.test(line);        // <tag/>
        const isInline    = /^<\w[^>]*>.*<\/\w+>$/.test(line);       // <tag>…</tag> on one line
        const isOpening   = !isClosing && !isSelfClose && !isInline && /^<\w/.test(line); // <tag>

        // Closing tags reduce the indent *before* we print them
        if (isClosing) pad -= 1;

        // Print the line with the current indentation
        result += INDENT.repeat(pad) + line + '\r\n';

        // Opening tags increase the indent *after* we print them
        if (isOpening) pad += 1;
    }

    return result.trim();   // remove trailing newline
}

function clearXml() {
    rawInput.value = '';
    error.value = '';
    formatted.value = '';
}

function minifyXml() {
    error.value = '';
    formatted.value = '';

    try {
        // Parse the raw XML string
        const parser = new DOMParser()
        const doc = parser.parseFromString(rawInput.value, 'application/xml')

        // Detect parsing errors – browsers put them in a <parsererror> element
        const parserError = doc.getElementsByTagName('parsererror')[0]
        if (parserError) {
            // Extract a readable message
            const msg = parserError.textContent || 'Invalid XML'
            throw new Error(msg)
        }

        // Serialize the DOM back to a string
        const serializer = new XMLSerializer()
        const rawSerialized = serializer.serializeToString(doc)

        // Pretty‑print with desired indentation (here two spaces)
        formatted.value = rawSerialized
    } catch (e) {
        error.value = `❌ Invalid XML – ${e.message}`
    }
}

function loadSample() {
    rawInput.value = sample
    formatXml()
}
</script>