<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <h2 class="text-h5 mt-3">{{ $t('settings.title') }}</h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <v-select
          :items="themeOptions"
          v-model="selectedTheme"
          :label="$t('settings.theme')"
          @update:modelValue="handleThemeChange"
        ></v-select>

        <div v-if="!userIsAuthenticated">
          <v-btn variant="flat" rounded color="btnsecondary" @click="signInGoogle" class="mt-2">
            <v-icon start>{{ mdiGoogle }}</v-icon>
            {{ $t('app.signin-google') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded color="btnsecondary" to="/email-auth" class="mt-2">
            <v-icon start>{{ mdiEmail }}</v-icon>
            {{ $t('email-auth.title') }}
          </v-btn>
        </div>

        <div v-if="userIsAuthenticated">
          <v-text-field
            :label="$t('settings.max-phe')"
            v-model.number="settings.maxPhe"
            type="number"
          ></v-text-field>

          <v-btn variant="flat" rounded color="primary" class="mr-3 mb-3" @click="save">{{
            $t('common.save')
          }}</v-btn>

          <h2 class="text-h5 mt-6 mb-4">{{ $t('settings.reset-heading') }}</h2>

          <v-btn variant="flat" rounded color="btnsecondary" class="mr-6 mb-5" @click="resetLog">
            {{ $t('settings.reset-log') }}
          </v-btn>
          <v-btn
            variant="flat"
            rounded
            color="btnsecondary"
            class="mr-6 mb-5"
            @click="resetOwnFood"
          >
            {{ $t('settings.reset-own-food') }}
          </v-btn>
          <v-btn variant="flat" rounded color="btnsecondary" class="mr-6 mb-5" @click="resetDiary">
            {{ $t('settings.reset-diary') }}
          </v-btn>

          <h2 class="text-h5 mt-6 mb-4">{{ $t('settings.delete-account') }}</h2>

          <p class="mb-6">
            {{ $t('settings.delete-account-info') }}
          </p>

          <v-btn variant="outlined" rounded color="error" class="mr-6 mb-5" @click="deleteAccount">
            {{ $t('settings.delete-account') }}
          </v-btn>

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
import { mdiGoogle, mdiEmail } from '@mdi/js'

export default {
  data: () => ({
    mdiGoogle,
    mdiEmail,
    snackbar: false,
    offlineInfo: false,
    themeOptions: ['system', 'light', 'dark'],
    selectedTheme: 'system'
  }),
  setup() {
    const theme = useTheme()
    const handleSystemThemeChange = (e) => {
      theme.global.name.value = e.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme.global.name.value)
    }
    function applyTheme(selectedTheme) {
      if (selectedTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.global.name.value = prefersDark ? 'dark' : 'light'
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', handleSystemThemeChange)
      } else {
        theme.global.name.value = selectedTheme
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', handleSystemThemeChange)
      }
      document.documentElement.setAttribute('data-theme', theme.global.name.value)
      localStorage.setItem('vuetifyCurrentTheme', selectedTheme)
    }
    return {
      applyTheme,
      handleSystemThemeChange
    }
  },
  methods: {
    async signInGoogle() {
      const store = useStore()
      if (navigator.onLine) {
        try {
          await store.signInGoogle()
        } catch (error) {
          alert(this.$t('app.auth-error'))
          console.error(error)
        }
      } else {
        this.offlineInfo = true
      }
    },
    save() {
      const db = getDatabase()
      update(ref(db, `${this.user.id}/settings`), {
        maxPhe: this.settings.maxPhe || 0
      }).then(() => {
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
            alert(this.$t('settings.delete-account-error'))
            console.error(error)
          })
      }
    },
    handleThemeChange() {
      this.applyTheme(this.selectedTheme)
    }
  },
  mounted() {
    const storedTheme = localStorage.getItem('vuetifyCurrentTheme') || 'system'
    this.selectedTheme = storedTheme
    this.applyTheme(this.selectedTheme)
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
