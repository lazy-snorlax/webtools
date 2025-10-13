<template>
    <div class="p-4">
        <div class="mb-6">
            <div class="space-y-1">
                <router-link :to="'/unit-converter'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">Unit Converter</router-link>
                <router-link :to="'/timestamp-converter'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">Timestamp Converter</router-link>
                <router-link :to="'/uuid-generator'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">UUID Generator</router-link>
                <router-link :to="'/lorem-generator'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">Lorem Ipsum Generator</router-link>
                <router-link :to="'/json-formatter'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">JSON Formatter</router-link>
                <router-link :to="'/xml-formatter'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">XML Formatter</router-link>
                <router-link :to="'/json-converter'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">JSON Converter</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>