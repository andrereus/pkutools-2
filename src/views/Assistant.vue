<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { parseISO, subDays, format } from 'date-fns'
import { Brain, Award, TestTubes, Activity, ChartLine, Target, Scale } from 'lucide-vue-next'
import PageHeader from '../components/PageHeader.vue'
import SecondaryButton from '../components/SecondaryButton.vue'

const store = useStore()
const { t, locale: i18nLocale } = useI18n()

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const pheDiary = computed(() => store.pheDiary)
const settings = computed(() => store.settings)
const labValues = computed(() => store.labValues)

// Get today's diary entry
const todayEntry = computed(() => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return pheDiary.value.find((entry) => entry.date === today)
})

// Calculate Phe and kcal percentages for today
const nutritionBalance = computed(() => {
  if (!todayEntry.value || !settings.value.maxPhe || !settings.value.maxKcal) return null

  const phePercentage = (todayEntry.value.phe / settings.value.maxPhe) * 100
  const kcalPercentage = (todayEntry.value.kcal / settings.value.maxKcal) * 100

  return {
    phePercentage,
    kcalPercentage,
    difference: phePercentage - kcalPercentage
  }
})

// Get yesterday's diary entry
const yesterdayEntry = computed(() => {
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  return pheDiary.value.find((entry) => entry.date === yesterday)
})

// Get recent lab values
const recentLabValues = computed(() => {
  if (!labValues.value.length) return null

  const sorted = [...labValues.value].sort((a, b) => parseISO(b.date) - parseISO(a.date))
  return sorted[0]
})

// Calculate streak
const streak = computed(() => {
  if (!pheDiary.value.length) return 0

  let currentStreak = 0
  let currentDate = subDays(new Date(), 1) // Start from yesterday

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd')
    const entry = pheDiary.value.find((e) => e.date === dateStr)

    if (!entry) break
    currentStreak++
    currentDate = subDays(currentDate, 1)
  }

  return currentStreak
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

// Remove chart related code
const chartOptions = computed(() => ({}))

// Calculate optimum phe deviation for the last 5 days
const pheOptimumDeviation = computed(() => {
  if (!settings.value?.maxPhe) return { inRange: 0, total: 0 }

  const last5Days = [...Array(5)]
    .map((_, i) => {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      return pheDiary.value.find((entry) => entry.date === date)
    })
    .filter(Boolean)

  if (!last5Days.length) return { inRange: 0, total: 5 }

  const daysInRange = last5Days.filter((entry) => {
    const deviation = Math.abs(1 - entry.phe / settings.value.maxPhe)
    return deviation <= 0.2 // Within 20% of target
  }).length

  // Require at least 3 tracked days in range out of the last 5 days
  return {
    inRange: daysInRange,
    total: 5,
    achieved: daysInRange >= 3
  }
})

// Badges data
const badges = computed(() => [
  {
    id: 'streak',
    title: t('badges.streak-title'),
    description: t('badges.streak-description', { days: streak.value }),
    icon: Activity,
    earned: streak.value >= 3,
    progress: Math.min(Math.round((streak.value / 3) * 100), 100)
  },
  {
    id: 'optimum',
    title: t('badges.optimum-title'),
    description: t('badges.optimum-description-short', { days: pheOptimumDeviation.value.inRange }),
    icon: Target,
    earned: pheOptimumDeviation.value.achieved,
    progress: Math.round(
      (pheOptimumDeviation.value.inRange / pheOptimumDeviation.value.total) * 100
    )
  },
  {
    id: 'history',
    title: t('badges.history-title'),
    description: t('badges.history-description'),
    icon: ChartLine,
    earned: pheDiary.value.length >= 7,
    progress: Math.min(Math.round((pheDiary.value.length / 7) * 100), 100)
  }
])
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('assistant.title')" class="inline-block" />
      <span
        class="ml-2 inline-block align-top mt-1 rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-400/20"
        >Work in progress</span
      >
    </header>

    <div v-if="!userIsAuthenticated" class="mt-8">
      <SecondaryButton :text="$t('app.signin-google')" @click="signInGoogle" />
      <br />
      <RouterLink
        type="button"
        to="/email-auth"
        class="rounded bg-black/5 dark:bg-white/15 px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm hover:bg-black/10 dark:hover:bg.white/10 mr-3 mb-6"
      >
        {{ $t('email-auth.title') }}
      </RouterLink>
    </div>

    <div v-if="userIsAuthenticated" class="space-y-6">
      <!-- Nutrition Balance -->
      <div v-if="nutritionBalance" class="rounded-lg border p-4">
        <div class="flex items-center gap-3 font-medium mb-2">
          <Scale class="h-5 w-5" />
          {{ $t('assistant.nutrition-balance') }}
        </div>
        <p>
          <template v-if="nutritionBalance.difference > 5">
            {{
              $t('assistant.nutrition-balance-high', {
                phePercentage: Math.round(nutritionBalance.phePercentage),
                kcalPercentage: Math.round(nutritionBalance.kcalPercentage)
              })
            }}
          </template>
          <template v-else-if="nutritionBalance.difference < -5">
            {{
              $t('assistant.nutrition-balance-low', {
                phePercentage: Math.round(nutritionBalance.phePercentage),
                kcalPercentage: Math.round(nutritionBalance.kcalPercentage)
              })
            }}
          </template>
          <template v-else>
            {{ $t('assistant.nutrition-balance-good') }}
          </template>
        </p>
      </div>

      <!-- Previous Day Analysis -->
      <div v-if="yesterdayEntry && settings?.maxPhe" class="rounded-lg border p-4">
        <div class="flex items-center gap-3 font-medium mb-2">
          <Brain class="h-5 w-5" />
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

      <!-- Lab Values Analysis -->
      <div v-if="recentLabValues" class="rounded-lg border p-4">
        <div class="flex items-center gap-3 font-medium mb-2">
          <TestTubes class="h-5 w-5" />
          {{ $t('assistant.lab-values') }}
        </div>
        <p>
          <template v-if="recentLabValues.phe > 8">
            {{ $t('assistant.lab-values-high') }}
          </template>
          <template v-if="recentLabValues.phe < 2">
            {{ $t('assistant.lab-values-low') }}
          </template>
          <template v-if="recentLabValues.tyrosine < 40">
            {{ $t('assistant.lab-values-tyrosine-low') }}
          </template>
        </p>
      </div>

      <!-- Motivation -->
      <div class="rounded-lg border p-4">
        <div class="flex items-center gap-3 font-medium mb-2">
          <Award class="h-5 w-5" />
          {{ $t('assistant.motivation') }}
        </div>
        <p v-if="streak > 0">
          {{ $t('assistant.streak', { streak }) }}
          {{ streak >= 7 ? $t('assistant.week') : $t('assistant.keep-going') }}
        </p>
        <p v-else>
          {{ $t('assistant.start-tracking') }}
        </p>
      </div>

      <!-- Badges -->
      <div class="rounded-lg border p-4">
        <div class="flex items-center gap-3 font-medium mb-4">
          <Award class="h-5 w-5" />
          {{ $t('assistant.badges') }}
        </div>
        <div class="space-y-4">
          <div v-for="badge in badges" :key="badge.id" class="flex items-center gap-4">
            <div
              class="p-2 rounded-full"
              :class="
                badge.earned
                  ? 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
              "
            >
              <component :is="badge.icon" class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <h4 class="text-sm font-medium">{{ badge.title }}</h4>
                <span class="text-xs text-gray-500">{{ badge.progress }}%</span>
              </div>
              <p class="text-sm text-gray-500">{{ badge.description }}</p>
              <div class="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  class="h-1.5 rounded-full"
                  :class="badge.earned ? 'bg-sky-500' : 'bg-gray-400'"
                  :style="{ width: `${badge.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
