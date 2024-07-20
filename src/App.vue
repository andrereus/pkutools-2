<template>
  <v-app>
    <div as="nav" class="t-bg-white t-shadow">
      <div class="t-mx-auto t-max-w-7xl t-px-2 sm:t-px-6 lg:t-px-8">
        <div class="t-relative t-flex t-h-16 t-justify-between">
          <div class="t-relative t-inset-y-0 t-left-0 t-flex t-items-center">
            <Menu as="div" class="t-relative">
              <div>
                <MenuButton
                  class="t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-400 hover:t-text-gray-500 focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">Open user menu</span>
                  <Bars3Icon class="t-h-6 t-w-6" aria-hidden="true" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="t-transition t-ease-out t-duration-200"
                enter-from-class="t-transform t-opacity-0 t-scale-95"
                enter-to-class="t-transform t-opacity-100 t-scale-100"
                leave-active-class="t-transition t-ease-in t-duration-75"
                leave-from-class="t-transform t-opacity-100 t-scale-100"
                leave-to-class="t-transform t-opacity-0 t-scale-95"
              >
                <MenuItems
                  class="t-absolute t-left-0 t-z-10 t-mt-2 t-w-48 t-origin-top-left t-rounded-md t-bg-white t-py-1 t-shadow-lg t-ring-1 t-ring-black t-ring-opacity-5 focus:t-outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Your Profile</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Settings</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Sign out</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <div class="t-flex t-flex-1 t-items-stretch t-justify-start t-ml-3">
            <div class="t-flex t-flex-shrink-0 t-items-center">
              <img
                class="t-h-8 t-w-auto t-mr-3"
                src="./assets/pkutools-logo.png"
                alt="PKU Tools Logo"
              />
              PKU Tools
            </div>
          </div>
          <div
            class="t-absolute t-inset-y-0 t-right-0 t-flex t-items-center t-pr-2 sm:t-static sm:t-inset-auto sm:t-ml-6 sm:t-pr-0"
          >
            <Menu as="div" class="t-relative t-ml-3">
              <div>
                <MenuButton
                  class="t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-400 hover:t-text-gray-500 focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">Open user menu</span>
                  <LanguageIcon class="t-h-6 t-w-6" aria-hidden="true" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="t-transition t-ease-out t-duration-200"
                enter-from-class="t-transform t-opacity-0 t-scale-95"
                enter-to-class="t-transform t-opacity-100 t-scale-100"
                leave-active-class="t-transition t-ease-in t-duration-75"
                leave-from-class="t-transform t-opacity-100 t-scale-100"
                leave-to-class="t-transform t-opacity-0 t-scale-95"
              >
                <MenuItems
                  class="t-absolute t-right-0 t-z-10 t-mt-2 t-w-48 t-origin-top-right t-rounded-md t-bg-white t-py-1 t-shadow-lg t-ring-1 t-ring-black t-ring-opacity-5 focus:t-outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Your Profile</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Settings</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Sign out</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>

            <Menu as="div" class="t-relative t-ml-3">
              <div>
                <MenuButton
                  class="t-relative t-flex t-rounded-full t-bg-white t-text-sm focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">Open user menu</span>
                  <img
                    class="t-h-8 t-w-8 t-rounded-full"
                    src="./assets/pkutools-logo.png"
                    alt="PKU Tools Logo"
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="t-transition t-ease-out t-duration-200"
                enter-from-class="t-transform t-opacity-0 t-scale-95"
                enter-to-class="t-transform t-opacity-100 t-scale-100"
                leave-active-class="t-transition t-ease-in t-duration-75"
                leave-from-class="t-transform t-opacity-100 t-scale-100"
                leave-to-class="t-transform t-opacity-0 t-scale-95"
              >
                <MenuItems
                  class="t-absolute t-right-0 t-z-10 t-mt-2 t-w-48 t-origin-top-right t-rounded-md t-bg-white t-py-1 t-shadow-lg t-ring-1 t-ring-black t-ring-opacity-5 focus:t-outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Your Profile</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Settings</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 't-bg-gray-100' : '',
                        't-block t-px-4 t-py-2 t-text-sm t-text-gray-700'
                      ]"
                      >Sign out</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
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

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, LanguageIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Bars3Icon,
    LanguageIcon
  },
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
