<template>
    <section class="space-y-6">
    <h2 class="text-3xl font-bold">XML Converter</h2>

    <!-- Controls -->
    <div class="rounded-xl border backdrop-blur-sm">
      <div class="p-4">
        <div class="flex flex-wrap items-center gap-2 text-sm">
            <select v-model="conversion" class="select select-primary">
                <option disabled value="">Pick a Conversion</option>
                <option>JSON</option>
                <option>PHP Array</option>
            </select>
            <button class="btn btn-primary" @click="convertXML">Convert</button>
            <button class="btn btn-primary" @click="clearXML">Clear</button>
        </div>
      </div>
    </div>
    
    <div v-if="statusMessage" :class="statusClass" class="rounded-xl border backdrop-blur-sm p-4">
      <p>{{ statusMessage }}</p>
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
          <textarea v-model="formatted" rows="20" readonly class="flex w-full textarea "></textarea>
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

<script setup lang="js">
import { ref, computed } from 'vue';

// Reactive state
const rawInput = ref('');
const formatted = ref('');
const error = ref('');
const conversion = ref('JSON')
const sample = `<book id="b1">
    <title>Effective JavaScript</title>
    <author>David Herman</author>
    <year>2012</year>
    <tags>
        <tag>programming</tag>
        <tag>javascript</tag>
    </tags>
</book>`

const statusMessage = computed(() => {
  if (error.value) return error.value;
  if (formatted.value) return '✅ Conversion succeeded';
  return ''; // nothing shown initially
});
const statusClass = computed(() => ({
  'border-error text-error': !!error.value,
  'border-success text-success': !error.value && !!formatted.value,
}));

function loadSample() { rawInput.value = sample }
function clearXML() {
  rawInput.value = '';
  error.value = '';
  formatted.value = '';
}

function convertXML() {
    error.value = '';
    try {
        console.log(">>>> ", conversion.value)
        switch (conversion.value) {
            case "JSON":
                const jsonObj = XMLToJson(rawInput.value);
                formatted.value = JSON.stringify(jsonObj, null, 2)
                break;
            case "PHP Array":
                formatted.value = XMLToPhpArray(rawInput.value)
                break;
            default:
                break;
        }
    } catch (e) {
        error.value = `❌ Invalid XML – ${e.message}`;
    }
}


/**
 * Convert an XML string (or an XML Document) to a JSON‑compatible object.
 *
 * @param {string|Document} xml   – The XML source. Can be a string or a parsed DOM.
 * @returns {object}               – The resulting JavaScript object.
 */
function XMLToJson(xml) {
    // If we received a raw string, parse it into a DOM first.
    if (typeof xml === 'string') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');

        // Detect parsing errors (e.g., malformed XML)
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
            throw new Error('Invalid XML: ' + errorNode.textContent);
        }
        xml = doc;
    }

    // Recursive helper that walks through a node and builds the JSON structure.
    const nodeToObject = node => {
        // Text nodes: return trimmed text content (ignore pure whitespace).
        if (node.nodeType === Node.TEXT_NODE) {
            const txt = node.nodeValue.trim();
            return txt ? txt : null;
        }

        // Element nodes
        const obj = {};

        // --- Attributes ---------------------------------------------------------
        if (node.attributes && node.attributes.length > 0) {
            for (let attr of node.attributes) {
                // Prefix attribute names with '@' to avoid colliding with child element names.
                obj[`@${attr.name}`] = attr.value;
            }
        }

        // --- Child nodes --------------------------------------------------------
        const childNodes = Array.from(node.childNodes);
        const elementChildren = childNodes.filter(
            n => n.nodeType === Node.ELEMENT_NODE
        );
        const textChildren = childNodes.filter(
            n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim()
        );

        // If there are only text children (no element children), collapse to a string.
        if (elementChildren.length === 0 && textChildren.length === 1) {
            return textChildren[0].nodeValue.trim();
        }

        // Process element children
        for (let child of elementChildren) {
            const name = child.nodeName;
            const value = nodeToObject(child);
            if (value === null) continue; // skip empty text nodes

            // If the property already exists, turn it into an array (or push onto existing array)
            if (obj.hasOwnProperty(name)) {
                if (!Array.isArray(obj[name])) { 
                    obj[name] = [obj[name]]; 
                }
                obj[name].push(value);
            } else {
                obj[name] = value;
            }
        }

        // Include any stray text nodes alongside elements (rare but possible)
        if (textChildren.length) {
            const combinedText = textChildren.map(t => t.nodeValue.trim()).join(' ');
            obj['#text'] = combinedText;
        }

        return obj;
    };

    // Start recursion at the document element (the root tag)
    const root = xml.documentElement || xml;
    const result = {};
    result[root.nodeName] = nodeToObject(root);
    return result;
}

/**
 * Convert an XML string (or Document) into a PHP‑style array literal.
 *
 * The algorithm mirrors `XMLToJson` – it first builds a plain JS object
 * representation, then serialises that object into PHP syntax.
 *
 * @param {string|Document} xml
 * @returns {string} PHP array literal (e.g. `['foo' => 'bar']`)
 */
function XMLToPhpArray(xml) {
    // 1️⃣ Parse XML (same logic as XMLToJson)
    if (typeof xml === 'string') {
        const parser = new DOMParser();
        const doc    = parser.parseFromString(xml, 'application/xml');
        const err   = doc.querySelector('parsererror');
        if (err) throw new Error('Invalid XML: ' + err.textContent);
        xml = doc;
    }

    // 2️⃣ Re‑use the same recursive walk that produces a plain JS object.
    const buildObject = node => {
        if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.nodeValue.trim();
        return txt ? txt : null;
        }

        const obj = {};

        // attributes → '@attr'
        if (node.attributes?.length) {
        for (const a of node.attributes) obj[`@${a.name}`] = a.value;
        }

        const children = Array.from(node.childNodes);
        const elems    = children.filter(c => c.nodeType === Node.ELEMENT_NODE);
        const texts    = children.filter(c => c.nodeType === Node.TEXT_NODE && c.nodeValue.trim());

        // pure‑text shortcut
        if (!elems.length && texts.length === 1) {
        return texts[0].nodeValue.trim();
        }

        // element children
        for (const child of elems) {
        const name  = child.nodeName;
        const value = buildObject(child);
        if (value === null) continue;

        if (Object.prototype.hasOwnProperty.call(obj, name)) {
            if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
            obj[name].push(value);
        } else {
            obj[name] = value;
        }
        }

        // stray text nodes
        if (texts.length) {
        obj['#text'] = texts.map(t => t.nodeValue.trim()).join(' ');
        }

        return obj;
    };

    const root   = xml.documentElement || xml;
    const data   = {};
    data[root.nodeName] = buildObject(root);

    // 3️⃣ Serialise the JS object to PHP array syntax.
    return phpSerialize(data, 0);
}

/**
 * Recursively turn a JS value into a nicely indented PHP array string.
 *
 * @param {*} value   Any primitive, array, or plain object.
 * @param {number} depth  Current indentation level.
 * @returns {string}
 */
function phpSerialize(value, depth) {
    const indent = (lvl) => '    '.repeat(lvl); // 4‑space indent

    // Primitive values
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return Number.isFinite(value) ? value.toString() : 'null';

    // Strings
    if (typeof value === 'string') {
        // Escape single quotes and backslashes for PHP single‑quoted strings.
        const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `'${escaped}'`;
    }

    // Arrays
    if (Array.isArray(value)) {
        if (!value.length) return '[]';
        const items = value.map(v => phpSerialize(v, depth + 1));
        return `[\n${indent(depth + 1)}${items.join(`,\n${indent(depth + 1)}`)}\n${indent(depth)}]`;
    }

    // Objects (associative arrays)
    const keys = Object.keys(value);
    if (!keys.length) return '[]';

    const parts = keys.map(k => {
        // Keys that aren't valid PHP identifiers need quoting.
        const key = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : `'${k.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        const val = phpSerialize(value[k], depth + 1);
        return `${indent(depth + 1)}${key} => ${val}`;
    });

    return `[\n${parts.join(',\n')}\n${indent(depth)}]`;
}
</script>