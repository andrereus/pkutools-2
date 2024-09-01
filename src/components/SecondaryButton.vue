<script setup>
defineProps(['text'])
</script>

<template>
  <button
    type="button"
    class="t-rounded t-bg-black/5 dark:t-bg-white/15 t-px-2 t-py-1 t-text-sm t-text-gray-900 dark:t-text-gray-300 t-shadow-sm hover:t-bg-black/10 dark:hover:t-bg-white/10 t-mr-3 t-mb-3"
  >
    {{ text }}
  </button>
</template>
