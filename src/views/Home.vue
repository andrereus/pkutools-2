<template>
  <div>
    <PheLog v-if="userIsAuthenticated" />

    <div v-if="!userIsAuthenticated">
      <div class="t-py-12 sm:t-py-16">
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
              <div v-for="feature in features" :key="feature.name" class="t-relative t-pl-16">
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
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div class="t-py-6 sm:t-py-8">
        <div class="t-mx-auto t-max-w-7xl t-px-6 lg:t-px-8">
          <div class="t-mx-auto t-max-w-4xl t-text-center">
            <p
              class="t-mt-2 t-text-xl t-font-bold t-tracking-tight t-text-gray-900 dark:t-text-white sm:t-text-2xl"
            >
              {{ $t('plans.title') }}
            </p>
          </div>
          <div
            class="t-flex t-flex-col t-items-center t-mt-10 t-gap-8 lg:t-flex-row lg:t-justify-center"
          >
            <div
              v-for="tier in plans"
              :key="tier.id"
              class="t-bg-white dark:t-bg-gray-900 t-ring-1 t-ring-gray-200 t-rounded-3xl t-p-8 xl:t-p-10 t-w-full t-max-w-sm"
            >
              <p class="t-flex t-items-baseline t-gap-x-1">
                <span
                  class="t-text-2xl t-font-bold t-tracking-tight t-text-gray-900 dark:t-text-white"
                  >{{ $t(tier.price) }}</span
                >
              </p>
              <ul
                role="list"
                class="t-mt-8 t-space-y-3 t-text-sm t-leading-6 t-text-gray-600 dark:t-text-gray-300 xl:t-mt-10"
              >
                <li v-for="feature in tier.features" :key="feature" class="t-flex t-gap-x-3">
                  <Check class="t-h-6 t-w-5 t-flex-none t-text-sky-500" aria-hidden="true" />
                  {{ $t(feature) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="t-px-6 t-py-12 sm:t-px-6 sm:t-py-16 lg:t-px-8">
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
            <div class="t-mt-10 t-flex t-items-center t-justify-center t-gap-x-4">
              <a
                @click.prevent="signInGoogle"
                class="t-rounded-md t-bg-sky-500 t-px-3.5 t-py-2.5 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-600 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500 t-cursor-pointer"
              >
                {{ $t('app.signin-google') }}
              </a>
              <RouterLink
                to="/email-auth"
                class="t-rounded-md t-bg-sky-500 t-px-3.5 t-py-2.5 t-text-sm t-font-semibold t-text-white t-shadow-sm hover:t-bg-sky-600 focus-visible:t-outline focus-visible:t-outline-2 focus-visible:t-outline-offset-2 focus-visible:t-outline-sky-500"
              >
                {{ $t('email-auth.title') }}
              </RouterLink>
            </div>
            <div class="t-mt-10 t-flex t-items-center t-justify-center t-gap-x-4">
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
                class="t-text-sm t-font-semibold t-leading-6 t-text-gray-900 dark:t-text-white t-block"
              >
                {{ $t('app.install') }} <span aria-hidden="true">→</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import PheLog from '../components/PheLog.vue'

import {
  Search,
  Calculator,
  ScanBarcode,
  Apple,
  Book,
  FileDown,
  Download,
  Frame,
  Check
} from 'lucide-vue-next'

export default {
  components: {
    PheLog,
    Search,
    Calculator,
    ScanBarcode,
    Apple,
    Book,
    FileDown,
    Download,
    Frame,
    Check
  },
  data: () => ({
    features: [
      {
        name: 'features.search-name',
        description: 'features.search-description',
        icon: Search
      },
      {
        name: 'features.scanner-name',
        description: 'features.scanner-description',
        icon: ScanBarcode
      },
      {
        name: 'features.calculator-name',
        description: 'features.calculator-description',
        icon: Calculator
      },
      {
        name: 'features.diary-name',
        description: 'features.diary-description',
        icon: Book
      },
      {
        name: 'features.own-food-name',
        description: 'features.own-food-description',
        icon: Apple
      },
      {
        name: 'features.export-name',
        description: 'features.export-description',
        icon: FileDown
      },
      {
        name: 'features.install-name',
        description: 'features.install-description',
        icon: Download
      },
      {
        name: 'features.design-name',
        description: 'features.design-description',
        icon: Frame
      }
    ],
    plans: [
      {
        price: 'plans.tier-1-price',
        features: ['plans.tier-1-feature-1', 'plans.tier-1-feature-2', 'plans.tier-1-feature-3']
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
