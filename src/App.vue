<template>
  <v-app>
    <div class="t-navbar t-bg-base-100">
      <div class="t-flex-none">
        <div class="t-dropdown">
          <div
            tabindex="0"
            role="button"
            class="t-btn t-btn-ghost t-btn-circle"
            :aria-label="$t('app.main-menu')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="t-size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="t-menu t-menu-lg t-dropdown-content t-bg-base-100 t-rounded-box t-z-[2] t-mt-3 t-w-60 t-p-2 t-shadow"
          >
            <li>
              <router-link to="/" class="t-no-underline t-text-base-content">{{
                $t('home.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/phe-calculator" class="t-no-underline t-text-base-content">{{
                $t('phe-calculator.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/protein-calculator" class="t-no-underline t-text-base-content">{{
                $t('protein-calculator.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/barcode-scanner" class="t-no-underline t-text-base-content">{{
                $t('barcode-scanner.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/own-food" class="t-no-underline t-text-base-content">{{
                $t('own-food.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/phe-diary" class="t-no-underline t-text-base-content">{{
                $t('phe-diary.title')
              }}</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="t-flex-1">
        <router-link to="/" class="t-btn t-btn-ghost app-logo">
          <img src="./assets/pkutools-logo.png" alt="PKU Tools Logo" width="25" class="t-mr-2" />
          <span class="md:t-text-xl">PKU Tools</span>
        </router-link>
      </div>
      <div class="t-flex-none">
        <button class="t-btn t-btn-ghost t-btn-circle headway"></button>
        <div class="t-dropdown t-dropdown-end">
          <div tabindex="0" role="button" class="t-btn t-btn-ghost t-btn-circle lang-button">
            {{ locale }}
          </div>
          <ul
            tabindex="0"
            class="t-menu t-menu-lg t-dropdown-content t-bg-base-100 t-rounded-box t-z-[2] t-mt-3 t-w-44 t-p-2 t-shadow"
          >
            <li v-for="(lang, i) in lang" :key="i" @click="locale = lang.abbr">
              <button>{{ lang.name }}</button>
            </li>
          </ul>
        </div>
        <div class="t-dropdown t-dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="t-btn t-btn-ghost t-btn-circle t-avatar"
            :aria-label="$t('app.account-menu')"
          >
            <div class="t-w-6 t-rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="t-size-6"
                v-if="!userIsAuthenticated"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="t-size-6"
                v-if="userIsAuthenticated && !userPhotoUrl"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <img
                v-if="userIsAuthenticated && userPhotoUrl"
                :src="userPhotoUrl"
                :alt="$t('app.profile-picture')"
              />
            </div>
          </div>
          <ul
            tabindex="0"
            class="t-menu t-menu-lg t-dropdown-content t-bg-base-100 t-rounded-box t-z-[2] t-mt-3 t-w-60 t-p-2 t-shadow"
          >
            <li v-if="!userIsAuthenticated">
              <button @click="signInGoogle" class="t-text-base-content">
                {{ $t('app.signin-google') }}
              </button>
            </li>
            <li v-if="!userIsAuthenticated">
              <router-link to="/email-auth" class="t-no-underline t-text-base-content">
                {{ $t('email-auth.title') }}
              </router-link>
            </li>
            <li v-if="userIsAuthenticated">
              <router-link to="/settings" class="t-no-underline t-text-base-content">
                {{ user.name || user.email }}
              </router-link>
            </li>
            <li>
              <router-link to="/settings" class="t-no-underline t-text-base-content">{{
                $t('settings.title')
              }}</router-link>
            </li>
            <li v-if="userIsAuthenticated">
              <button @click="signOut" class="t-text-base-content">
                {{ $t('app.signout') }}
              </button>
            </li>
            <li>
              <router-link to="/help" class="t-no-underline t-text-base-content">{{
                $t('app.help')
              }}</router-link>
            </li>
            <li>
              <router-link to="/about" class="t-no-underline t-text-base-content">{{
                $t('about.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/disclaimer" class="t-no-underline t-text-base-content">{{
                $t('disclaimer.title')
              }}</router-link>
            </li>
            <li>
              <router-link to="/privacy-policy" class="t-no-underline t-text-base-content">{{
                $t('privacy-policy.title')
              }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <v-main class="mx-sm-2">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-snackbar location="bottom" color="warning" v-model="offlineInfo">
      {{ $t('app.offline') }}
      <template v-slot:action="{ attrs }">
        <v-btn variant="text" v-bind="attrs" @click="offlineInfo = false">
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
/* global Headway */
import { useStore } from './stores/index'
import { useTheme } from 'vuetify'
import {
  mdiGoogle,
  mdiMagnify,
  mdiCalculator,
  mdiCalculatorVariant,
  mdiFoodApple,
  mdiTextBox,
  mdiBook,
  mdiCupWater,
  mdiCog,
  mdiInformation,
  mdiAccountCircle,
  mdiAccount,
  mdiLogoutVariant,
  mdiHelpCircleOutline,
  mdiPlusCircle,
  mdiHelpCircle,
  mdiChartBox,
  mdiHomeSearch,
  mdiBarcodeScan,
  mdiEmail,
  mdiDownload,
  mdiClipboardTextOutline,
  mdiInformationVariant,
  mdiListBoxOutline
} from '@mdi/js'

export default {
  data: () => ({
    mdiGoogle,
    mdiMagnify,
    mdiCalculator,
    mdiCalculatorVariant,
    mdiFoodApple,
    mdiTextBox,
    mdiBook,
    mdiCupWater,
    mdiCog,
    mdiInformation,
    mdiAccountCircle,
    mdiAccount,
    mdiLogoutVariant,
    mdiHelpCircleOutline,
    mdiPlusCircle,
    mdiHelpCircle,
    mdiChartBox,
    mdiHomeSearch,
    mdiBarcodeScan,
    mdiEmail,
    mdiDownload,
    mdiClipboardTextOutline,
    mdiInformationVariant,
    mdiListBoxOutline,
    drawer: null,
    lang: [
      { name: 'Deutsch', abbr: 'de' },
      { name: 'English', abbr: 'en' },
      { name: 'Español', abbr: 'es' },
      { name: 'Français', abbr: 'fr' }
    ],
    bottomNav: null,
    offlineInfo: false
  }),
  setup() {
    const theme = useTheme()
    const handleSystemThemeChange = (e) => {
      theme.global.name.value = e.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme.global.name.value)
    }
    function initializeTheme() {
      let storedTheme = localStorage.getItem('vuetifyCurrentTheme')
      if (!storedTheme || storedTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        storedTheme = prefersDark ? 'dark' : 'light'
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', handleSystemThemeChange)
      }
      theme.global.name.value = storedTheme
      document.documentElement.setAttribute('data-theme', theme.global.name.value)

      // Remove old local storage item
      if (localStorage.vuetifyThemeDark) {
        localStorage.removeItem('vuetifyThemeDark')
      }
      if (localStorage.vuetifyThemeFromDevice) {
        localStorage.removeItem('vuetifyThemeFromDevice')
      }
    }
    return {
      initializeTheme
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
    signOut() {
      const store = useStore()
      store.signOut()
    }
  },
  beforeCreate() {
    document.getElementsByTagName('html')[0].lang = this.$i18n.locale
  },
  mounted() {
    this.initializeTheme()
    const store = useStore()
    store.checkAuthState()

    // Script gets loaded in index.html
    if (typeof Headway !== 'undefined') {
      const config = {
        selector: '.headway',
        account: 'JVmwL7'
      }
      Headway.init(config)
    }
  },
  computed: {
    locale: {
      get: function () {
        return this.$i18n.locale
      },
      set: function (newLocale) {
        localStorage.i18nCurrentLocale = JSON.stringify(newLocale)
        this.$i18n.locale = newLocale
        this.$vuetify.locale.current = newLocale
        document.getElementsByTagName('html')[0].lang = newLocale
      }
    },
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    userPhotoUrl() {
      const store = useStore()
      return store.user ? store.user.photoUrl : null
    },
    user() {
      const store = useStore()
      return store.user
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application {
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
}

.v-app-bar {
  padding-left: env(safe-area-inset-left) !important;
  padding-top: env(safe-area-inset-top) !important;
  padding-right: env(safe-area-inset-right) !important;
}

.v-navigation-drawer {
  padding-left: env(safe-area-inset-left) !important;
  padding-top: env(safe-area-inset-top) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
}

.v-bottom-navigation {
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;

  height: auto !important;

  .v-btn {
    padding: 15px !important;
  }
}

.v-theme--dark.v-navigation-drawer {
  background-color: #121212 !important;
}

.v-item-group.v-bottom-navigation {
  box-shadow: none;
  background-color: #f5f5f5;

  .v-btn {
    min-width: 60px;
  }

  @media (max-height: 565px) {
    display: none;
  }
}

.app-logo {
  display: flex;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87);
  align-items: center;
}

.v-theme--light .v-bottom-navigation {
  background-color: #f5f5f5;
}

.v-theme--dark {
  &.v-navigation-drawer,
  &.v-bottom-navigation {
    background-color: #272727;
  }

  .app-logo {
    color: #fff;
  }
}

.v-btn {
  text-transform: none;
}

.lang-button {
  text-transform: uppercase;
}

.v-list--dense .v-list-item .v-list-item__title {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.v-theme--light .custom-app-bar {
  background: linear-gradient(90deg, rgba(41, 128, 185, 1) 0%, rgba(52, 152, 219, 1) 100%);
}

.v-theme--dark .custom-app-bar {
  background: linear-gradient(90deg, rgba(41, 128, 185, 1) 0%, rgba(52, 73, 94, 1) 100%);
}

.account-menu {
  min-width: 200px;
}
</style>
