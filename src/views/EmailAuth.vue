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

<script>
import { useStore } from '../stores/index'

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import PageHeader from '../components/PageHeader.vue'
import EmailInput from '../components/EmailInput.vue'
import PasswordInput from '../components/PasswordInput.vue'
import TextInput from '../components/TextInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

export default {
  components: {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    PageHeader,
    EmailInput,
    PasswordInput,
    TextInput,
    PrimaryButton
  },
  data: () => ({
    name: null,
    email: null,
    password: null
  }),
  methods: {
    async registerEmailPassword() {
      const store = useStore()
      try {
        await store.registerWithEmail(this.email, this.password, this.name)
        this.$router.push('/')
      } catch (error) {
        alert(this.$t('email-auth.error'))
        console.error(error)
      }
    },
    async signInEmailPassword() {
      const store = useStore()
      try {
        await store.signInWithEmail(this.email, this.password)
        this.$router.push('/')
      } catch (error) {
        alert(this.$t('email-auth.error'))
        console.error(error)
      }
    },
    async resetPassword() {
      const store = useStore()
      try {
        await store.resetPassword(this.email)
        alert(this.$t('email-auth.password-sent'))
      } catch (error) {
        alert(this.$t('email-auth.error'))
        console.error(error)
      }
    }
  },
  computed: {
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    }
  }
}
</script>
