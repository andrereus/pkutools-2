<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import PageHeader from '../components/PageHeader.vue'
import EmailInput from '../components/EmailInput.vue'
import PasswordInput from '../components/PasswordInput.vue'
import TextInput from '../components/TextInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

// Reactive state
const name = ref(null)
const email = ref(null)
const password = ref(null)

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)

// Methods
const registerEmailPassword = async () => {
  try {
    await store.registerWithEmail(email.value, password.value, name.value)
    router.push('/')
  } catch (error) {
    alert(t('email-auth.error'))
    console.error(error)
  }
}

const signInEmailPassword = async () => {
  try {
    await store.signInWithEmail(email.value, password.value)
    router.push('/')
  } catch (error) {
    alert(t('email-auth.error'))
    console.error(error)
  }
}

const resetPassword = async () => {
  try {
    await store.resetPassword(email.value)
    alert(t('email-auth.password-sent'))
  } catch (error) {
    alert(t('email-auth.error'))
    console.error(error)
  }
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('email-auth.title')" />
    </header>

    <div v-if="userIsAuthenticated">
      <p>{{ $t('email-auth.signedin') }}</p>
    </div>

    <div v-if="!userIsAuthenticated">
      <TabGroup>
        <TabList class="mb-6">
          <Tab v-slot="{ selected }">
            <button
              :class="[
                'rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300',
                selected
                  ? 'bg-black/5 dark:bg-white/15 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ $t('email-auth.signin') }}
            </button>
          </Tab>
          <Tab v-slot="{ selected }">
            <button
              :class="[
                'rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300',
                selected
                  ? 'bg-black/5 dark:bg-white/15 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ $t('email-auth.register') }}
            </button>
          </Tab>
          <Tab v-slot="{ selected }">
            <button
              :class="[
                'rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300',
                selected
                  ? 'bg-black/5 dark:bg-white/15 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ $t('email-auth.forgot-password') }}
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EmailInput id-name="email" :label="$t('email-auth.email')" v-model="email" />
            <PasswordInput
              id-name="password"
              :label="$t('email-auth.password')"
              v-model="password"
            />

            <PrimaryButton
              :text="$t('email-auth.signin')"
              @click="signInEmailPassword"
              class="mt-4"
            />
          </TabPanel>
          <TabPanel>
            <p class="mt-2 mb-6">{{ $t('email-auth.register-note') }}</p>

            <TextInput id-name="name" :label="$t('email-auth.name')" v-model="name" />
            <EmailInput id-name="register-email" :label="$t('email-auth.email')" v-model="email" />
            <PasswordInput
              id-name="register-password"
              :label="$t('email-auth.password')"
              v-model="password"
            />

            <PrimaryButton
              :text="$t('email-auth.register')"
              @click="registerEmailPassword"
              class="mt-4"
            />
          </TabPanel>
          <TabPanel>
            <p class="mt-2 mb-6">{{ $t('email-auth.reset-note') }}</p>

            <EmailInput id-name="reset-email" :label="$t('email-auth.email')" v-model="email" />

            <PrimaryButton
              :text="$t('email-auth.reset-password')"
              @click="resetPassword"
              class="mt-4"
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>
