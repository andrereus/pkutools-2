<template>
  <div>
    <div v-if="pheLog" class="t-block t-mb-6">
      <nav class="t-flex t-space-x-2" aria-label="Tabs">
        <RouterLink
          :to="{ path: '/', query: { log: true } }"
          class="t-bg-black/5 dark:t-bg-white/15 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
          aria-current="page"
        >
          {{ $t('phe-log.tab-title') }}
        </RouterLink>
        <RouterLink
          to="/phe-diary"
          class="t-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
          >{{ $t('phe-diary.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <PheLog v-if="pheLog" />

    <div v-if="!pheLog">
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

      <div class="t-py-12 sm:t-py-16 t-pb-8 sm:t-pb-12 t-px-6 sm:t-px-6 lg:t-px-8">
        <div class="t-mx-auto t-max-w-2xl t-text-center">
          <h2
            class="t-text-xl t-font-bold t-tracking-tight t-text-gray-900 dark:t-text-white sm:t-text-2xl"
          >
            {{ $t('home.about-title') }}
          </h2>
          <p
            class="t-mx-auto t-mt-6 t-max-w-xl t-text-lg t-leading-8 t-text-gray-600 dark:t-text-gray-300"
          >
            {{ $t('home.about-description') }}
          </p>
        </div>
      </div>

      <div class="t-pt-8 sm:t-pt-12 t-pb-24 sm:t-pb-32 t-px-6 sm:t-px-6 lg:t-px-8">
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
            v-if="!userIsAuthenticated"
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

import { Search, Calculator, ScanBarcode, Apple, Book, Sparkles } from 'lucide-vue-next'

export default {
  components: {
    PheLog,
    Search,
    Calculator,
    ScanBarcode,
    Apple,
    Book,
    Sparkles
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
        route: '/?log=true'
      },
      {
        name: 'features.suggestions-name',
        description: 'features.suggestions-description',
        icon: Sparkles,
        route: '/?log=true'
      },
      {
        name: 'features.own-food-name',
        description: 'features.own-food-description',
        icon: Apple,
        route: '/own-food'
      }
    ],
    pheLog: false
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
  watch: {
    userIsAuthenticated(newVal) {
      if (newVal) {
        this.$router.push({ path: '/', query: { log: true } })
      } else {
        this.$router.push({ path: '/', query: { home: true } })
      }
    },
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        if (newQuery.home) {
          this.pheLog = false
        } else if (newQuery.log) {
          this.pheLog = true
        }
      }
    }
  },
  mounted() {
    if (this.userIsAuthenticated && !this.$route.query.home) {
      this.$router.push({ path: '/', query: { log: true } })
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
