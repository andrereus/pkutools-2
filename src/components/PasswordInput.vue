<script setup>
import { ref, watch } from 'vue'
import { EyeOff, Eye } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps(['idName', 'label'])
const model = defineModel()
const showPassword = ref(false)
const errorMessage = ref('')
const { t } = useI18n()

const validatePassword = () => {
  if (model.value && model.value.length >= 8) {
    errorMessage.value = ''
  } else {
    errorMessage.value = t('email-auth.min-length')
  }
}

watch(model, () => {
  if (!model.value) {
    errorMessage.value = t('email-auth.required')
  } else {
    validatePassword()
  }
})
</script>

<template>
  <div>
    <label
      :for="idName"
      class="t-block t-text-sm t-font-medium t-leading-6 t-text-gray-900 dark:t-text-gray-300"
      >{{ label }}</label
    >
    <div class="t-mt-1 t-mb-3">
      <div class="t-relative t-mt-1.5">
        <input
          :type="showPassword ? 'text' : 'password'"
          :name="idName"
          :id="idName"
          v-model="model"
          @blur="validatePassword"
          class="t-block t-w-full t-rounded-md t-border-0 t-bg-white t-py-1.5 t-pr-10 t-text-gray-900 t-shadow-sm t-ring-1 t-ring-inset t-ring-gray-300 placeholder:t-text-gray-400 focus:t-ring-2 focus:t-ring-inset focus:t-ring-sky-500 sm:t-text-sm sm:t-leading-6 dark:t-bg-gray-800 dark:t-text-gray-300 dark:t-ring-gray-600 dark:focus:t-ring-sky-500"
          spellcheck="false"
        />
        <div
          @click="showPassword = !showPassword"
          class="t-absolute t-inset-y-0 t-right-0 t-flex t-items-center t-pr-3 t-cursor-pointer"
        >
          <Eye v-if="showPassword" class="t-h-5 t-w-5 t-text-gray-400" aria-hidden="true" />
          <EyeOff v-else class="t-h-5 t-w-5 t-text-gray-400" aria-hidden="true" />
        </div>
      </div>
      <p v-if="errorMessage" class="t-text-red-600 t-text-sm t-mt-1.5">{{ errorMessage }}</p>
    </div>
  </div>
</template>
