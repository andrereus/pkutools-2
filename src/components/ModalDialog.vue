<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['title', 'buttons'])
const emit = defineEmits(['close', 'edit', 'submit', 'delete'])

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
  } else if (buttonType === 'edit') {
    emit('edit')
  } else if (buttonType === 'submit') {
    emit('submit')
  } else if (buttonType === 'delete') {
    emit('delete')
  }
}
</script>

<template>
  <dialog class="relative z-10 dark:text-white" ref="dialog">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-md sm:max-w-lg sm:p-6"
        >
          <div>
            <div>
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <div class="mt-3">
                <slot />
              </div>
            </div>
          </div>
          <div
            :class="[
              'mt-5 sm:mt-6',
              filteredButtons.length === 1 ? '' : 'sm:grid sm:grid-flow-row-dense sm:gap-3',
              filteredButtons.length === 2 ? 'sm:grid-cols-2' : '',
              filteredButtons.length === 3 ? 'sm:grid-cols-3' : ''
            ]"
          >
            <button
              v-for="(button, index) in filteredButtons"
              :key="button.type"
              type="button"
              :class="[
                'inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                button.type === 'delete'
                  ? 'bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500'
                  : button.type === 'simpleClose' ||
                      button.type === 'close' ||
                      button.type === 'edit'
                    ? 'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300'
                    : 'bg-sky-500 text-white hover:bg-sky-600 focus-visible:outline-sky-500',
                filteredButtons.length > 1 && index > 0 ? 'mt-3 sm:mt-0' : ''
              ]"
              @click="handleButtonClick(button.type)"
              :autofocus="
                button.type === 'submit' || button.type === 'simpleClose' || button.type === 'close'
              "
            >
              {{ button.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
