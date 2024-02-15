<template>
  <v-app>
    <v-app-bar flat theme="dark" class="custom-app-bar">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" :aria-label="$t('app.main-menu')" />
      </template>

      <v-app-bar-title>
        <router-link to="/" class="app-logo">
          <img src="./assets/pkutools-logo.png" alt="PKU Tools Logo" width="25" class="mr-4" />
          <span v-if="$vuetify.display.lgAndUp">PKU Tools</span>
        </router-link>
      </v-app-bar-title>

      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="lang-button">{{ locale }}</v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(lang, i) in lang" :key="i" @click="locale = lang.abbr">
              <v-list-item-title>{{ lang.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" :aria-label="$t('app.account-menu')">
              <v-avatar size="32">
                <v-icon v-if="!userIsAuthenticated">{{ mdiAccountCircle }}</v-icon>
                <v-icon v-if="userIsAuthenticated && !userPhotoUrl">{{ mdiAccount }}</v-icon>
                <img
                  v-if="userIsAuthenticated && userPhotoUrl"
                  :src="userPhotoUrl"
                  :alt="$t('app.profile-picture')"
                />
              </v-avatar>
            </v-btn>
          </template>

          <v-list class="account-menu">
            <v-list-item v-if="!userIsAuthenticated" @click="signInGoogle">
              <span>
                <v-icon>{{ mdiGoogle }}</v-icon>
                {{ $t('app.signin-google') }}
              </span>
            </v-list-item>

            <v-list-item v-if="!userIsAuthenticated" @click="signInFacebook">
              <span>
                <v-icon>{{ mdiFacebook }}</v-icon>
                {{ $t('app.signin-facebook') }}
              </span>
            </v-list-item>

            <v-list-item v-if="!userIsAuthenticated" to="/email-auth">
              <span>
                <v-icon>{{ mdiEmail }}</v-icon>
                {{ $t('email-auth.title') }}
              </span>
            </v-list-item>

            <v-list-item v-if="userIsAuthenticated" to="/settings">
              <span>
                <v-icon>{{ mdiAccount }}</v-icon>
                {{ user.name || user.email }}
              </span>
            </v-list-item>

            <v-list-item v-if="userIsAuthenticated" @click="signOut">
              <span>
                <v-icon>{{ mdiLogoutVariant }}</v-icon>
                {{ $t('app.signout') }}
              </span>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item to="/help">
              <span>
                <v-icon>{{ mdiDownload }}</v-icon>
                {{ $t('app.install') }}
              </span>
            </v-list-item>

            <v-list-item @click="updateDesign">
              <span>
                <v-icon v-if="!$vuetify.theme.current.dark">{{ mdiBrightness4 }}</v-icon>
                <v-icon v-if="$vuetify.theme.current.dark">{{ mdiBrightness7 }}</v-icon>
                &nbsp;
                <span v-if="!$vuetify.theme.current.dark">{{ $t('app.dark') }}</span>
                <span v-if="$vuetify.theme.current.dark">{{ $t('app.light') }}</span>
              </span>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" floating>
      <v-list>
        <v-list-item rounded="lg" to="/">
          <template v-slot:prepend>
            <v-icon>{{ mdiHomeSearch }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('home.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" to="/phe-calculator">
          <template v-slot:prepend>
            <v-icon>{{ mdiCalculator }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('phe-calculator.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" to="/protein-calculator">
          <template v-slot:prepend>
            <v-icon>{{ mdiCalculatorVariant }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('protein-calculator.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" to="/barcode-scanner">
          <template v-slot:prepend>
            <v-icon>{{ mdiBarcodeScan }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('barcode-scanner.title') }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item rounded="lg" to="/own-food">
          <template v-slot:prepend>
            <v-icon>{{ mdiFoodApple }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('own-food.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" to="/phe-diary">
          <template v-slot:prepend>
            <v-icon>{{ mdiBook }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('phe-diary.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" to="/settings">
          <template v-slot:prepend>
            <v-icon>{{ mdiCog }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('settings.title') }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item rounded="lg" density="compact" to="/help">
          <template v-slot:prepend>
            <v-icon>{{ mdiHelpCircleOutline }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('app.help') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" density="compact" to="/about">
          <template v-slot:prepend>
            <v-icon>{{ mdiInformationVariant }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('about.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" density="compact" to="/disclaimer">
          <template v-slot:prepend>
            <v-icon>{{ mdiInformationVariant }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('disclaimer.title') }}</v-list-item-title>
        </v-list-item>

        <v-list-item rounded="lg" density="compact" to="/privacy-policy">
          <template v-slot:prepend>
            <v-icon>{{ mdiInformationVariant }}</v-icon>
          </template>

          <v-list-item-title>{{ $t('privacy-policy.title') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="mx-sm-2">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <ReloadPrompt />

    <v-bottom-navigation grow v-model="bottomNav" class="d-lg-none">
      <v-btn to="/" value="home" :aria-label="$t('home.title')">
        <v-icon>{{ mdiHomeSearch }}</v-icon>
      </v-btn>

      <v-btn to="/phe-diary" value="phe-diary" :aria-label="$t('phe-diary.title')">
        <v-icon>{{ mdiBook }}</v-icon>
      </v-btn>

      <v-btn to="/settings" value="settings" :aria-label="$t('settings.title')">
        <v-icon>{{ mdiCog }}</v-icon>
      </v-btn>
    </v-bottom-navigation>

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
import { useStore } from './stores/index'
import { useTheme } from 'vuetify'
import ReloadPrompt from './components/ReloadPrompt.vue'
import {
  mdiGoogle,
  mdiFacebook,
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
  mdiBrightness4,
  mdiBrightness7,
  mdiPlusCircle,
  mdiHelpCircle,
  mdiChartBox,
  mdiHomeSearch,
  mdiBarcodeScan,
  mdiEmail,
  mdiDownload,
  mdiClipboardTextOutline,
  mdiInformationVariant
} from '@mdi/js'

export default {
  components: {
    ReloadPrompt
  },
  data: () => ({
    mdiGoogle,
    mdiFacebook,
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
    mdiBrightness4,
    mdiBrightness7,
    mdiPlusCircle,
    mdiHelpCircle,
    mdiChartBox,
    mdiHomeSearch,
    mdiBarcodeScan,
    mdiEmail,
    mdiDownload,
    mdiClipboardTextOutline,
    mdiInformationVariant,
    drawer: null,
    lang: [
      { name: 'Deutsch', abbr: 'de' },
      { name: 'English', abbr: 'en' },
      { name: 'Español', abbr: 'es' },
      { name: 'Français', abbr: 'fr' }
    ],
    bottomNav: null,
    offlineInfo: false,
    useThemeFromDevice: true
  }),
  setup() {
    const theme = useTheme()
    const handleSystemThemeChange = (e) => {
      theme.global.name.value = e.matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme.global.name.value)
    }
    function toggleTheme() {
      this.useThemeFromDevice = false
      localStorage.vuetifyThemeFromDevice = JSON.stringify(this.useThemeFromDevice)
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleSystemThemeChange)
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', theme.global.name.value)
      localStorage.vuetifyCurrentTheme = JSON.stringify(theme.global.name.value)
    }
    function mountTheme() {
      if (localStorage.vuetifyThemeFromDevice) {
        this.useThemeFromDevice = JSON.parse(localStorage.vuetifyThemeFromDevice)
      } else {
        localStorage.vuetifyThemeFromDevice = JSON.stringify(this.useThemeFromDevice)
      }

      // Remove old local storage item
      if (localStorage.vuetifyThemeDark) {
        localStorage.removeItem('vuetifyThemeDark')
      }

      if (localStorage.vuetifyCurrentTheme && this.useThemeFromDevice !== true) {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', handleSystemThemeChange)
        theme.global.name.value = JSON.parse(localStorage.vuetifyCurrentTheme)
        document.documentElement.setAttribute('data-theme', theme.global.name.value)
      } else {
        theme.global.name.value = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        document.documentElement.setAttribute('data-theme', theme.global.name.value)
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', handleSystemThemeChange)
      }
    }
    return {
      toggleTheme,
      mountTheme
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
    signOut() {
      const store = useStore()
      store.signOut()
    },
    updateDesign() {
      this.toggleTheme()
    }
  },
  beforeCreate() {
    document.getElementsByTagName('html')[0].lang = this.$i18n.locale
  },
  mounted() {
    this.mountTheme()
    const store = useStore()
    store.checkAuthState()
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

.v-main {
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
}

.v-bottom-navigation {
  padding-left: env(safe-area-inset-left) !important;
  padding-right: env(safe-area-inset-right) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
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
