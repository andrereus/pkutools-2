<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import PageHeader from '../components/PageHeader.vue'
import SecondaryButton from '../components/SecondaryButton.vue'

const store = useStore()
const { t, locale } = useI18n()
const messageInput = ref('')

const userIsAuthenticated = computed(() => store.user !== null)
const messages = computed(() => store.chatMessages)
const hasLicense = computed(() => store.settings?.license)
const assistantBusy = computed(() => store.assistantBusy)

async function sendMessage() {
  if (!messageInput.value.trim()) return
  await store.sendChatMessage(messageInput.value, locale.value)
  messageInput.value = ''
}

const signInGoogle = async () => {
  try {
    await store.signInGoogle()
  } catch (error) {
    alert(t('app.auth-error'))
    console.error(error)
  }
}

const clearChat = () => {
  if (confirm(t('chat.confirm-clear'))) {
    store.clearChatMessages()
  }
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('chat.title')" class="inline-block" />
      <span
        class="ml-2 inline-block align-top mt-1 rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20"
        >{{ $t('app.experiment') }}</span
      >
    </header>

    <div v-if="!userIsAuthenticated">
      <SecondaryButton :text="$t('app.signin-google')" @click="signInGoogle" />
      <br />
      <RouterLink
        type="button"
        to="/email-auth"
        class="rounded bg-black/5 dark:bg-white/15 px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm hover:bg-black/10 dark:hover:bg-white/10 mr-3 mb-6"
      >
        {{ $t('email-auth.title') }}
      </RouterLink>
    </div>

    <div v-else-if="!hasLicense">
      <p>{{ $t('chat.license-required') }}</p>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-4">
        <button
          v-if="messages.length > 0"
          @click="clearChat"
          class="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400"
        >
          {{ $t('chat.clear') }}
        </button>
      </div>
      <div class="border dark:border-gray-700 rounded-lg p-4 h-96 overflow-y-auto mb-4">
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <div
            :class="[
              'p-3 rounded-lg max-w-[80%]',
              message.role === 'user'
                ? 'ml-auto bg-sky-100 dark:bg-sky-900'
                : 'bg-gray-100 dark:bg-gray-800'
            ]"
          >
            {{ message.content }}
          </div>
        </div>
        <div v-if="assistantBusy" class="text-gray-500 text-sm">
          {{ $t('chat.thinking') }}
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="messageInput"
          type="text"
          :placeholder="$t('chat.placeholder')"
          class="flex-1 rounded-md border-0 bg-white/5 px-3.5 py-2 text-black dark:text-white shadow-sm ring-1 ring-inset ring-black/10 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sky-500"
          :disabled="assistantBusy"
        />
        <button
          type="submit"
          class="rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50"
          :disabled="!messageInput.trim() || assistantBusy"
        >
          {{ $t('chat.send') }}
        </button>
      </form>
    </div>
  </div>
</template>
