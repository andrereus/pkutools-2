<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <h2 class="text-h5 mt-3">{{ $t('email-auth.title') }}</h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
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
                    variant="filled"
                    rounded
                    :label="$t('email-auth.email')"
                    type="email"
                    class="mt-6"
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>

                  <v-text-field
                    variant="filled"
                    rounded
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
                    variant="filled"
                    rounded
                    :label="$t('email-auth.name')"
                    type="text"
                    class="mt-8"
                    v-model="name"
                  ></v-text-field>

                  <v-text-field
                    variant="filled"
                    rounded
                    :label="$t('email-auth.email')"
                    type="email"
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>

                  <v-text-field
                    variant="filled"
                    rounded
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
                    variant="filled"
                    rounded
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
      </v-col>
    </v-row>

    <v-snackbar location="bottom" color="warning" v-model="offlineInfo">
      {{ $t('app.offline') }}
      <template v-slot:action="{ attrs }">
        <v-btn variant="text" v-bind="attrs" @click="offlineInfo = false">
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  metaInfo() {
    return {
      title: this.$t('email-auth.title'),
      meta: [{ name: 'description', content: this.$t('email-auth.description') }]
    }
  },
  data: () => ({
    mdiEye,
    mdiEyeOff,
    offlineInfo: false,
    tab: null,
    name: null,
    email: null,
    password: null,
    show1: false
  }),
  methods: {
    async registerEmailPassword() {
      if (navigator.onLine) {
        const store = useStore()
        try {
          await store.registerWithEmail(this.email, this.password, this.name)
          this.$router.push('/')
        } catch (error) {
          alert(this.$t('email-auth.error'))
          console.error(error)
        }
      } else {
        this.offlineInfo = true
      }
    },
    async signInEmailPassword() {
      if (navigator.onLine) {
        const store = useStore()
        try {
          await store.signInWithEmail(this.email, this.password)
          this.$router.push('/')
        } catch (error) {
          alert(this.$t('email-auth.error'))
          console.error(error)
        }
      } else {
        this.offlineInfo = true
      }
    },
    async resetPassword() {
      if (navigator.onLine) {
        const store = useStore()
        try {
          await store.resetPassword(this.email)
          alert(this.$t('email-auth.password-sent'))
        } catch (error) {
          alert(this.$t('email-auth.error'))
          console.error(error)
        }
      } else {
        this.offlineInfo = true
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
