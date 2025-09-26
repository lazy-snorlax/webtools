<template>
    <footer class="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
        <!-- <nav class="grid grid-flow-col gap-4">
            <router-link :to="'/about'" class="link link-hover">About us</router-link>
            <router-link :to="'/contact'" class="link link-hover">Contact</router-link>
        </nav> -->
        <nav>
            <div class="grid grid-flow-col gap-4">
                <a href="https://github.com/lazy-snorlax" target="_blank" referrerPolicy="no-referrer" rel="noreferrer" className="text-3xl">
                    <i className="fa-brands fa-github"></i> Github
                </a>
                <a href="https://www.linkedin.com/in/anthony-morelli-246a69178/"
                target="_blank" referrerPolicy="no-referrer" rel="noreferrer" className="text-3xl px-4">
                    <i className="fa-brands fa-linkedin"></i> LinkedIn
                </a>
            </div>
        </nav>
        <aside>
            <p>Copyright © {{ new Date().getFullYear() }} - All right reserved</p>
        </aside>
    </footer>
</template>

<script setup>

</script>