<template>
    <div class="min-h-screen">
        <header class="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b border-zinc-800">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-4">
                        <router-link class="flex items-center gap-3" :to="'/'">
                            <div class="hidden sm:block">
                                <span class="text-xl font-bold text-white">WebTools</span>
                            </div>
                        </router-link>
                    </div>
                    <div class="flex items-center gap-4">
                        <router-link class="hidden md:inline-flex items-center px-3 py-2 text-zinc-300 rounded-lg font-medium hover:bg-zinc-800 transition-colors" :to="'/about'">About</router-link>
                        <router-link class="hidden md:inline-flex items-center px-3 py-2 text-zinc-300 rounded-lg font-medium hover:bg-zinc-800 transition-colors" :to="'/contact'">Contact</router-link>
                        <a class="hidden md:inline-flex items-center gap-2 px-4 py-2 text-zinc-950 rounded-lg font-medium btn btn-primary transition-colors" href="/tools">Browse Tools</a>
                    </div>
                </div>
            </div>
        </header>
        
        <div class="flex">
            <aside class="fixed left-0 top-16 w-64 border-r h-[calc(100vh-4rem)]">
                <Sidebar />
            </aside>
            <main class="flex-1 transition-all duration-300 lg:ml-64">
                <div class="min-h-[calc(100vh-4rem)] pt-16">
                    <div class="container mx-auto px-4 py-8">
                        <slot />
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
</script>