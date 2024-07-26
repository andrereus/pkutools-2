<template>
  <div>
    <header>
      <h2 class="t-text-2xl t-text-gray-900 dark:t-text-gray-300 t-mb-6">
        {{ $t('email-auth.title') }}
      </h2>
    </header>

    <div v-if="userIsAuthenticated">
      <p>{{ $t('email-auth.signedin') }}</p>
    </div>

    <div v-if="!userIsAuthenticated">
      <p class="mb-6">{{ $t('email-auth.description') }}</p>

      <v-card variant="outlined">
        <v-tabs v-model="tab" show-arrows>
          <v-tab>{{ $t('email-auth.signin') }}</v-tab>
          <v-tab>{{ $t('email-auth.register') }}</v-tab>
          <v-tab>{{ $t('email-auth.forgot-password') }}</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item>
            <v-container fluid>
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
            </v-container>
          </v-window-item>

          <v-window-item>
            <v-container fluid>
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
            </v-container>
          </v-window-item>

          <v-window-item>
            <v-container fluid>
              <p class="mt-2">{{ $t('email-auth.reset-note') }}</p>

              <v-text-field
                :label="$t('email-auth.email')"
                type="email"
                class="mt-8"
                v-model="email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>

              <v-btn
                variant="flat"
                rounded
                color="primary"
                class="mr-3 mb-3"
                @click="resetPassword"
              >
                {{ $t('email-auth.reset-password') }}
              </v-btn>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
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
