<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../stores/index'
import PheLog from '../components/PheLog.vue'
import { Search, Calculator, ScanBarcode, Apple, Book, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useStore()

// Reactive state
const pheLog = ref(false)

// Features data
const features = [
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
]

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)

// Methods
const signInGoogle = async () => {
  try {
    await store.signInGoogle()
  } catch (error) {
    alert(t('app.auth-error'))
    console.error(error)
  }
}

// Watchers
watch(userIsAuthenticated, (newVal) => {
  if (newVal) {
    router.push({ path: '/', query: { log: true } })
  } else {
    router.push({ path: '/', query: { home: true } })
  }
})

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.home) {
      pheLog.value = false
    } else if (newQuery.log) {
      pheLog.value = true
    }
  },
  { immediate: true }
)

// Lifecycle hooks
onMounted(() => {
  if (userIsAuthenticated.value && !route.query.home) {
    router.push({ path: '/', query: { log: true } })
  }
})
</script>

<template>
  <div>
    <div v-if="pheLog" class="block mb-6">
      <nav class="flex space-x-2" aria-label="Tabs">
        <RouterLink
          :to="{ path: '/', query: { log: true } }"
          class="bg-black/5 dark:bg-white/15 text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          aria-current="page"
        >
          {{ $t('phe-log.tab-title') }}
        </RouterLink>
        <RouterLink
          to="/phe-diary"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          >{{ $t('phe-diary.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/lab-values"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          >{{ $t('lab-values.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <PheLog v-if="pheLog" />

    <div v-if="!pheLog">
      <div class="pt-3 pb-6 sm:py-8">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <p
              class="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl"
            >
              {{ $t('app.description') }}
            </p>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {{ $t('app.long-description') }}
            </p>
          </div>
        </div>
        <div class="mt-10 flex justify-center sm:mt-12">
          <div
            class="max-w-4xl w-full rounded-xl bg-gray-900/5 dark:bg-gray-800 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-gray-700 lg:rounded-2xl lg:p-4"
          >
            <video
              src="../assets/demo.mp4"
              autoplay
              loop
              muted
              playsinline
              class="w-full rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-700"
            ></video>
          </div>
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto mt-14 max-w-2xl sm:mt-16 lg:max-w-4xl">
            <dl
              class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
            >
              <RouterLink
                v-for="feature in features"
                :key="feature.name"
                :to="feature.route"
                class="relative pl-16"
              >
                <dt class="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div
                    class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500"
                  >
                    <component :is="feature.icon" class="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {{ $t(feature.name) }}
                </dt>
                <dd class="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {{ $t(feature.description) }}
                </dd>
              </RouterLink>
            </dl>
          </div>
        </div>
      </div>

      <div class="py-12 sm:py-16 pb-8 sm:pb-12 px-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {{ $t('home.about-title') }}
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            {{ $t('home.about-description') }}
          </p>
          <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="https://www.buymeacoffee.com/andrereus" target="_blank">
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                class="w-28"
              />
            </a>
          </div>
        </div>
      </div>

      <div class="pt-8 sm:pt-12 pb-24 sm:pb-32 px-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {{ $t('home.signin-install') }}
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            {{ $t('home.suggestion') }}
          </p>
          <div
            v-if="!userIsAuthenticated"
            class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <a
              @click.prevent="signInGoogle"
              class="rounded bg-sky-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 cursor-pointer"
            >
              {{ $t('app.signin-google') }}
            </a>
            <RouterLink
              to="/email-auth"
              class="rounded bg-sky-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              {{ $t('email-auth.title') }}
            </RouterLink>
          </div>
          <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.pkutools.twa"
              target="_blank"
            >
              <img
                alt="Get it on Google Play"
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                class="inline-block w-28 align-middle"
              />
            </a>
            <RouterLink
              to="/help"
              class="rounded bg-black/5 dark:bg-white/15 px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm hover:bg-black/10 dark:hover:bg-white/10"
            >
              {{ $t('app.install') }} <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
