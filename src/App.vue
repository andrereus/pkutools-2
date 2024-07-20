<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="t-relative t-z-50 lg:t-hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="t-transition-opacity t-ease-linear t-duration-300"
          enter-from="t-opacity-0"
          enter-to="t-opacity-100"
          leave="t-transition-opacity t-ease-linear t-duration-300"
          leave-from="t-opacity-100"
          leave-to="t-opacity-0"
        >
          <div class="t-fixed t-inset-0 t-bg-gray-900/80" />
        </TransitionChild>

        <div class="t-fixed t-inset-0 t-flex">
          <TransitionChild
            as="template"
            enter="t-transition t-ease-in-out t-duration-300 t-transform"
            enter-from="-t-translate-x-full"
            enter-to="t-translate-x-0"
            leave="t-transition t-ease-in-out t-duration-300 t-transform"
            leave-from="t-translate-x-0"
            leave-to="-t-translate-x-full"
          >
            <DialogPanel class="t-relative t-mr-16 t-flex t-w-full t-max-w-xs t-flex-1">
              <TransitionChild
                as="template"
                enter="t-ease-in-out t-duration-300"
                enter-from="t-opacity-0"
                enter-to="t-opacity-100"
                leave="t-ease-in-out t-duration-300"
                leave-from="t-opacity-100"
                leave-to="t-opacity-0"
              >
                <div class="t-absolute t-left-full t-top-0 t-flex t-w-16 t-justify-center t-pt-5">
                  <button type="button" class="-t-m-2.5 t-p-2.5" @click="sidebarOpen = false">
                    <span class="t-sr-only">Close sidebar</span>
                    <XMarkIcon class="t-h-6 t-w-6 t-text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="t-flex t-grow t-flex-col t-gap-y-5 t-overflow-y-auto t-bg-white t-px-6 t-pb-4"
              >
                <div class="t-flex t-h-16 t-shrink-0 t-items-center">
                  <img
                    class="t-h-8 t-w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                  />
                </div>
                <nav class="t-flex t-flex-1 t-flex-col">
                  <ul role="list" class="t-flex t-flex-1 t-flex-col t-gap-y-7">
                    <li>
                      <ul role="list" class="-t-mx-2 t-space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a
                            :href="item.href"
                            :class="[
                              item.current
                                ? 't-bg-gray-50 t-text-indigo-600'
                                : 't-text-gray-700 hover:t-bg-gray-50 hover:t-text-indigo-600',
                              't-group t-flex t-gap-x-3 t-rounded-md t-p-2 t-text-sm t-font-semibold t-leading-6'
                            ]"
                          >
                            <component
                              :is="item.icon"
                              :class="[
                                item.current
                                  ? 't-text-indigo-600'
                                  : 't-text-gray-400 group-hover:t-text-indigo-600',
                                't-h-6 t-w-6 t-shrink-0'
                              ]"
                              aria-hidden="true"
                            />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="t-text-xs t-font-semibold t-leading-6 t-text-gray-400">
                        Your teams
                      </div>
                      <ul role="list" class="-t-mx-2 t-mt-2 t-space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a
                            :href="team.href"
                            :class="[
                              team.current
                                ? 't-bg-gray-50 t-text-indigo-600'
                                : 't-text-gray-700 hover:t-bg-gray-50 hover:t-text-indigo-600',
                              't-group t-flex t-gap-x-3 t-rounded-md t-p-2 t-text-sm t-font-semibold t-leading-6'
                            ]"
                          >
                            <span
                              :class="[
                                team.current
                                  ? 't-border-indigo-600 t-text-indigo-600'
                                  : 't-border-gray-200 t-text-gray-400 group-hover:t-border-indigo-600 group-hover:t-text-indigo-600',
                                't-flex t-h-6 t-w-6 t-shrink-0 t-items-center t-justify-center t-rounded-lg t-border t-bg-white t-text-[0.625rem] t-font-medium'
                              ]"
                              >{{ team.initial }}</span
                            >
                            <span class="t-truncate">{{ team.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="t-mt-auto">
                      <a
                        href="#"
                        class="t-group -t-mx-2 t-flex t-gap-x-3 t-rounded-md t-p-2 t-text-sm t-font-semibold t-leading-6 t-text-gray-700 hover:t-bg-gray-50 hover:t-text-indigo-600"
                      >
                        <Cog6ToothIcon
                          class="t-h-6 t-w-6 t-shrink-0 t-text-gray-400 group-hover:t-text-indigo-600"
                          aria-hidden="true"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="t-hidden lg:t-fixed lg:t-inset-y-0 lg:t-z-50 lg:t-flex lg:t-w-72 lg:t-flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="t-flex t-grow t-flex-col t-gap-y-5 t-overflow-y-auto t-border-r t-border-gray-200 t-bg-white t-px-6 t-pb-4"
      >
        <div class="t-flex t-h-16 t-shrink-0 t-items-center">
          <img
            class="t-h-8 t-w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
        </div>
        <nav class="t-flex t-flex-1 t-flex-col">
          <ul role="list" class="t-flex t-flex-1 t-flex-col t-gap-y-7">
            <li>
              <ul role="list" class="-t-mx-2 t-space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a
                    :href="item.href"
                    :class="[
                      item.current
                        ? 't-bg-gray-50 t-text-indigo-600'
                        : 't-text-gray-700 hover:t-bg-gray-50 hover:t-text-indigo-600',
                      't-group t-flex t-gap-x-3 t-rounded-md t-p-2 t-text-sm t-font-semibold t-leading-6'
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        item.current
                          ? 't-text-indigo-600'
                          : 't-text-gray-400 group-hover:t-text-indigo-600',
                        't-h-6 t-w-6 t-shrink-0'
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="t-text-xs t-font-semibold t-leading-6 t-text-gray-400">Your teams</div>
              <ul role="list" class="-t-mx-2 t-mt-2 t-space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a
                    :href="team.href"
                    :class="[
                      team.current
                        ? 't-bg-gray-50 t-text-indigo-600'
                        : 't-text-gray-700 hover:t-bg-gray-50 hover:t-text-indigo-600',
                      't-group t-flex t-gap-x-3 t-rounded-md t-p-2 t-text-sm t-font-semibold t-leading-6'
                    ]"
                  >
                    <span
                      :class="[
                        team.current
                          ? 't-border-indigo-600 t-text-indigo-600'
                          : 't-border-gray-200 t-text-gray-400 group-hover:t-border-indigo-600 group-hover:t-text-indigo-600',
                        't-flex t-h-6 t-w-6 t-shrink-0 t-items-center t-justify-center t-rounded-lg t-border t-bg-white t-text-[0.625rem] t-font-medium'
                      ]"
                      >{{ team.initial }}</span
                    >
                    <span class="t-truncate">{{ team.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="t-mt-auto">
              <a
                href="#"
                class="t-group -t-mx-2 t-flex t-gap-x-3 t-rounded-md t-p-2 t-text-sm t-font-semibold t-leading-6 t-text-gray-700 hover:t-bg-gray-50 hover:t-text-indigo-600"
              >
                <Cog6ToothIcon
                  class="t-h-6 t-w-6 t-shrink-0 t-text-gray-400 group-hover:t-text-indigo-600"
                  aria-hidden="true"
                />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:t-pl-72">
      <div
        class="t-sticky t-top-0 t-z-40 t-flex t-h-16 t-shrink-0 t-items-center t-gap-x-4 t-border-b t-border-gray-200 t-bg-white t-px-4 t-shadow-sm sm:t-gap-x-6 sm:t-px-6 lg:t-px-8"
      >
        <button
          type="button"
          class="-t-m-2.5 t-p-2.5 t-text-gray-700 lg:t-hidden"
          @click="sidebarOpen = true"
        >
          <span class="t-sr-only">Open sidebar</span>
          <Bars3Icon class="t-h-6 t-w-6" aria-hidden="true" />
        </button>

        <!-- Separator -->
        <div class="t-h-6 t-w-px t-bg-gray-200 lg:t-hidden" aria-hidden="true" />

        <div class="t-flex t-flex-1 t-gap-x-4 t-self-stretch lg:t-gap-x-6">
          <form class="t-relative t-flex t-flex-1" action="#" method="GET">
            <label for="search-field" class="t-sr-only">Search</label>
            <MagnifyingGlassIcon
              class="t-pointer-events-none t-absolute t-inset-y-0 t-left-0 t-h-full t-w-5 t-text-gray-400"
              aria-hidden="true"
            />
            <input
              id="search-field"
              class="t-block t-h-full t-w-full t-border-0 t-py-0 t-pl-8 t-pr-0 t-text-gray-900 t-placeholder:t-text-gray-400 focus:t-ring-0 sm:t-text-sm"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </form>
          <div class="t-flex t-items-center t-gap-x-4 lg:t-gap-x-6">
            <button type="button" class="-t-m-2.5 t-p-2.5 t-text-gray-400 hover:t-text-gray-500">
              <span class="t-sr-only">View notifications</span>
              <BellIcon class="t-h-6 t-w-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div
              class="t-hidden lg:t-block lg:t-h-6 lg:t-w-px lg:t-bg-gray-200"
              aria-hidden="true"
            />

            <!-- Profile dropdown -->
            <Menu as="div" class="t-relative">
              <MenuButton class="-t-m-1.5 t-flex t-items-center t-p-1.5">
                <span class="t-sr-only">Open user menu</span>
                <img
                  class="t-h-8 t-w-8 t-rounded-full t-bg-gray-50"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span class="t-hidden lg:t-flex lg:t-items-center">
                  <span
                    class="t-ml-4 t-text-sm t-font-semibold t-leading-6 t-text-gray-900"
                    aria-hidden="true"
                    >Tom Cook</span
                  >
                  <ChevronDownIcon class="t-ml-2 t-h-5 t-w-5 t-text-gray-400" aria-hidden="true" />
                </span>
              </MenuButton>
              <transition
                enter-active-class="t-transition t-ease-out t-duration-100"
                enter-from-class="t-transform t-opacity-0 t-scale-95"
                enter-to-class="t-transform t-opacity-100 t-scale-100"
                leave-active-class="t-transition t-ease-in t-duration-75"
                leave-from-class="t-transform t-opacity-100 t-scale-100"
                leave-to-class="t-transform t-opacity-0 t-scale-95"
              >
                <MenuItems
                  class="t-absolute t-right-0 t-z-10 t-mt-2.5 t-w-32 t-origin-top-right t-rounded-md t-bg-white t-py-2 t-shadow-lg t-ring-1 t-ring-gray-900/5 focus:t-outline-none"
                >
                  <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <a
                      :href="item.href"
                      :class="[
                        active ? 't-bg-gray-50' : '',
                        't-block t-px-3 t-py-1 t-text-sm t-leading-6 t-text-gray-900'
                      ]"
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="t-py-10">
        <div class="t-px-4 sm:t-px-6 lg:t-px-8">
          <router-view></router-view>
        </div>
      </main>
    </div>
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

/* Tailwind */
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
/* Tailwind */

export default {
  components: {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon
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
    offlineInfo: false,
    sidebarOpen: false,
    navigation: [
      { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
      { name: 'Team', href: '#', icon: UsersIcon, current: false },
      { name: 'Projects', href: '#', icon: FolderIcon, current: false },
      { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
      { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
      { name: 'Reports', href: '#', icon: ChartPieIcon, current: false }
    ],
    teams: [
      { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
      { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
      { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false }
    ],
    userNavigation: [
      { name: 'Your profile', href: '#' },
      { name: 'Sign out', href: '#' }
    ]
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
