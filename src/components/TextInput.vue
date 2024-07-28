<script setup>
defineProps(['idName', 'label'])
const model = defineModel()
</script>

<template>
  <div>
    <label
      :for="idName"
      class="t-block t-text-sm t-font-medium t-leading-6 t-text-gray-900 dark:t-text-gray-300"
      >{{ label }}</label
    >
    <div class="t-mt-2 t-mb-4">
      <input
        type="text"
        :name="idName"
        :id="idName"
        v-model="model"
        class="t-block t-w-full t-rounded-md t-border-0 t-py-1.5 t-text-gray-900 t-shadow-sm t-ring-1 t-ring-inset t-ring-gray-300 placeholder:t-text-gray-400 focus:t-ring-2 focus:t-ring-inset focus:t-ring-sky-500 sm:t-text-sm sm:t-leading-6 dark:t-text-gray-300 dark:t-ring-gray-600 dark:focus:t-ring-sky-500 t-bg-white dark:t-bg-gray-800"
      />
    </div>
  </div>
</template>
