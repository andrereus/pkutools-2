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
        <TabList class="t-mb-6">
          <Tab v-slot="{ selected }">
            <button
              :class="{
                't-bg-black/5 dark:t-bg-white/15 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300':
                  selected,
                't-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300':
                  !selected
              }"
            >
              {{ $t('email-auth.signin') }}
            </button>
          </Tab>
          <Tab v-slot="{ selected }">
            <button
              :class="{
                't-bg-black/5 dark:t-bg-white/15 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300':
                  selected,
                't-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300':
                  !selected
              }"
            >
              {{ $t('email-auth.register') }}
            </button>
          </Tab>
          <Tab v-slot="{ selected }">
            <button
              :class="{
                't-bg-black/5 dark:t-bg-white/15 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300':
                  selected,
                't-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300':
                  !selected
              }"
            >
              {{ $t('email-auth.forgot-password') }}
            </button>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <v-text-field
              :label="$t('email-auth.email')"
              type="email"
              class="mt-6"
              v-model="email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>

            <v-text-field
              :label="$t('email-auth.password')"
              :type="show1 ? 'text' : 'password'"
              v-model="password"
              :append-icon="show1 ? mdiEye : mdiEyeOff"
              :rules="[rules.required, rules.min]"
              :hint="$t('email-auth.min-length')"
              @click:append="show1 = !show1"
              spellcheck="false"
            ></v-text-field>

            <v-btn
              variant="flat"
              rounded
              color="primary"
              class="mr-3 mb-3"
              @click="signInEmailPassword"
            >
              {{ $t('email-auth.signin') }}
            </v-btn>
          </TabPanel>
          <TabPanel>
            <p class="mt-2">{{ $t('email-auth.register-note') }}</p>

            <v-text-field
              :label="$t('email-auth.name')"
              type="text"
              class="mt-8"
              v-model="name"
            ></v-text-field>

            <v-text-field
              :label="$t('email-auth.email')"
              type="email"
              v-model="email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>

            <v-text-field
              :label="$t('email-auth.password')"
              :type="show1 ? 'text' : 'password'"
              v-model="password"
              :append-icon="show1 ? mdiEye : mdiEyeOff"
              :rules="[rules.required, rules.min]"
              :hint="$t('email-auth.min-length')"
              @click:append="show1 = !show1"
              spellcheck="false"
            ></v-text-field>

            <v-btn
              variant="flat"
              rounded
              color="primary"
              class="mr-3 mb-3"
              @click="registerEmailPassword"
            >
              {{ $t('email-auth.register') }}
            </v-btn>
          </TabPanel>
          <TabPanel>
            <p class="mt-2">{{ $t('email-auth.reset-note') }}</p>

            <v-text-field
              :label="$t('email-auth.email')"
              type="email"
              class="mt-8"
              v-model="email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>

            <v-btn variant="flat" rounded color="primary" class="mr-3 mb-3" @click="resetPassword">
              {{ $t('email-auth.reset-password') }}
            </v-btn>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { mdiEye, mdiEyeOff } from '@mdi/js'

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import PageHeader from '../components/PageHeader.vue'

export default {
  components: {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    PageHeader
  },
  data: () => ({
    mdiEye,
    mdiEyeOff,
    tab: null,
    name: null,
    email: null,
    password: null,
    show1: false
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
    rules() {
      return {
        required: (value) => !!value || this.$t('email-auth.required'),
        min: (v) => (v !== null && v.length >= 8) || this.$t('email-auth.min-length'),
        email: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return pattern.test(value) || this.$t('email-auth.invalid-email')
        }
      }
    },
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

<style lang="scss" scoped>
.v-btn {
  text-transform: none;
}
</style>
