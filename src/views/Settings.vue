<template>
  <div>
    <header>
      <PageHeader :title="$t('settings.title')" />
    </header>

    <SelectMenu
      id-name="theme-select"
      :label="$t('settings.theme')"
      v-model="selectedTheme"
      @change="handleThemeChange"
    >
      <option v-for="option in themeOptions" :key="option.value" :value="option.value">
        {{ option.title }}
      </option>
    </SelectMenu>

    <div v-if="!userIsAuthenticated" class="mt-8">
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

    <div v-if="userIsAuthenticated">
      <NumberInput
        id-name="max-phe"
        :label="$t('settings.max-phe')"
        v-model.number="settings.maxPhe"
        class="mb-6"
      />

      <PrimaryButton :text="$t('common.save')" @click="save" />

      <PageHeader :title="$t('settings.reset-heading')" class="mt-6" />

      <SecondaryButton :text="$t('settings.reset-log')" @click="resetLog" />
      <SecondaryButton :text="$t('settings.reset-diary')" @click="resetDiary" />
      <SecondaryButton :text="$t('settings.reset-own-food')" @click="resetOwnFood" />

      <PageHeader :title="$t('settings.delete-account')" class="mt-6" />

      <p class="mb-6">
        {{ $t('settings.delete-account-info') }}
      </p>

      <SecondaryButton :text="$t('settings.delete-account')" @click="deleteAccount" />
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, remove, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'

import PageHeader from '../components/PageHeader.vue'
import SelectMenu from '../components/SelectMenu.vue'
import NumberInput from '../components/NumberInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SecondaryButton from '../components/SecondaryButton.vue'

export default {
  components: {
    PageHeader,
    SelectMenu,
    NumberInput,
    PrimaryButton,
    SecondaryButton
  },
  data: () => ({
    selectedTheme: 'system'
  }),
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
      if (this.selectedTheme === 'light') {
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
      } else if (this.selectedTheme === 'dark') {
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.add('dark')
      } else {
        localStorage.removeItem('theme')
        if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
  },
  mounted() {
    this.selectedTheme = localStorage.getItem('theme') || 'system'
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
