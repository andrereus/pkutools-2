<template>
  <div class="t-min-h-full app-container-safe-area">
    <div as="nav" class="t-bg-white t-shadow dark:t-bg-gray-800">
      <div class="t-mx-auto t-max-w-7xl t-px-2 sm:t-px-4 lg:t-px-8">
        <div class="t-relative t-flex t-h-16 t-justify-between">
          <div class="t-relative t-inset-y-0 t-left-0 t-flex t-items-center">
            <MenuComponent as="div" class="t-relative">
              <div>
                <MenuButton
                  class="t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-600 hover:t-text-black focus:t-outline-none focus:t-ring-2 focus:t-ring-sky-500 focus:t-ring-offset-2 dark:t-bg-gray-800 dark:t-text-gray-200 dark:hover:t-text-white"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">{{ $t('app.main-menu') }}</span>
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
                  <MenuItem v-for="item in navigation" :key="item.name" v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                        't-group t-flex t-items-center t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push(item.route)
                          close()
                        }
                      "
                    >
                      <component
                        :is="item.icon"
                        class="t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
                        aria-hidden="true"
                      />{{ $t(item.name) }}
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
              class="headway t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-600 hover:t-text-black focus:t-outline-none focus:t-ring-2 focus:t-ring-sky-500 focus:t-ring-offset-2 dark:t-bg-gray-800 dark:t-text-gray-200 dark:hover:t-text-white"
            ></button>

            <MenuComponent as="div" class="t-relative t-ml-2">
              <div>
                <MenuButton
                  class="t-relative t-rounded-full t-bg-white t-p-1 t-text-gray-600 hover:t-text-black focus:t-outline-none focus:t-ring-2 focus:t-ring-sky-500 focus:t-ring-offset-2 t-uppercase dark:t-bg-gray-800 dark:t-text-gray-200 dark:hover:t-text-white t-mr-2"
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
                  class="t-relative t-flex t-rounded-full t-bg-white t-text-sm focus:t-outline-none focus:t-ring-2 focus:t-ring-sky-500 focus:t-ring-offset-2 dark:t-bg-gray-800"
                >
                  <span class="t-absolute t--inset-1.5" />
                  <span class="t-sr-only">{{ $t('app.account-menu') }}</span>
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
                          't-group t-flex t-items-center t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
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
                          class="t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
                        >
                          <path
                            d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                            fill="currentColor"
                          />
                        </svg>
                        {{ $t('app.signin-google') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="!userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-group t-flex t-items-center t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/email-auth')
                            close()
                          }
                        "
                      >
                        <Mail
                          class="t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
                          aria-hidden="true"
                        />{{ $t('email-auth.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-group t-flex t-items-center t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/settings')
                            close()
                          }
                        "
                      >
                        <User
                          class="t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
                          aria-hidden="true"
                        />{{ user.name || user.email }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-group t-flex t-items-center t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            signOut()
                            close()
                          }
                        "
                      >
                        <LogOut
                          class="t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
                          aria-hidden="true"
                        />{{ $t('app.signout') }}
                      </a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem
                      v-for="item in userNavigation"
                      :key="item.name"
                      v-slot="{ active, close }"
                    >
                      <a
                        :class="[
                          active ? 't-bg-gray-100 dark:t-bg-gray-700' : '',
                          't-group t-flex t-items-center t-px-6 t-py-3 t-text-gray-700 t-cursor-pointer dark:t-text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push(item.route)
                            close()
                          }
                        "
                      >
                        <component
                          :is="item.icon"
                          class="t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
                          aria-hidden="true"
                        />{{ $t(item.name) }}
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </MenuComponent>
          </div>
        </div>
        <div v-if="!userIsAuthenticated" class="t-border-b dark:t-border-gray-700"></div>
        <div
          v-if="userIsAuthenticated"
          class="t-py-3 t-px-3 t-bg-gray-50 dark:t-bg-gray-900 t-rounded-md t-shadow-inner"
        >
          <div class="t-text-xs t-flex t-justify-between t-uppercase">
            <span>{{ pheResult }} Phe {{ $t('app.total') }}</span>
            <span>{{ (settings?.maxPhe || 0) - pheResult }} Phe {{ $t('app.left') }}</span>
          </div>
          <v-progress-linear
            :model-value="(pheResult * 100) / (settings?.maxPhe || 0)"
            height="3"
            class="mt-2"
            color="primary"
            rounded
          ></v-progress-linear>
        </div>
        <nav
          class="t-flex t-py-2 t-justify-around sm:t-justify-center sm:t-space-x-12 lg:t-justify-start lg:t-space-x-4"
          aria-label="Global"
        >
          <RouterLink
            v-for="item in tabNavigation"
            :key="item.name"
            :to="item.route"
            class="t-text-gray-600 hover:t-bg-gray-50 hover:t-text-gray-600 t-group t-inline-flex t-items-center t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300 dark:hover:t-bg-gray-700"
          >
            <component
              :is="item.icon"
              class="md:t-mr-3 t-h-5 t-w-5 t-text-gray-700 group-hover:t-text-gray-500 dark:t-text-gray-300 dark:group-hover:t-text-gray-300"
              aria-hidden="true"
            /><span class="t-hidden lg:t-inline-block">{{ $t(item.name) }}</span>
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
  </div>
</template>

<script>
/* global Headway */
import { useStore } from './stores/index'
import { useTheme } from 'vuetify'

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
    navigation: [
      { name: 'home.title', icon: 'House', route: '/' },
      { name: 'phe-search.title', icon: 'Search', route: '/phe-search' },
      { name: 'barcode-scanner.title', icon: 'ScanBarcode', route: '/barcode-scanner' },
      { name: 'phe-calculator.title', icon: 'Calculator', route: '/phe-calculator' },
      { name: 'protein-calculator.title', icon: 'SquareDivide', route: '/protein-calculator' },
      { name: 'own-food.title', icon: 'Apple', route: '/own-food' },
      { name: 'phe-diary.title', icon: 'Book', route: '/phe-diary' }
    ],
    lang: [
      { name: 'Deutsch', abbr: 'de' },
      { name: 'English', abbr: 'en' },
      { name: 'Español', abbr: 'es' },
      { name: 'Français', abbr: 'fr' }
    ],
    userNavigation: [
      { name: 'settings.title', icon: 'Settings', route: '/settings' },
      { name: 'help.title', icon: 'LifeBuoy', route: '/help' },
      { name: 'about.title', icon: 'Info', route: '/about' },
      { name: 'disclaimer.title', icon: 'Info', route: '/disclaimer' },
      { name: 'privacy-policy.title', icon: 'Info', route: '/privacy-policy' }
    ],
    tabNavigation: [
      { name: 'home.title', icon: 'House', route: '/' },
      { name: 'app.search', icon: 'Search', route: '/phe-search' },
      { name: 'app.scanner', icon: 'ScanBarcode', route: '/barcode-scanner' },
      { name: 'app.calculator', icon: 'Calculator', route: '/phe-calculator' },
      { name: 'own-food.title', icon: 'Apple', route: '/own-food' }
    ]
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
      try {
        await store.signInGoogle()
      } catch (error) {
        alert(this.$t('app.auth-error'))
        console.error(error)
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
    },
    pheLog() {
      const store = useStore()
      return store.pheLog
    },
    settings() {
      const store = useStore()
      return store.settings
    },
    pheResult() {
      let phe = 0
      this.pheLog.forEach((item) => {
        phe += item.phe
      })
      return Math.round(phe)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container-safe-area {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
}
</style>
