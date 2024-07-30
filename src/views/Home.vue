<template>
  <div>
    <PheLog v-if="userIsAuthenticated" />

    <div v-if="!userIsAuthenticated">
      <div class="t-pb-24 sm:t-pb-32 t-pt-6 sm:t-pt-8">
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

      <div>
        <div class="t-px-6 t-pb-12 sm:t-px-6 sm:t-pb-16 lg:t-px-8">
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
            <RouterLink
              to="/help"
              class="t-text-sm t-font-semibold t-leading-6 t-text-gray-900 dark:t-text-white t-block t-mt-8"
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

import {
  Search,
  Calculator,
  ScanBarcode,
  Apple,
  Book,
  FileDown,
  Download,
  Frame
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
    Frame
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
