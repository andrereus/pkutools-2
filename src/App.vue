<script setup>
/* global Headway */
import { computed, onBeforeMount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from './stores/index'
import { useRoute } from 'vue-router'

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
  Info,
  Calendar,
  ChartLine,
  Bot
} from 'lucide-vue-next'

const store = useStore()
const { t, locale } = useI18n()
const route = useRoute()

// Reactive state
const lang = [
  { name: 'Deutsch', abbr: 'de' },
  { name: 'English', abbr: 'en' },
  { name: 'Español', abbr: 'es' },
  { name: 'Français', abbr: 'fr' }
]

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const userPhotoUrl = computed(() => (store.user ? store.user.photoUrl : null))
const user = computed(() => store.user)
const pheLog = computed(() => store.pheLog)
const settings = computed(() => store.settings)

const navigation = computed(() => {
  return [
    { name: 'app.start', icon: 'House', route: '/?home=true' },
    { name: 'phe-search.title', icon: 'Search', route: '/phe-search' },
    { name: 'barcode-scanner.title', icon: 'ScanBarcode', route: '/barcode-scanner' },
    { name: 'phe-calculator.title', icon: 'Calculator', route: '/phe-calculator' },
    { name: 'protein-calculator.title', icon: 'SquareDivide', route: '/protein-calculator' },
    { name: 'assistant.title', icon: 'Bot', route: '/assistant' },
    { name: 'phe-log.title', icon: 'Book', route: '/?log=true' },
    { name: 'phe-diary.title', icon: 'Calendar', route: '/phe-diary' },
    { name: 'lab-values.title', icon: 'ChartLine', route: '/lab-values' }
  ]
})

const tabNavigation = computed(() => {
  if (userIsAuthenticated.value) {
    return [
      { name: 'home.title', icon: 'House', route: '/?log=true' },
      { name: 'app.search', icon: 'Search', route: '/phe-search' },
      { name: 'app.scanner', icon: 'ScanBarcode', route: '/barcode-scanner' },
      { name: 'app.calculator', icon: 'Calculator', route: '/phe-calculator' },
      { name: 'assistant.title', icon: 'Bot', route: '/assistant' }
    ]
  } else {
    return [
      { name: 'home.title', icon: 'House', route: '/?home=true' },
      { name: 'app.search', icon: 'Search', route: '/phe-search' },
      { name: 'app.scanner', icon: 'ScanBarcode', route: '/barcode-scanner' },
      { name: 'app.calculator', icon: 'Calculator', route: '/phe-calculator' },
      { name: 'assistant.title', icon: 'Bot', route: '/assistant' }
    ]
  }
})

const userNavigation = computed(() => {
  return [
    { name: 'own-food.title', icon: 'Apple', route: '/own-food' },
    { name: 'settings.title', icon: 'Settings', route: '/settings' },
    { name: 'help.title', icon: 'LifeBuoy', route: '/help' },
    { name: 'imprint.title', icon: 'Info', route: '/imprint' },
    { name: 'disclaimer.title', icon: 'Info', route: '/disclaimer' },
    { name: 'privacy-policy.title', icon: 'Info', route: '/privacy-policy' }
  ]
})

const footerNavigation = computed(() => {
  return {
    tools: [
      { name: 'phe-search.title', route: '/phe-search' },
      { name: 'barcode-scanner.title', route: '/barcode-scanner' },
      { name: 'phe-calculator.title', route: '/phe-calculator' },
      { name: 'protein-calculator.title', route: '/protein-calculator' },
      { name: 'assistant.title', route: '/assistant' }
    ],
    features: [
      { name: 'phe-log.title', route: '/?log=true' },
      { name: 'phe-diary.title', route: '/phe-diary' },
      { name: 'lab-values.title', route: '/lab-values' }
    ],
    account: [
      { name: 'email-auth.tab-title', route: '/email-auth' },
      { name: 'own-food.title', route: '/own-food' },
      { name: 'settings.title', route: '/settings' }
    ],
    about: [
      { name: 'app.start', route: '/?home=true' },
      { name: 'help.title', route: '/help' },
      { name: 'imprint.title', route: '/imprint' },
      { name: 'disclaimer.title', route: '/disclaimer' },
      { name: 'privacy-policy.title', route: '/privacy-policy' }
    ]
  }
})

const pheResult = computed(() => {
  let phe = 0
  pheLog.value.forEach((item) => {
    phe += item.phe
  })
  return Math.round(phe)
})

const isTabActive = computed(() => (item) => {
  if (item.route.startsWith('/?') && route.path === '/') {
    return true
  }

  if (
    item.route === '/phe-calculator' &&
    (route.path === '/phe-calculator' || route.path === '/protein-calculator')
  ) {
    return true
  }

  return route.fullPath === item.route
})

// Methods
const signInGoogle = async () => {
  try {
    await store.signInGoogle()
  } catch (error) {
    alert(t('app.auth-error'))
    console.error(error)
  }
}

const signOut = () => {
  store.signOut()
}

const setLocale = (newLocale) => {
  localStorage.i18nCurrentLocale = JSON.stringify(newLocale)
  locale.value = newLocale
  document.getElementsByTagName('html')[0].lang = newLocale
}

// Lifecycle hooks
onBeforeMount(() => {
  document.getElementsByTagName('html')[0].lang = locale.value
})

onMounted(() => {
  store.checkAuthState()

  // Script gets loaded in index.html
  if (typeof Headway !== 'undefined') {
    const config = {
      selector: '.headway',
      account: 'JVmwL7'
    }
    Headway.init(config)
  }

  // Remove old local storage items
  const oldItems = ['vuetifyThemeDark', 'vuetifyThemeFromDevice', 'vuetifyCurrentTheme']
  oldItems.forEach((item) => {
    if (localStorage.getItem(item)) {
      localStorage.removeItem(item)
    }
  })
})

// Add an icon map to reference the actual icon components
const iconMap = {
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
  Info,
  Calendar,
  ChartLine,
  Bot
}
</script>

<template>
  <div class="min-h-screen flex flex-col app-container-safe-area dark:text-white">
    <div as="nav" class="bg-white shadow dark:bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div class="relative flex h-16 justify-between">
          <div class="relative inset-y-0 left-0 flex items-center">
            <MenuComponent as="div" class="relative">
              <div>
                <MenuButton
                  class="relative rounded-full bg-white p-1 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white"
                >
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">{{ $t('app.main-menu') }}</span>
                  <MenuIcon class="h-6 w-6" aria-hidden="true" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute left-0 z-10 mt-4 w-64 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
                >
                  <MenuItem v-for="item in navigation" :key="item.name" v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        route.fullPath === item.route ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'group flex items-center px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          $router.push(item.route)
                          close()
                        }
                      "
                    >
                      <component
                        :is="iconMap[item.icon]"
                        class="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
                        aria-hidden="true"
                      />{{ $t(item.name) }}
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </MenuComponent>
          </div>

          <div class="flex flex-1 items-stretch justify-start ml-3">
            <RouterLink
              :to="userIsAuthenticated ? '/?log=true' : '/?home=true'"
              class="flex flex-shrink-0 items-center"
            >
              <img class="h-8 w-auto mr-3" src="./assets/pkutools-logo.png" alt="PKU Tools Logo" />
              <span class="dark:text-white">PKU Tools</span>
            </RouterLink>
          </div>

          <div
            class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
          >
            <button
              type="button"
              class="headway relative rounded-full bg-white p-1 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white"
            ></button>

            <MenuComponent as="div" class="relative ml-2">
              <div>
                <MenuButton
                  class="relative rounded-full bg-white p-1 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 uppercase dark:bg-gray-800 dark:text-gray-200 dark:hover:text-white mr-2"
                >
                  {{ locale }}
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-4 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
                >
                  <MenuItem v-for="(lang, i) in lang" :key="i" v-slot="{ active, close }">
                    <a
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        locale === lang.abbr ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300'
                      ]"
                      @click.prevent="
                        () => {
                          setLocale(lang.abbr)
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

            <MenuComponent as="div" class="relative ml-3">
              <div>
                <MenuButton
                  class="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-gray-800"
                >
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">{{ $t('app.account-menu') }}</span>
                  <CircleUser
                    v-if="!userIsAuthenticated"
                    class="h-6 w-6 dark:text-gray-300"
                    aria-hidden="true"
                  />
                  <User
                    v-if="userIsAuthenticated && !userPhotoUrl"
                    class="h-6 w-6 dark:text-gray-300"
                    aria-hidden="true"
                  />
                  <img
                    v-if="userIsAuthenticated && userPhotoUrl"
                    class="h-8 w-8 rounded-full sl-exclude"
                    :src="userPhotoUrl"
                    :alt="$t('app.profile-picture')"
                  />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-4 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 dark:divide-gray-700"
                >
                  <div class="py-1">
                    <MenuItem v-if="!userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'group flex items-center px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300'
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
                          class="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
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
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'group flex items-center px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/email-auth')
                            close()
                          }
                        "
                      >
                        <Mail
                          class="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
                          aria-hidden="true"
                        />{{ $t('email-auth.title') }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'group flex items-center px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300 sl-mask'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push('/settings')
                            close()
                          }
                        "
                      >
                        <User
                          class="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
                          aria-hidden="true"
                        />{{ user.name || user.email }}
                      </a>
                    </MenuItem>
                    <MenuItem v-if="userIsAuthenticated" v-slot="{ active, close }">
                      <a
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'group flex items-center px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            signOut()
                            close()
                          }
                        "
                      >
                        <LogOut
                          class="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
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
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          route.path === item.route ? 'bg-gray-100 dark:bg-gray-700' : '',
                          'group flex items-center px-6 py-3 text-gray-700 cursor-pointer dark:text-gray-300'
                        ]"
                        @click.prevent="
                          () => {
                            $router.push(item.route)
                            close()
                          }
                        "
                      >
                        <component
                          :is="iconMap[item.icon]"
                          class="mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
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
        <div class="border-b dark:border-gray-700"></div>
        <nav
          class="flex py-2 justify-around sm:justify-center sm:space-x-12 lg:justify-start lg:space-x-4"
          aria-label="Global"
        >
          <RouterLink
            v-for="item in tabNavigation"
            :key="item.name"
            :to="item.route"
            :class="[
              isTabActive(item)
                ? 'bg-gray-100 dark:bg-gray-700'
                : 'hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-700',
              'group inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300'
            ]"
          >
            <component
              :is="iconMap[item.icon]"
              class="md:mr-3 h-5 w-5 text-gray-700 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-300"
              aria-hidden="true"
            />
            <span class="hidden lg:inline-block">{{ $t(item.name) }}</span>
          </RouterLink>
        </nav>
      </div>
    </div>

    <div class="pb-5 lg:pb-10 flex-grow">
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <RouterView></RouterView>
        </div>
      </main>
    </div>

    <footer class="bg-white dark:bg-gray-800 hidden xl:block">
      <div class="mx-auto max-w-7xl px-6 py-12 sm:py-12 lg:px-8 lg:py-12">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
          <RouterLink
            :to="userIsAuthenticated ? '/?log=true' : '/?home=true'"
            class="hidden lg:block"
          >
            <img class="h-8" src="./assets/pkutools-logo.png" alt="PKU Tools Logo" />
          </RouterLink>
          <div class="lg:mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                  {{ $t('footer.tools') }}
                </h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li v-for="item in footerNavigation.tools" :key="item.name">
                    <RouterLink
                      :to="item.route"
                      class="text-sm/6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >{{ $t(item.name) }}</RouterLink
                    >
                  </li>
                </ul>
              </div>
              <div class="mt-10 md:mt-0">
                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                  {{ $t('footer.logs') }}
                </h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li v-for="item in footerNavigation.features" :key="item.name">
                    <RouterLink
                      :to="item.route"
                      class="text-sm/6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >{{ $t(item.name) }}</RouterLink
                    >
                  </li>
                </ul>
              </div>
            </div>
            <div class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                  {{ $t('footer.account') }}
                </h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li v-for="item in footerNavigation.account" :key="item.name">
                    <RouterLink
                      :to="item.route"
                      class="text-sm/6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >{{ $t(item.name) }}</RouterLink
                    >
                  </li>
                </ul>
              </div>
              <div class="mt-10 md:mt-0">
                <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
                  {{ $t('footer.about') }}
                </h3>
                <ul role="list" class="mt-6 space-y-4">
                  <li v-for="item in footerNavigation.about" :key="item.name">
                    <RouterLink
                      :to="item.route"
                      class="text-sm/6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >{{ $t(item.name) }}</RouterLink
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.app-container-safe-area {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
}
</style>
