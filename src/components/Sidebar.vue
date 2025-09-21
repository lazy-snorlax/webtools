<template>
    <div class="p-4">
        <div class="mb-6">
            <div class="space-y-1">
                <router-link :to="'/json-formatter'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">JSON Formatter</router-link>
                <router-link :to="'/json-convertor'" class="group flex items-center gap-3 rounded-lc px-3 py-2 text-sm btn btn-ghost">JSON Convertor</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>