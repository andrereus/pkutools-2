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
        <v-btn icon class="headway"></v-btn>

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

        <v-list-item
          rounded="lg"
          density="compact"
          href="https://headwayapp.co/pku-tools-changelog"
        >
          <template v-slot:prepend>
            <v-icon>{{ mdiListBoxOutline }}</v-icon>
          </template>

          <v-list-item-title>Changelog</v-list-item-title>
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
