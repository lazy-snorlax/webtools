<template class="">
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>

<script setup lang="ts">

</script>
