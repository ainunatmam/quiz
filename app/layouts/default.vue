<template>
  <div class="min-h-screen flex flex-col w-full overflow-x-hidden relative">
    <slot />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
