<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['title', 'buttons'])
const emit = defineEmits(['close', 'submit', 'delete'])

const dialog = ref(null)

function openDialog() {
  dialog.value.showModal()
}

function closeDialog() {
  dialog.value.close()
}

defineExpose({ openDialog, closeDialog })

const filteredButtons = computed(() => {
  return props.buttons.filter((button) => button.visible !== false)
})

function handleButtonClick(buttonType) {
  if (buttonType === 'simpleClose') {
    closeDialog()
  } else if (buttonType === 'close') {
    emit('close')
  } else if (buttonType === 'submit') {
    emit('submit')
  } else if (buttonType === 'delete') {
    emit('delete')
  }
}
</script>

<template>
  <dialog class="t-relative t-z-10" ref="dialog">
    <div class="t-fixed t-inset-0 t-bg-gray-500 t-bg-opacity-75 t-transition-opacity" />

    <div class="t-fixed t-inset-0 t-z-10 t-w-screen t-overflow-y-auto">
      <div class="t-flex t-min-h-full t-items-center t-justify-center t-p-4 t-text-center sm:t-p-0">
        <div
          class="t-relative t-transform t-overflow-hidden t-rounded-lg t-bg-white dark:t-bg-gray-900 t-px-4 t-pb-4 t-pt-5 t-text-left t-shadow-xl t-transition-all sm:t-my-8 t-w-full t-max-w-md sm:t-max-w-lg sm:t-p-6"
        >
          <div>
            <div>
              <h3 class="t-text-base t-font-semibold t-leading-6 t-text-gray-900 dark:t-text-white">
                {{ title }}
              </h3>
              <div class="t-mt-5">
                <slot />
              </div>
            </div>
          </div>
          <div
            :class="[
              't-mt-5 sm:t-mt-6',
              filteredButtons.length === 1 ? '' : 'sm:t-grid sm:t-grid-flow-row-dense sm:t-gap-3',
              filteredButtons.length === 2 ? 'sm:t-grid-cols-2' : '',
              filteredButtons.length === 3 ? 'sm:t-grid-cols-3' : ''
            ]"
          >
            <button
              v-for="(button, index) in filteredButtons"
              :key="button.type"
              type="button"
              :class="[
                't-inline-flex t-w-full t-justify-center t-rounded-md t-px-3 t-py-2 t-text-sm t-font-semibold t-shadow-sm focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2',
                button.type === 'delete'
                  ? 't-bg-red-500 t-text-white hover:t-bg-red-600 focus-visible:t-outline-red-500'
                  : button.type === 'simpleClose' || button.type === 'close'
                    ? 't-bg-white t-text-gray-900 hover:t-bg-gray-50 t-ring-1 t-ring-inset t-ring-gray-300'
                    : 't-bg-sky-500 t-text-white hover:t-bg-sky-600 focus-visible:t-outline-sky-500',
                filteredButtons.length > 1 && index > 0 ? 't-mt-3 sm:t-mt-0' : ''
              ]"
              @click="handleButtonClick(button.type)"
            >
              {{ button.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
