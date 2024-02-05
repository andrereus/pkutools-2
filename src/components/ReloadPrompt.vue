<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()
</script>

<template>
  <div v-if="needRefresh" class="t-toast t-toast-center t-mb-12 xl:t-mb-0">
    <div class="t-alert t-border-solid t-border-2 t-border-sky-500">
      <p>{{ $t('app.update-info') }}</p>
      <button
        @click="updateServiceWorker()"
        class="t-btn t-btn-sm t-btn-neutral t-bg-sky-500 hover:t-bg-sky-500 t-text-white"
      >
        {{ $t('app.update') }}
      </button>
    </div>
  </div>
</template>
