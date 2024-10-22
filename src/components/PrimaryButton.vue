<script setup>
defineProps(['text'])
</script>

<template>
  <button
    type="button"
    class="rounded bg-sky-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 mr-3 mb-3"
  >
    {{ text }}
  </button>
</template>
