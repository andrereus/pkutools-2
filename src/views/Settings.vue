<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, remove, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { Check } from 'lucide-vue-next'

import PageHeader from '../components/PageHeader.vue'
import SelectMenu from '../components/SelectMenu.vue'
import NumberInput from '../components/NumberInput.vue'
import TextInput from '../components/TextInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SecondaryButton from '../components/SecondaryButton.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

// Reactive state
const selectedTheme = ref('system')

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const settings = computed(() => store.settings)

const themeOptions = computed(() => [
  { title: t('settings.theme-system'), value: 'system' },
  { title: t('settings.theme-light'), value: 'light' },
  { title: t('settings.theme-dark'), value: 'dark' }
])

const unitOptions = computed(() => [
  { title: 'mg/dL', value: 'mgdl' },
  { title: 'µmol/L', value: 'umoll' }
])

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
    price: '€5',
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
    price: '€99',
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

// Methods
const signInGoogle = async () => {
  try {
    await store.signInGoogle()
  } catch (error) {
    alert(t('app.auth-error'))
    console.error(error)
  }
}

const save = () => {
  const db = getDatabase()
  update(dbRef(db, `${user.value.id}/settings`), {
    maxPhe: settings.value.maxPhe || 0,
    maxKcal: settings.value.maxKcal || 0,
    labUnit: settings.value.labUnit
  }).then(() => {
    alert(t('settings.saved'))
  })
}

const saveLicense = () => {
  const db = getDatabase()
  update(dbRef(db, `${user.value.id}/settings`), {
    license: settings.value.license || ''
  }).then(() => {
    if (settings.value.license === import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY) {
      alert(t('settings.license-active') + ' 🎉')
    } else {
      alert(t('settings.license-inactive'))
    }
  })
}

const resetLog = () => {
  let r = confirm(t('settings.reset-log') + '?')
  if (r === true) {
    const db = getDatabase()
    remove(dbRef(db, `${user.value.id}/pheLog`))
    router.push('/')
  }
}

const resetDiary = () => {
  let r = confirm(t('settings.reset-diary') + '?')
  if (r === true) {
    const db = getDatabase()
    remove(dbRef(db, `${user.value.id}/pheDiary`))
    router.push('phe-diary')
  }
}

const resetLabValues = () => {
  let r = confirm(t('settings.reset-lab-values') + '?')
  if (r === true) {
    const db = getDatabase()
    remove(dbRef(db, `${user.value.id}/labValues`))
    router.push('lab-values')
  }
}

const resetOwnFood = () => {
  let r = confirm(t('settings.reset-own-food') + '?')
  if (r === true) {
    const db = getDatabase()
    remove(dbRef(db, `${user.value.id}/ownFood`))
    router.push('own-food')
  }
}

const deleteAccount = () => {
  let r = confirm(t('settings.delete-account') + '?')
  if (r === true) {
    const db = getDatabase()
    const auth = getAuth()
    remove(dbRef(db, store.user.id))
    auth.currentUser
      .delete()
      .then(() => {
        store.signOut()
        router.push('/')
      })
      .catch((error) => {
        alert(t('settings.delete-account-error'))
        console.error(error)
      })
  }
}

const handleThemeChange = () => {
  if (selectedTheme.value === 'light') {
    localStorage.setItem('theme', 'light')
    document.documentElement.classList.remove('dark')
  } else if (selectedTheme.value === 'dark') {
    localStorage.setItem('theme', 'dark')
    document.documentElement.classList.add('dark')
  } else {
    localStorage.removeItem('theme')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  selectedTheme.value = localStorage.getItem('theme') || 'system'
})
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('settings.title')" />
    </header>

    <SelectMenu
      id-name="theme-select"
      :label="$t('settings.theme')"
      v-model="selectedTheme"
      @change="handleThemeChange"
    >
      <option v-for="option in themeOptions" :key="option.value" :value="option.value">
        {{ option.title }}
      </option>
    </SelectMenu>

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
      <NumberInput
        id-name="max-phe"
        :label="$t('settings.max-phe')"
        v-model.number="settings.maxPhe"
      />

      <NumberInput
        id-name="max-kcal"
        :label="$t('settings.max-kcal')"
        v-model.number="settings.maxKcal"
      />

      <SelectMenu
        id-name="unit"
        :label="$t('lab-values.unit')"
        v-model="settings.labUnit"
        class="mb-6"
      >
        <option v-for="option in unitOptions" :key="option.value" :value="option.value">
          {{ option.title }}
        </option>
      </SelectMenu>

      <PrimaryButton :text="$t('common.save')" @click="save" />

      <PageHeader title="PKU Tools Unlimited" class="mt-6" />

      <div
        class="mx-auto my-6 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3"
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

      <TextInput
        id-name="license"
        :label="$t('settings.license-key')"
        v-model="settings.license"
        class="mb-6"
      />

      <PrimaryButton :text="$t('settings.check-license')" @click="saveLicense" />

      <PageHeader :title="$t('settings.reset-heading')" class="mt-6" />

      <SecondaryButton :text="$t('settings.reset-log')" @click="resetLog" />
      <SecondaryButton :text="$t('settings.reset-diary')" @click="resetDiary" />
      <SecondaryButton :text="$t('settings.reset-lab-values')" @click="resetLabValues" />
      <SecondaryButton :text="$t('settings.reset-own-food')" @click="resetOwnFood" />

      <PageHeader :title="$t('settings.delete-account')" class="mt-6" />

      <p class="mb-6">
        {{ $t('settings.delete-account-info') }}
      </p>

      <SecondaryButton :text="$t('settings.delete-account')" @click="deleteAccount" />
    </div>
  </div>
</template>
