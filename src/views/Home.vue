<template>
  <div>
    <PheLog v-if="userIsAuthenticated" />

    <p v-if="userIsAuthenticated">{{ $t('app.redesign') }}</p>

    <div v-if="!userIsAuthenticated">
      <div class="t-pt-3 t-pb-6 sm:t-py-8">
        <div class="t-mx-auto t-max-w-7xl t-px-6 lg:t-px-8">
          <div class="t-mx-auto t-max-w-2xl lg:t-text-center">
            <p
              class="t-mt-2 t-text-xl t-font-bold t-tracking-tight t-text-gray-900 dark:t-text-white sm:t-text-2xl"
            >
              {{ $t('app.description') }}
            </p>
            <p class="t-mt-6 t-text-lg t-leading-8 t-text-gray-600 dark:t-text-gray-300">
              {{ $t('app.long-description') }}
            </p>
          </div>
          <div class="t-mx-auto t-mt-16 t-max-w-2xl sm:t-mt-20 lg:t-mt-24 lg:t-max-w-4xl">
            <dl
              class="t-grid t-max-w-xl t-grid-cols-1 t-gap-x-8 t-gap-y-10 lg:t-max-w-none lg:t-grid-cols-2 lg:t-gap-y-16"
            >
              <RouterLink
                v-for="feature in features"
                :key="feature.name"
                :to="feature.route"
                class="t-relative t-pl-16"
              >
                <dt
                  class="t-text-base t-font-semibold t-leading-7 t-text-gray-900 dark:t-text-white"
                >
                  <div
                    class="t-absolute t-left-0 t-top-0 t-flex t-h-10 t-w-10 t-items-center t-justify-center t-rounded-lg t-bg-sky-500"
                  >
                    <component
                      :is="feature.icon"
                      class="t-h-6 t-w-6 t-text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {{ $t(feature.name) }}
                </dt>
                <dd class="t-mt-2 t-text-base t-leading-7 t-text-gray-600 dark:t-text-gray-300">
                  {{ $t(feature.description) }}
                </dd>
              </RouterLink>
            </dl>
          </div>
        </div>
      </div>

      <div class="t-py-24 sm:t-py-32 t-px-6 sm:t-px-6 lg:t-px-8">
        <div class="t-mx-auto t-max-w-2xl t-text-center">
          <h2
            class="t-text-xl t-font-bold t-tracking-tight t-text-gray-900 dark:t-text-white sm:t-text-2xl"
          >
            {{ $t('home.signin-install') }}
          </h2>
          <p
            class="t-mx-auto t-mt-6 t-max-w-xl t-text-lg t-leading-8 t-text-gray-600 dark:t-text-gray-300"
          >
            {{ $t('home.suggestion') }}
          </p>
          <div
            class="t-mt-8 t-flex t-flex-col t-items-center t-gap-4 sm:t-flex-row sm:t-justify-center"
          >
            <a
              @click.prevent="signInGoogle"
              class="t-rounded t-bg-sky-500 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-600 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500 t-cursor-pointer"
            >
              {{ $t('app.signin-google') }}
            </a>
            <RouterLink
              to="/email-auth"
              class="t-rounded t-bg-sky-500 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-600 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500"
            >
              {{ $t('email-auth.title') }}
            </RouterLink>
          </div>
          <div
            class="t-mt-6 t-flex t-flex-col t-items-center t-gap-4 sm:t-flex-row sm:t-justify-center"
          >
            <a
              href="https://play.google.com/store/apps/details?id=com.pkutools.twa"
              target="_blank"
            >
              <img
                alt="Get it on Google Play"
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                class="t-inline-block t-w-28 t-align-middle"
              />
            </a>
            <RouterLink
              to="/help"
              class="t-rounded t-bg-black/5 dark:t-bg-white/15 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-gray-300 t-shadow-sm hover:t-bg-black/10 dark:hover:t-bg-white/10"
            >
              {{ $t('app.install') }} <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import PheLog from '../components/PheLog.vue'

import { Search, Calculator, ScanBarcode, Apple, Book, FileDown } from 'lucide-vue-next'

export default {
  components: {
    PheLog,
    Search,
    Calculator,
    ScanBarcode,
    Apple,
    Book,
    FileDown
  },
  data: () => ({
    features: [
      {
        name: 'features.search-name',
        description: 'features.search-description',
        icon: Search,
        route: '/phe-search'
      },
      {
        name: 'features.scanner-name',
        description: 'features.scanner-description',
        icon: ScanBarcode,
        route: '/barcode-scanner'
      },
      {
        name: 'features.calculator-name',
        description: 'features.calculator-description',
        icon: Calculator,
        route: '/phe-calculator'
      },
      {
        name: 'features.diary-name',
        description: 'features.diary-description',
        icon: Book,
        route: '/phe-diary'
      },
      {
        name: 'features.own-food-name',
        description: 'features.own-food-description',
        icon: Apple,
        route: '/own-food'
      },
      {
        name: 'features.export-name',
        description: 'features.export-description',
        icon: FileDown,
        route: '/settings'
      }
    ]
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
    }
  },
  computed: {
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    }
  }
}
</script>
