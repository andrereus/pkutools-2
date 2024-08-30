<script setup>
defineProps(['text'])
</script>

<template>
  <button
    type="button"
    class="t-rounded t-bg-sky-500 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-600 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500 t-mr-3 t-mb-6"
  >
    {{ text }}
  </button>
</template>
