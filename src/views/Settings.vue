<template>
  <div>
    <header>
      <h2 class="t-text-2xl t-text-gray-900 dark:t-text-gray-300 t-mb-6">
        {{ $t('settings.title') }}
      </h2>
    </header>

    <label
      for="theme-select"
      class="t-block t-text-sm t-font-medium t-leading-6 t-text-gray-900 dark:t-text-gray-300"
      >{{ $t('settings.theme') }}</label
    >
    <select
      id="theme-select"
      name="theme-select"
      v-model="selectedTheme"
      @change="handleThemeChange"
      class="t-mt-2 t-block t-w-full t-rounded-md t-border-0 t-py-1.5 t-pl-3 t-pr-10 t-text-gray-900 t-ring-1 t-ring-inset t-ring-gray-300 focus:t-ring-2 focus:t-ring-sky-500 sm:t-text-sm sm:t-leading-6 dark:t-text-gray-300 dark:t-ring-gray-600 dark:focus:t-ring-sky-500 t-bg-white dark:t-bg-gray-800 t-mb-4"
    >
      <option v-for="option in themeOptions" :key="option.value" :value="option.value">
        {{ option.title }}
      </option>
    </select>

    <div v-if="!userIsAuthenticated" class="t-mt-8">
      <button
        type="button"
        @click="signInGoogle"
        class="t-rounded t-bg-gray-200 dark:t-bg-white/20 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-white t-shadow-sm hover:t-bg-gray-300 dark:hover:t-bg-white/15 t-mr-3 t-mb-6"
      >
        {{ $t('app.signin-google') }}
      </button>
      <br />
      <RouterLink
        type="button"
        to="/email-auth"
        class="t-rounded t-bg-gray-200 dark:t-bg-white/20 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-white t-shadow-sm hover:t-bg-gray-300 dark:hover:t-bg-white/15 t-mr-3 t-mb-6"
      >
        {{ $t('email-auth.title') }}
      </RouterLink>
    </div>

    <div v-if="userIsAuthenticated">
      <label
        for="max-phe"
        class="t-block t-text-sm t-font-medium t-leading-6 t-text-gray-900 dark:t-text-gray-300"
        >{{ $t('settings.max-phe') }}</label
      >
      <div class="t-mt-2 t-mb-6">
        <input
          type="number"
          name="max-phe"
          id="max-phe"
          v-model.number="settings.maxPhe"
          class="t-block t-w-full t-rounded-md t-border-0 t-py-1.5 t-text-gray-900 t-shadow-sm t-ring-1 t-ring-inset t-ring-gray-300 placeholder:t-text-gray-400 focus:t-ring-2 focus:t-ring-inset focus:t-ring-sky-500 sm:t-text-sm sm:t-leading-6 dark:t-text-gray-300 dark:t-ring-gray-600 dark:focus:t-ring-sky-500 t-bg-white dark:t-bg-gray-800"
        />
      </div>

      <button
        type="button"
        @click="save"
        class="t-rounded t-bg-sky-500 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-600 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500 t-mb-6"
      >
        {{ $t('common.save') }}
      </button>

      <h2 class="t-text-2xl t-text-gray-900 dark:t-text-gray-300 t-my-6">
        {{ $t('settings.reset-heading') }}
      </h2>

      <button
        type="button"
        @click="resetLog"
        class="t-rounded t-bg-gray-200 dark:t-bg-white/20 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-white t-shadow-sm hover:t-bg-gray-300 dark:hover:t-bg-white/15 t-mr-3 t-mb-6"
      >
        {{ $t('settings.reset-log') }}
      </button>
      <button
        type="button"
        @click="resetOwnFood"
        class="t-rounded t-bg-gray-200 dark:t-bg-white/20 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-white t-shadow-sm hover:t-bg-gray-300 dark:hover:t-bg-white/15 t-mr-3 t-mb-6"
      >
        {{ $t('settings.reset-own-food') }}
      </button>
      <button
        type="button"
        @click="resetDiary"
        class="t-rounded t-bg-gray-200 dark:t-bg-white/20 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-white t-shadow-sm hover:t-bg-gray-300 dark:hover:t-bg-white/15 t-mr-3 t-mb-6"
      >
        {{ $t('settings.reset-diary') }}
      </button>

      <h2 class="t-text-2xl t-text-gray-900 dark:t-text-gray-300 t-my-6">
        {{ $t('settings.delete-account') }}
      </h2>

      <p class="t-mb-6">
        {{ $t('settings.delete-account-info') }}
      </p>

      <button
        type="button"
        @click="deleteAccount"
        class="t-rounded t-bg-gray-200 dark:t-bg-white/20 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-white t-shadow-sm hover:t-bg-gray-300 dark:hover:t-bg-white/15 t-mr-3 t-mb-6"
      >
        {{ $t('settings.delete-account') }}
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, remove, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { useTheme } from 'vuetify'

export default {
  data: () => ({
    selectedTheme: 'system'
  }),
  setup() {
    const theme = useTheme()
    const handleSystemThemeChange = (e) => {
      theme.global.name.value = e.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme.global.name.value)
      if (theme.global.name.value === 'dark') {
        document.documentElement.classList.add('t-dark')
      } else {
        document.documentElement.classList.remove('t-dark')
      }
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
      if (theme.global.name.value === 'dark') {
        document.documentElement.classList.add('t-dark')
      } else {
        document.documentElement.classList.remove('t-dark')
      }
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
      try {
        await store.signInGoogle()
      } catch (error) {
        alert(this.$t('app.auth-error'))
        console.error(error)
      }
    },
    save() {
      const db = getDatabase()
      update(ref(db, `${this.user.id}/settings`), {
        maxPhe: this.settings.maxPhe || 0
      }).then(() => {
        alert(this.$t('settings.saved'))
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
    themeOptions() {
      return [
        { title: this.$t('settings.theme-system'), value: 'system' },
        { title: this.$t('settings.theme-light'), value: 'light' },
        { title: this.$t('settings.theme-dark'), value: 'dark' }
      ]
    },
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
