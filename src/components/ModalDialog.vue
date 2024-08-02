<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

defineProps({
  open: {
    default: false
  },
  title: {
    default: ''
  },
  hasSubmit: {
    default: false
  }
})
defineEmits(['close', 'cancel', 'submit'])
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="t-relative t-z-10" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="t-ease-out t-duration-300"
        enter-from="t-opacity-0"
        enter-to="t-opacity-100"
        leave="t-ease-in t-duration-200"
        leave-from="t-opacity-100"
        leave-to="t-opacity-0"
      >
        <div class="t-fixed t-inset-0 t-bg-gray-500 t-bg-opacity-75 t-transition-opacity" />
      </TransitionChild>

      <div class="t-fixed t-inset-0 t-z-10 t-w-screen t-overflow-y-auto">
        <div
          class="t-flex t-min-h-full t-items-center t-justify-center t-p-4 t-text-center sm:t-p-0"
        >
          <TransitionChild
            as="template"
            enter="t-ease-out t-duration-300"
            enter-from="t-opacity-0 t-translate-y-4 sm:t-translate-y-0 sm:t-scale-95"
            enter-to="t-opacity-100 t-translate-y-0 sm:t-scale-100"
            leave="t-ease-in t-duration-200"
            leave-from="t-opacity-100 t-translate-y-0 sm:t-scale-100"
            leave-to="t-opacity-0 t-translate-y-4 sm:t-translate-y-0 sm:t-scale-95"
          >
            <DialogPanel
              class="t-relative t-transform t-overflow-hidden t-rounded-lg t-bg-white dark:t-bg-gray-900 t-px-4 t-pb-4 t-pt-5 t-text-left t-shadow-xl t-transition-all sm:t-my-8 sm:t-w-full sm:t-max-w-screen-sm sm:t-p-6"
            >
              <div>
                <div class="t-text-center">
                  <DialogTitle
                    as="h3"
                    class="t-text-base t-font-semibold t-leading-6 t-text-gray-900 dark:t-text-white"
                    >{{ title }}</DialogTitle
                  >
                  <div class="t-mt-3">
                    <slot />
                  </div>
                </div>
              </div>
              <div
                class="t-mt-5 sm:t-mt-6 sm:t-grid sm:t-grid-flow-row-dense sm:t-gap-3"
                :class="{ 'sm:t-grid-cols-1': !hasSubmit, 'sm:t-grid-cols-2': hasSubmit }"
              >
                <button
                  v-if="hasSubmit"
                  type="button"
                  class="t-inline-flex t-w-full t-justify-center t-rounded-md t-bg-sky-500 t-px-3 t-py-2 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-500 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500 sm:t-col-start-2"
                  @click="$emit('submit')"
                >
                  {{ $t('common.save') }}
                </button>
                <button
                  type="button"
                  class="t-mt-3 t-inline-flex t-w-full t-justify-center t-rounded-md t-bg-white t-px-3 t-py-2 t-text-sm t-font-semibold t-text-gray-900 t-shadow-sm t-ring-1 t-ring-inset t-ring-gray-300 hover:t-bg-gray-50 sm:t-col-start-1 sm:t-mt-0"
                  @click="$emit('cancel')"
                  ref="cancelButtonRef"
                >
                  {{ $t('common.cancel') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
