<template>
  <div class="t-min-h-full">
    <div as="nav" class="t-bg-white t-shadow dark:t-bg-gray-800">
      <div
        class="t-mx-auto t-max-w-7xl t-px-2 sm:t-px-4 t-divide-y t-divide-gray-200 dark:t-divide-gray-700 lg:t-px-8"
      >
        <div class="t-relative t-flex t-h-16 t-justify-between">
          <div class="t-relative t-inset-y-0 t-left-0 t-flex t-items-center">
            <MenuComponent as="div" class="t-relative">
              <div>
                <MenuButton
                  class="t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-400 hover:t-text-gray-500 focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2 dark:t-bg-gray-800 dark:t-text-gray-400 dark:hover:t-text-white"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">Open user menu</span>
                  <MenuIcon class="t-h-6 t-w-6" aria-hidden="true" />
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
                  class="t-absolute t-left-0 t-z-10 t-mt-4 t-w-64 t-origin-top-left t-rounded-md t-bg-white t-py-1 t-shadow-lg t-ring-1 t-ring-black t-ring-opacity-5 focus:t-outline-none dark:t-bg-gray-800 dark:t-ring-gray-700"
                >
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/')
                          close()
                        }
                      "
                    >
                      <House class="t-inline-block t-mr-2" />{{ $t('home.title') }}
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/phe-search')
                          close()
                        }
                      "
                    >
                      <Search class="t-inline-block t-mr-2" />{{ $t('phe-search.title') }}
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/phe-calculator')
                          close()
                        }
                      "
                    >
                      <Calculator class="t-inline-block t-mr-2" />{{ $t('phe-calculator.title') }}
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/protein-calculator')
                          close()
                        }
                      "
                    >
                      <SquareDivide class="t-inline-block t-mr-2" />{{
                        $t('protein-calculator.title')
                      }}
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/barcode-scanner')
                          close()
                        }
                      "
                    >
                      <ScanBarcode class="t-inline-block t-mr-2" />{{ $t('barcode-scanner.title') }}
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/own-food')
                          close()
                        }
                      "
                    >
                      <Apple class="t-inline-block t-mr-2" />{{ $t('own-food.title') }}
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push('/phe-diary')
                          close()
                        }
                      "
                    >
                      <Book class="t-inline-block t-mr-2" />{{ $t('phe-diary.title') }}
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </MenuComponent>
          </div>

          <div class="t-flex t-flex-1 t-items-stretch t-justify-start t-ml-3">
            <RouterLink to="/" class="t-flex t-flex-shrink-0 t-items-center">
              <img
                class="t-h-8 t-w-auto t-mr-3"
                src="./assets/pkutools-logo.png"
                alt="PKU Tools Logo"
              />
              <span class="dark:t-text-white">PKU Tools</span>
            </RouterLink>
          </div>

          <div
            class="t-absolute t-inset-y-0 t-right-0 t-flex t-items-center t-pr-2 sm:t-static sm:t-inset-auto sm:t-ml-6 sm:t-pr-0"
          >
            <button
              type="button"
              class="headway t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-400 hover:t-text-gray-500 focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2 dark:t-bg-gray-800 dark:t-text-gray-400 dark:hover:t-text-white"
            ></button>

            <MenuComponent as="div" class="t-relative t-ml-3">
              <div>
                <MenuButton
                  class="t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-400 hover:t-text-gray-500 focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2 t-uppercase dark:t-bg-gray-800 dark:t-text-gray-400 dark:hover:t-text-white"
                >
                  {{ locale }}
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
                  class="t-absolute t-right-0 t-z-10 t-mt-4 t-w-40 t-origin-top-right t-rounded-md t-bg-white t-py-1 t-shadow-lg t-ring-1 t-ring-black t-ring-opacity-5 focus:t-outline-none dark:t-bg-gray-800 dark:t-ring-gray-700"
                >
                  <MenuItem v-for="(lang, i) in lang" :key="i" v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          locale = lang.abbr
                          close()
                        }
                      "
                    >
                      {{ lang.name }}
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </MenuComponent>

            <MenuComponent as="div" class="t-relative t-ml-3">
              <div>
                <MenuButton
                  class="t-relative t-flex t-rounded-full t-bg-white t-text-sm focus:t-outline-none focus:t-ring-2 focus:t-ring-indigo-500 focus:t-ring-offset-2 dark:t-bg-gray-800"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">Open user menu</span>
                  <CircleUser
                    v-if="!userIsAuthenticated"
                    class="t-h-6 t-w-6 dark:t-text-gray-300"
                    aria-hidden="true"
                  />
                  <User
                    v-if="userIsAuthenticated && !userPhotoUrl"
                    class="t-h-6 t-w-6 dark:t-text-gray-300"
                    aria-hidden="true"
                  />
                  <img
                    v-if="userIsAuthenticated && userPhotoUrl"
                    class="t-h-8 t-w-8 t-rounded-full"
                    :src="userPhotoUrl"
                    :alt="$t('app.profile-picture')"
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
                  class="t-absolute t-right-0 t-z-10 t-mt-4 t-w-64 t-origin-top-right t-divide-y t-divide-gray-100 t-rounded-md t-bg-white t-shadow-lg t-ring-1 t-ring-black t-ring-opacity-5 focus:t-outline-none dark:t-bg-gray-800 dark:t-ring-gray-700 dark:t-divide-gray-700"
                >
                  <div class="py-1">
                    <MenuItem v-if="!userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            signInGoogle()
                            close()
                          }
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="25"
                          class="t-inline-block t-mr-2"
                        >
                          <path
                            d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                          />
                        </svg>
                        {{ $t('app.signin-google') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="!userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/email-auth')
                            close()
                          }
                        "
                      >
                        <Mail class="t-inline-block t-mr-2" />{{ $t('email-auth.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/settings')
                            close()
                          }
                        "
                      >
                        <User class="t-inline-block t-mr-2" />{{ user.name || user.email }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            signOut()
                            close()
                          }
                        "
                      >
                        <LogOut class="t-inline-block t-mr-2" />{{ $t('app.signout') }}
                      </a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/settings')
                            close()
                          }
                        "
                      >
                        <Settings class="t-inline-block t-mr-2" />{{ $t('settings.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/help')
                            close()
                          }
                        "
                      >
                        <LifeBuoy class="t-inline-block t-mr-2" />{{ $t('help.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/about')
                            close()
                          }
                        "
                      >
                        <Info class="t-inline-block t-mr-2" />{{ $t('about.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/disclaimer')
                            close()
                          }
                        "
                      >
                        <Info class="t-inline-block t-mr-2" />{{ $t('disclaimer.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-block t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/privacy-policy')
                            close()
                          }
                        "
                      >
                        <Info class="t-inline-block t-mr-2" />{{ $t('privacy-policy.title') }}
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </MenuComponent>
          </div>
        </div>
        <nav
          class="t-flex t-justify-center t-space-x-8 t-py-2 lg:t-justify-start lg:t-space-x-2"
          aria-label="Global"
        >
          <RouterLink
            to="/"
            class="t-text-gray-900 hover:t-bg-gray-50 hover:t-text-gray-900 t-inline-flex t-items-center t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300 dark:hover:t-bg-gray-700"
          >
            <Book />
          </RouterLink>
          <RouterLink
            to="/phe-search"
            class="t-text-gray-900 hover:t-bg-gray-50 hover:t-text-gray-900 t-inline-flex t-items-center t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300 dark:hover:t-bg-gray-700"
          >
            <Search />
          </RouterLink>
          <RouterLink
            to="/phe-calculator"
            class="t-text-gray-900 hover:t-bg-gray-50 hover:t-text-gray-900 t-inline-flex t-items-center t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300 dark:hover:t-bg-gray-700"
          >
            <Calculator />
          </RouterLink>
          <RouterLink
            to="/own-food"
            class="t-text-gray-900 hover:t-bg-gray-50 hover:t-text-gray-900 t-inline-flex t-items-center t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300 dark:hover:t-bg-gray-700"
          >
            <Apple />
          </RouterLink>
        </nav>
      </div>
    </div>

    <div class="t-pb-10">
      <main>
        <div class="t-mx-auto t-max-w-7xl t-px-4 t-py-8 sm:t-px-6 lg:t-px-8">
          <RouterView></RouterView>
        </div>
      </main>
    </div>

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

import { Menu as MenuComponent, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  Menu as MenuIcon,
  CircleUser,
  User,
  House,
  Search,
  Calculator,
  SquareDivide,
  ScanBarcode,
  Apple,
  Book,
  Mail,
  LogOut,
  Settings,
  LifeBuoy,
  Info
} from 'lucide-vue-next'

export default {
  components: {
    MenuComponent,
    MenuButton,
    MenuItem,
    MenuItems,
    MenuIcon,
    CircleUser,
    User,
    House,
    Search,
    Calculator,
    SquareDivide,
    ScanBarcode,
    Apple,
    Book,
    Mail,
    LogOut,
    Settings,
    LifeBuoy,
    Info
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
      if (theme.global.name.value === 'dark') {
        document.documentElement.classList.add('t-dark')
      } else {
        document.documentElement.classList.remove('t-dark')
      }
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
      if (theme.global.name.value === 'dark') {
        document.documentElement.classList.add('t-dark')
      } else {
        document.documentElement.classList.remove('t-dark')
      }

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
