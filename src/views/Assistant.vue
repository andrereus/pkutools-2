<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { parseISO, subDays, format } from 'date-fns'
import {
  Award,
  Activity,
  Clock,
  Calendar,
  Book,
  ChartLine,
  BicepsFlexed,
  Check
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import SecondaryButton from '../components/SecondaryButton.vue'

const store = useStore()
const { t } = useI18n()

// Store computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const pheDiary = computed(() => store.pheDiary)
const settings = computed(() => store.settings)
const labValues = computed(() => store.labValues)

const license = computed(
  () => settings.value.license === import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
)

const tiers = computed(() => [
  {
    name: t('settings.tier-basic'),
    id: 'tier-basic',
    price: '€0',
    description: t('settings.tier-basic-desc'),
    features: [
      t('settings.tier-basic-feature-1'),
      t('settings.tier-basic-feature-2'),
      t('settings.tier-basic-feature-3')
    ],
    featured: false
  },
  {
    name: t('settings.tier-unlimited'),
    id: 'tier-unlimited',
    price: '€3',
    description: t('settings.tier-unlimited-desc'),
    features: [
      t('settings.tier-unlimited-feature-1'),
      t('settings.tier-unlimited-feature-2'),
      t('settings.tier-unlimited-feature-3'),
      t('settings.tier-unlimited-feature-4'),
      t('settings.tier-unlimited-feature-5'),
      t('settings.tier-unlimited-feature-6')
    ],
    featured: true
  },
  {
    name: t('settings.tier-lifetime'),
    id: 'tier-lifetime',
    price: '€69',
    description: t('settings.tier-lifetime-desc'),
    features: [
      t('settings.tier-unlimited-feature-1'),
      t('settings.tier-unlimited-feature-2'),
      t('settings.tier-unlimited-feature-3'),
      t('settings.tier-unlimited-feature-4'),
      t('settings.tier-unlimited-feature-5'),
      t('settings.tier-unlimited-feature-6')
    ],
    featured: true
  }
])

// Helper to get diary entries for date range
const getDiaryEntriesForDays = (days, includeToday = false) => {
  return [...Array(days)]
    .map((_, i) => {
      const date = format(subDays(new Date(), includeToday ? i : i + 1), 'yyyy-MM-dd')
      return pheDiary.value.find((entry) => entry.date === date)
    })
    .filter(Boolean)
}

// Calculate streak
const streak = computed(() => {
  if (!pheDiary.value.length) return 0
  let currentStreak = 0
  let currentDate = new Date()

  const todayStr = format(currentDate, 'yyyy-MM-dd')
  const todayEntry = pheDiary.value.find((e) => e.date === todayStr)
  if (todayEntry) currentStreak++

  while (true) {
    currentDate = subDays(currentDate, 1)
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const entry = pheDiary.value.find((e) => e.date === dateStr)
    if (!entry) break
    currentStreak++
  }
  return currentStreak
})

// Calculate recent activity
const recentActivity = computed(() => {
  const last14Days = getDiaryEntriesForDays(14, true)
  return {
    count: last14Days.length,
    total: 14,
    achieved: last14Days.length >= 10
  }
})

// Calculate Phe statistics
const pheStats = computed(() => {
  if (!settings.value?.maxPhe || !pheDiary.value.length) {
    return { average: 0, deviation: 0 }
  }

  const last14Days = getDiaryEntriesForDays(14, false)
  if (!last14Days.length) return { average: 0, deviation: 0 }

  const average = Math.round(
    last14Days.reduce((sum, entry) => sum + entry.phe, 0) / last14Days.length
  )
  const deviations = last14Days.map((entry) => Math.abs(1 - entry.phe / settings.value.maxPhe))
  const averageDeviation = Math.round(
    (deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length) * 100
  )

  return { average, deviation: averageDeviation }
})

// Get diary entries
const todayEntry = computed(() => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return pheDiary.value.find((entry) => entry.date === today)
})

const yesterdayEntry = computed(() => {
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  return pheDiary.value.find((entry) => entry.date === yesterday)
})

// Calculate nutrition balance
const nutritionBalance = computed(() => {
  if (!todayEntry.value || !settings.value?.maxPhe || !settings.value?.maxKcal) return null

  const phePercentage = (todayEntry.value.phe / settings.value.maxPhe) * 100
  const kcalPercentage = (todayEntry.value.kcal / settings.value.maxKcal) * 100

  return {
    phePercentage,
    kcalPercentage,
    difference: phePercentage - kcalPercentage
  }
})

// Get most recent lab values
const recentLabValues = computed(() => {
  if (!labValues.value.length) return null
  return [...labValues.value].sort((a, b) => parseISO(b.date) - parseISO(a.date))[0]
})

// Badges configuration
const badges = computed(() => [
  {
    id: 'streak',
    title: t('badges.streak-title'),
    description: t('badges.streak-description', { days: streak.value }),
    earned: streak.value >= 5,
    progress: Math.min(Math.round((streak.value / 5) * 100), 100)
  },
  {
    id: 'history',
    title: t('badges.history-title'),
    description: t('badges.history-description', {
      days: recentActivity.value.count,
      total: recentActivity.value.total
    }),
    earned: recentActivity.value.achieved,
    progress: Math.min(Math.round((recentActivity.value.count / 10) * 100), 100)
  }
])

// Methods
const signInGoogle = async () => {
  try {
    await store.signInGoogle()
  } catch (error) {
    alert(t('app.auth-error'))
    console.error(error)
  }
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('assistant.title')" class="inline-block" />
    </header>

    <div v-if="!userIsAuthenticated">
      <SecondaryButton :text="$t('app.signin-google')" @click="signInGoogle" />
      <br />
      <RouterLink
        type="button"
        to="/email-auth"
        class="rounded-sm bg-black/5 dark:bg-white/15 px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-xs hover:bg-black/10 dark:hover:bg-white/10 mr-3 mb-6"
      >
        {{ $t('email-auth.title') }}
      </RouterLink>
    </div>

    <div v-if="userIsAuthenticated">
      <div class="space-y-6">
        <!-- Motivation -->
        <div class="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center gap-3 font-medium mb-2">
              <Award class="h-5 w-5" />
              {{ $t('assistant.motivation') }}
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <p v-if="streak > 0">
                  {{ $t('assistant.streak', { streak }) }}
                  {{ streak >= 7 ? $t('assistant.week') : $t('assistant.keep-going') }}
                </p>
                <p v-else>
                  {{ $t('assistant.start-tracking') }}
                </p>
              </div>
              <!-- Streak Badge -->
              <div class="flex items-center gap-4">
                <div
                  class="p-2 rounded-full"
                  :class="
                    badges[0].earned
                      ? 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  "
                >
                  <Activity class="h-5 w-5" />
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <h4 class="text-sm font-medium">{{ badges[0].title }}</h4>
                    <span class="text-xs text-gray-500">{{ badges[0].progress }}%</span>
                  </div>
                  <p class="text-sm text-gray-500">{{ badges[0].description }}</p>
                  <div class="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full"
                      :class="badges[0].earned ? 'bg-sky-500' : 'bg-gray-400'"
                      :style="{ width: `${badges[0].progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <!-- History Badge -->
              <div class="flex items-center gap-4">
                <div
                  class="p-2 rounded-full"
                  :class="
                    badges[1].earned
                      ? 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  "
                >
                  <BicepsFlexed class="h-5 w-5" />
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <h4 class="text-sm font-medium">{{ badges[1].title }}</h4>
                    <span class="text-xs text-gray-500">{{ badges[1].progress }}%</span>
                  </div>
                  <p class="text-sm text-gray-500">{{ badges[1].description }}</p>
                  <div class="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full"
                      :class="badges[1].earned ? 'bg-sky-500' : 'bg-gray-400'"
                      :style="{ width: `${badges[1].progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Currently -->
        <div
          v-if="license && nutritionBalance"
          class="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center gap-3 font-medium mb-2">
              <Clock class="h-5 w-5" />
              {{ $t('assistant.satiety-tip') }}
            </div>
            <p>
              <template v-if="nutritionBalance.difference > 5">
                {{
                  $t('assistant.satiety-tip-high', {
                    phePercentage: Math.round(nutritionBalance.phePercentage),
                    kcalPercentage: Math.round(nutritionBalance.kcalPercentage)
                  })
                }}
              </template>
              <template v-else-if="nutritionBalance.difference < -5">
                {{
                  $t('assistant.satiety-tip-low', {
                    phePercentage: Math.round(nutritionBalance.phePercentage),
                    kcalPercentage: Math.round(nutritionBalance.kcalPercentage)
                  })
                }}
              </template>
              <template v-else>
                {{ $t('assistant.satiety-tip-good') }}
              </template>
            </p>
          </div>
        </div>

        <!-- Today -->
        <div
          v-if="license && yesterdayEntry && settings?.maxPhe"
          class="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center gap-3 font-medium mb-2">
              <Calendar class="h-5 w-5" />
              {{ $t('assistant.previous-day') }}
            </div>
            <p>
              <template v-if="yesterdayEntry.phe < settings.maxPhe * 0.8">
                {{ $t('assistant.previous-day-low') }}
              </template>
              <template v-else-if="yesterdayEntry.phe > settings.maxPhe * 1.1">
                {{ $t('assistant.previous-day-high') }}
              </template>
              <template v-else>
                {{ $t('assistant.previous-day-good') }}
              </template>
            </p>
          </div>
        </div>

        <!-- Phe Diary -->
        <div v-if="license" class="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center gap-3 font-medium mb-2">
              <Book class="h-5 w-5" />
              {{ $t('assistant.phe-diary') }}
            </div>
            <div>
              <p>{{ $t('assistant.phe-stats-average', { average: pheStats.average }) }}</p>
              <p>{{ $t('assistant.phe-stats-deviation', { deviation: pheStats.deviation }) }}</p>
            </div>
          </div>
        </div>

        <!-- Lab Values -->
        <div
          v-if="license && recentLabValues"
          class="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center gap-3 font-medium mb-2">
              <ChartLine class="h-5 w-5" />
              {{ $t('assistant.lab-values') }}
            </div>
            <p>
              <!-- Phe Analysis -->
              <template v-if="recentLabValues.phe > 10">
                {{
                  $t('assistant.lab-values-high', {
                    phe: recentLabValues.phe,
                    unit: settings?.labUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'
                  })
                }}
              </template>
              <template v-else-if="recentLabValues.phe < 2">
                {{
                  $t('assistant.lab-values-low', {
                    phe: recentLabValues.phe,
                    unit: settings?.labUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'
                  })
                }}
              </template>
              <template v-else>
                {{
                  $t('assistant.lab-values-good', {
                    phe: recentLabValues.phe,
                    unit: settings?.labUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'
                  })
                }}
              </template>
            </p>
            <p>
              <!-- Tyrosine Analysis -->
              <template v-if="recentLabValues.tyrosine < 0.41">
                {{
                  $t('assistant.lab-values-tyrosine-low', {
                    tyrosine: recentLabValues.tyrosine,
                    unit: settings?.labUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'
                  })
                }}
              </template>
              <template v-else-if="recentLabValues.tyrosine > 3.73">
                {{
                  $t('assistant.lab-values-tyrosine-high', {
                    tyrosine: recentLabValues.tyrosine,
                    unit: settings?.labUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'
                  })
                }}
              </template>
              <template v-else>
                {{
                  $t('assistant.lab-values-tyrosine-good', {
                    tyrosine: recentLabValues.tyrosine,
                    unit: settings?.labUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'
                  })
                }}
              </template>
            </p>
          </div>
        </div>

        <p v-if="license" class="mt-2">
          {{ $t('assistant.info') }}
        </p>
      </div>

      <div
        class="mx-auto my-6 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3"
        v-if="!license"
      >
        <div
          v-for="(tier, tierIdx) in tiers"
          :key="tier.id"
          :class="[
            tier.featured ? 'relative' : 'sm:mx-8 lg:mx-0',
            tierIdx <= 1
              ? 'rounded-t-xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-xl'
              : 'sm:rounded-t-none lg:rounded-tr-xl lg:rounded-bl-none',
            'rounded-xl p-8 ring-1 ring-gray-200 dark:ring-gray-800'
          ]"
        >
          <h3
            :id="tier.id"
            :class="[tier.featured ? '' : '', 'text-sky-500 text-base/7 font-semibold']"
          >
            {{ tier.name }}
          </h3>
          <p class="mt-4 flex items-baseline gap-x-1">
            <span :class="[tier.featured ? '' : '', 'text-xl font-semibold tracking-tight']">{{
              tier.price
            }}</span>
            <span v-if="tier.id === 'tier-unlimited'" class="text-gray-500 text-base">{{
              $t('settings.per-month')
            }}</span>
            <span v-if="tier.id === 'tier-lifetime'" class="text-gray-500 text-base">{{
              $t('settings.one-time')
            }}</span>
          </p>
          <p :class="[tier.featured ? '' : '', 'text-gray-500 mt-4 text-base/7']">
            {{ tier.description }}
          </p>
          <ul
            role="list"
            :class="[tier.featured ? '' : '', 'text-gray-500 mt-4 space-y-1 text-sm/6']"
          >
            <li v-for="feature in tier.features" :key="feature" class="flex gap-x-2">
              <Check
                :class="[tier.featured ? '' : '', 'text-sky-500 h-6 w-5 flex-none']"
                aria-hidden="true"
              />
              {{ feature }}
            </li>
          </ul>
          <a
            href="https://buymeacoffee.com/andrereus/membership"
            target="_blank"
            class="bg-sky-500 text-white shadow-xs hover:bg-sky-400 focus-visible:outline-sky-500 mt-6 block rounded-md px-3.5 py-1 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            v-if="tier.id === 'tier-unlimited'"
            >{{ $t('settings.subscribe') }}</a
          >
          <a
            href="https://buymeacoffee.com/andrereus/membership"
            target="_blank"
            class="bg-black/5 dark:bg-white/15 text-gray-900 dark:text-gray-300 shadow-xs hover:bg-black/10 dark:hover:bg-white/10 focus-visible:outline-sky-500 mt-6 block rounded-md px-3.5 py-1 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            v-if="tier.id === 'tier-lifetime'"
            >{{ $t('settings.buy') }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
