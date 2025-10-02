<!-- LoremGenerator.vue -->
<template>
  <div class="lorem-generator">
    <h2 class="text-lg">📝 Lorem Ipsum Generator</h2>

    <div class="my-3">
        <label>
            Quantity:
            <input type="number" min="1" class="input w-full" v-model.number="count" @input="generate" />
        </label>
    </div>
    
    <div class="my-3">
        <label>
            Unit:
            <select class="select" v-model="unit" @change="generate">
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="paragraphs">Paragraphs</option>
            </select>
        </label>

        <button @click="copyToClipboard">Copy</button>
    </div>

    <div class="rounded-lg p-4">
        <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300">{{ output }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

/* --------------------------------------------------------------
   Tiny Lorem‑Ipsum source – 100+ words taken from the classic text.
   Feel free to replace it with any other word pool.
---------------------------------------------------------------- */
const WORD_POOL = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
  'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
  'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna',
  'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis',
  'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore',
  'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in',
  'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim',
  'id', 'est', 'laborum'
]

/* --------------------------------------------------------------
   Helper functions
---------------------------------------------------------------- */
function randomWord() {
  const idx = Math.floor(Math.random() * WORD_POOL.length)
  return WORD_POOL[idx]
}

// Capitalize first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Generate N words
function generateWords(n) {
  const words = []
  for (let i = 0; i < n; i++) words.push(randomWord())
  return words.join(' ')
}

// Generate N sentences (each 4‑12 words, ending with a period)
function generateSentences(n) {
  const sentences = []
  for (let i = 0; i < n; i++) {
    const wordCount = 4 + Math.floor(Math.random() * 9) // 4‑12 words
    const sentence = capitalize(generateWords(wordCount)) + '.'
    sentences.push(sentence)
  }
  return sentences.join(' ')
}

// Generate N paragraphs (each 3‑7 sentences, separated by blank line)
function generateParagraphs(n) {
  const paragraphs = []
  for (let i = 0; i < n; i++) {
    const sentenceCount = 3 + Math.floor(Math.random() * 5) // 3‑7 sentences
    const paragraph = generateSentences(sentenceCount)
    paragraphs.push(paragraph)
  }
  return paragraphs.join('\n\n')
}

/* --------------------------------------------------------------
   Reactive state
---------------------------------------------------------------- */
const count = ref(3)               // default quantity
const unit = ref('paragraphs')     // default unit
const output = ref('')

function generate() {
  if (count.value <= 0) {
    output.value = ''
    return
  }

  switch (unit.value) {
    case 'words':
      output.value = generateWords(count.value)
      break
    case 'sentences':
      output.value = generateSentences(count.value)
      break
    case 'paragraphs':
      output.value = generateParagraphs(count.value)
      break
  }
}

// Keep output in sync when either control changes
watch([count, unit], generate, { immediate: true })

/* --------------------------------------------------------------
   Clipboard helper
---------------------------------------------------------------- */
function copyToClipboard() {
  navigator.clipboard.writeText(output.value).then(
    () => alert('Copied!'),
    err => alert('Copy failed: ' + err)
  )
}
</script>

<style scoped>
.lorem-generator {
  max-width: 600px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
}
.controls {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  margin-bottom: 1rem;
}
.controls label {
  display: flex;
  flex-direction: column;
  font-size: .9rem;
}
.output {
  white-space: pre-wrap;
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
button {
  padding: .4rem .8rem;
  cursor: pointer;
}
</style>