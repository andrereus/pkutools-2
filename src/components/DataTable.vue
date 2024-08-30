<script setup>
defineProps(['headers'])
</script>

<template>
  <div class="t-mt-6 t-flow-root">
    <div class="t--mx-4 t--my-2 t-overflow-x-auto sm:t--mx-6 lg:t--mx-8">
      <div class="t-inline-block t-min-w-full t-py-2 t-align-middle sm:t-px-6 lg:t-px-8">
        <div
          class="t-overflow-hidden t-shadow t-ring-1 t-ring-black dark:t-ring-gray-800 t-ring-opacity-5 sm:t-rounded-lg"
        >
          <table class="t-min-w-full t-divide-y t-divide-gray-300 dark:t-divide-gray-600">
            <thead class="t-bg-gray-50 dark:t-bg-gray-950">
              <tr>
                <th
                  v-for="(header, index) in headers"
                  :key="header.key"
                  scope="col"
                  :class="[
                    't-py-3.5 t-text-left t-text-sm t-font-semibold t-text-gray-900 dark:t-text-gray-300',
                    index === 0 ? 't-pl-4 t-pr-3 sm:t-pl-6' : 't-px-3'
                  ]"
                >
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody
              class="t-divide-y t-divide-gray-200 dark:t-divide-gray-700 t-bg-white dark:t-bg-gray-900"
            >
              <slot />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
