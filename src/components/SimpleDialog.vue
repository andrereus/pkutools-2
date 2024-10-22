<script setup>
import { ref } from 'vue'

defineProps(['title'])
defineEmits(['close'])

const dialog = ref(null)

function openDialog() {
  dialog.value.showModal()
}

function closeDialog() {
  dialog.value.close()
}

defineExpose({ openDialog, closeDialog })
</script>

<template>
  <dialog class="t-relative t-z-10 dark:t-text-white" ref="dialog">
    <div class="t-fixed t-inset-0 t-bg-gray-500 t-bg-opacity-75 t-transition-opacity" />

    <div class="t-fixed t-inset-0 t-z-10 t-w-screen t-overflow-y-auto">
      <div class="t-flex t-min-h-full t-items-center t-justify-center t-p-4 t-text-center sm:t-p-0">
        <div
          class="t-relative t-transform t-overflow-hidden t-rounded-lg t-bg-white dark:t-bg-gray-900 t-px-4 t-pb-4 t-pt-5 t-text-left t-shadow-xl t-transition-all sm:t-my-8 sm:t-w-full sm:t-max-w-screen-sm sm:t-p-6"
        >
          <div>
            <div class="t-text-center">
              <h3 class="t-text-base t-font-semibold t-leading-6 t-text-gray-900 dark:t-text-white">
                {{ title }}
              </h3>
              <div class="t-mt-3">
                <slot />
              </div>
            </div>
          </div>
          <div class="t-mt-5 sm:t-mt-6">
            <button
              type="button"
              class="t-inline-flex t-w-full t-justify-center t-rounded-md t-bg-sky-500 t-px-3 t-py-2 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-500 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500"
              @click="$emit('close')"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
