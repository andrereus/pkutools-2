<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <h2 class="text-h5 mt-3">{{ $t('settings.title') }}</h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <div v-if="!userIsAuthenticated">
          <v-btn variant="flat" rounded @click="signInGoogle" class="mt-2">
            <v-icon start>{{ mdiGoogle }}</v-icon>
            {{ $t('app.signin-google') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded @click="signInFacebook" class="mt-2">
            <v-icon start>{{ mdiFacebook }}</v-icon>
            {{ $t('app.signin-facebook') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded to="/email-auth" class="mt-2">
            <v-icon start>{{ mdiEmail }}</v-icon>
            {{ $t('email-auth.title') }}
          </v-btn>
        </div>

        <div v-if="userIsAuthenticated">
          <v-text-field
            variant="filled"
            rounded
            :label="$t('settings.max-phe')"
            v-model.number="settings.maxPhe"
            type="number"
          ></v-text-field>

          <v-text-field
            variant="filled"
            rounded
            :label="$t('settings.max-amino')"
            v-model.number="settings.maxAmino"
            type="number"
          ></v-text-field>

          <v-switch
            v-model="useThemeFromDevice"
            inset
            :label="$t('app.dark')"
            class="mt-n1 mb-2 ml-1"
          ></v-switch>

          <v-btn variant="flat" rounded color="primary" class="mr-3 mb-3" @click="save">{{
            $t('common.save')
          }}</v-btn>

          <h2 class="text-h5 mt-6 mb-4">{{ $t('settings.reset-heading') }}</h2>

          <v-btn variant="flat" rounded class="mr-6 mb-5" @click="resetLog">
            {{ $t('settings.reset-log') }}
          </v-btn>
          <v-btn variant="flat" rounded class="mr-6 mb-5" @click="resetDiary">
            {{ $t('settings.reset-diary') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded class="mr-6 mb-5" @click="resetAM">
            {{ $t('settings.reset-am') }}
          </v-btn>
          <v-btn variant="flat" rounded class="mr-6 mb-5" @click="resetOwnFood">
            {{ $t('settings.reset-own-food') }}
          </v-btn>

          <h2 class="text-h5 mt-6 mb-4">{{ $t('settings.delete-account') }}</h2>

          <v-btn variant="outlined" rounded color="error" class="mr-6 mb-5" @click="deleteAccount">
            {{ $t('settings.delete-account') }}
          </v-btn>

          <p class="mt-6 mb-8 text--secondary">
            {{ $t('home.support-me') }}
            <a href="https://ko-fi.com/andrereus" target="_blank">
              <img
                v-if="!$vuetify.theme.dark"
                src="../assets/kofi.png"
                alt="Support me"
                max-width="200"
                class="mt-2"
              />
              <img
                v-if="$vuetify.theme.dark"
                src="../assets/kofi-dark.png"
                alt="Support me"
                max-width="200"
                class="mt-2"
              />
            </a>
          </p>

          <v-snackbar location="bottom" color="teal" v-model="snackbar">
            {{ $t('settings.saved') }}
            <template v-slot:action="{ attrs }">
              <v-btn variant="text" v-bind="attrs" @click="snackbar = false">
                {{ $t('common.close') }}
              </v-btn>
            </template>
          </v-snackbar>
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
import { getDatabase, ref, remove, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { useTheme } from 'vuetify'
import { mdiGoogle, mdiFacebook, mdiEmail } from '@mdi/js'

export default {
  metaInfo() {
    return {
      title: this.$t('settings.title'),
      meta: [{ name: 'description', content: this.$t('settings.description') }]
    }
  },
  data: () => ({
    mdiGoogle,
    mdiFacebook,
    mdiEmail,
    snackbar: false,
    offlineInfo: false,
    useThemeFromDevice: true
  }),
  setup() {
    const theme = useTheme()
    const handleSystemThemeChange = (e) => {
      theme.global.name.value = e.matches ? 'dark' : 'light'
    }
    function toggleThemeFromDevice() {
      localStorage.vuetifyThemeFromDevice = JSON.stringify(this.useThemeFromDevice)
      if (this.useThemeFromDevice === true || !localStorage.vuetifyCurrentTheme) {
        theme.global.name.value = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', handleSystemThemeChange)
      } else {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', handleSystemThemeChange)
        theme.global.name.value = JSON.parse(localStorage.vuetifyCurrentTheme)
      }
    }
    function mountThemeFromDevice() {
      if (localStorage.vuetifyThemeFromDevice) {
        this.useThemeFromDevice = JSON.parse(localStorage.vuetifyThemeFromDevice)
      } else {
        localStorage.vuetifyThemeFromDevice = JSON.stringify(this.useThemeFromDevice)
      }
    }
    return {
      toggleThemeFromDevice,
      mountThemeFromDevice
    }
  },
  methods: {
    signInGoogle() {
      const store = useStore()
      if (navigator.onLine) {
        store.signInGoogle()
      } else {
        this.offlineInfo = true
      }
    },
    signInFacebook() {
      const store = useStore()
      if (navigator.onLine) {
        store.signInFacebook()
      } else {
        this.offlineInfo = true
      }
    },
    save() {
      const db = getDatabase()
      update(ref(db, `${this.user.id}/settings`), {
        maxPhe: this.settings.maxPhe || 0,
        maxAmino: this.settings.maxAmino || 3
      }).then(() => {
        this.toggleThemeFromDevice()
        this.snackbar = true
      })
    },
    resetLog() {
      let r = confirm(this.$t('settings.reset-log') + '?')
      if (r === true) {
        const db = getDatabase()
        remove(ref(db, `${this.user.id}/pheLog`))
        this.$router.push('/')
      }
    },
    resetOwnFood() {
      let r = confirm(this.$t('settings.reset-own-food') + '?')
      if (r === true) {
        const db = getDatabase()
        remove(ref(db, `${this.user.id}/ownFood`))
        this.$router.push('own-food')
      }
    },
    resetDiary() {
      let r = confirm(this.$t('settings.reset-diary') + '?')
      if (r === true) {
        const db = getDatabase()
        remove(ref(db, `${this.user.id}/pheDiary`))
        this.$router.push('phe-diary')
      }
    },
    resetAM() {
      let r = confirm(this.$t('settings.reset-am') + '?')
      if (r === true) {
        const db = getDatabase()
        remove(ref(db, `${this.user.id}/aminoCounter`))
        this.$router.push('amino-counter')
      }
    },
    deleteAccount() {
      let r = confirm(this.$t('settings.delete-account') + '?')
      if (r === true) {
        const db = getDatabase()
        const store = useStore()
        const auth = getAuth()
        remove(ref(db, store.user.id))
        auth.currentUser
          .delete()
          .then(() => {
            store.signOut()
            this.$router.push('/')
          })
          .catch((error) => {
            alert(error)
          })
      }
    }
  },
  mounted() {
    this.mountThemeFromDevice()
  },
  computed: {
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    },
    settings() {
      const store = useStore()
      return store.settings
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: none;
}
</style>
