<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push } from 'firebase/database'

import PageHeader from '../components/PageHeader.vue'

const router = useRouter()
const store = useStore()

// Reactive state
const chatContainer = ref(null)
const messages = ref([
  {
    role: 'assistant',
    content: 'Hallo! Ich bin dein PKU-Diät-Assistent. Wie kann ich dir heute helfen?'
  }
])
const input = ref('')
const isLoading = ref(false)

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const pheLog = computed(() => store.pheLog)
const settings = computed(() => store.settings)

const license = computed(
  () => settings.value.license === import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
)

const pheTolerance = computed(() => settings.value.maxPhe || 0)
const pheTotal = computed(() => {
  let phe = 0
  pheLog.value.forEach((item) => {
    phe += item.phe
  })
  return Math.round(phe)
})
const pheRemaining = computed(() => pheTolerance.value - pheTotal.value)

// Methods
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async (e) => {
  e.preventDefault()

  if (!input.value.trim() || isLoading.value) return

  const userMessage = input.value
  messages.value.push({ role: 'user', content: userMessage })
  input.value = ''
  await scrollToBottom()

  isLoading.value = true
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value,
        pheTolerance: pheTolerance.value,
        pheTotal: pheTotal.value,
        pheRemaining: pheRemaining.value
      })
    })

    if (!response.ok) throw new Error('Netzwerk-Fehler')

    messages.value.push({ role: 'assistant', content: '' })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const lastMessage = messages.value[messages.value.length - 1]
      lastMessage.content += decoder.decode(value)
      await scrollToBottom()
    }
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung der Anfrage.'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>

<template>
  <div v-if="userIsAuthenticated && license">
    <header>
      <PageHeader title="Diät Assistent" />
    </header>
    <div class="mx-auto">
      <div class="bg-white rounded-lg shadow">
        <!-- Chat Messages -->
        <div class="h-[50vh] overflow-y-auto p-4 space-y-4" ref="chatContainer">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'p-3 rounded-lg max-w-[80%]',
              message.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            ]"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t p-4">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="input"
              type="text"
              placeholder="Stelle eine Frage zur PKU-Diät..."
              class="flex-1 rounded-lg border-gray-300"
              :disabled="isLoading"
            />
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              :disabled="isLoading || !input.trim()"
            >
              {{ isLoading ? 'Sendet...' : 'Senden' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
