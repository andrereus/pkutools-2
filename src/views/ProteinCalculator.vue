<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push, update } from 'firebase/database'
import { format } from 'date-fns'

import PageHeader from '../components/PageHeader.vue'
import SelectMenu from '../components/SelectMenu.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

// Reactive state
const protein = ref(null)
const weight = ref(null)
const name = ref('')
const select = ref('other')
const kcalReference = ref(null)

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)

const type = computed(() => [
  { title: t('protein-calculator.other'), value: 'other' },
  { title: t('protein-calculator.meat'), value: 'meat' },
  { title: t('protein-calculator.vegetable'), value: 'vegetable' },
  { title: t('protein-calculator.fruit'), value: 'fruit' }
])

const factor = computed(() => {
  if (select.value === 'fruit') {
    return 27
  } else if (select.value === 'vegetable') {
    return 35
  } else if (select.value === 'meat') {
    return 46
  } else {
    return 50
  }
})

// Methods
const calculatePhe = () => {
  return Math.round((weight.value * (protein.value * factor.value)) / 100)
}

const calculateKcal = () => {
  return Math.round((weight.value * kcalReference.value) / 100) || 0
}

const save = () => {
  const db = getDatabase()
  const logEntry = {
    name: name.value,
    pheReference: Math.round(protein.value * factor.value),
    kcalReference: Number(kcalReference.value) || 0,
    weight: Number(weight.value),
    phe: calculatePhe(),
    kcal: calculateKcal()
  }

  const today = new Date()
  const formattedDate = format(today, 'yyyy-MM-dd')
  const todayEntry = store.pheDiary.find((entry) => entry.date === formattedDate)

  if (todayEntry) {
    const updatedLog = [...(todayEntry.log || []), logEntry]
    const totalPhe = updatedLog.reduce((sum, item) => sum + (item.phe || 0), 0)
    const totalKcal = updatedLog.reduce((sum, item) => sum + (item.kcal || 0), 0)
    update(dbRef(db, `${user.value.id}/pheDiary/${todayEntry['.key']}`), {
      log: updatedLog,
      phe: totalPhe,
      kcal: totalKcal
    })
  } else {
    push(dbRef(db, `${user.value.id}/pheDiary`), {
      date: formattedDate,
      phe: calculatePhe(),
      kcal: calculateKcal(),
      log: [logEntry]
    })
  }
  router.push('/')
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('app.calculator')" />
    </header>

    <div class="block mb-6">
      <nav class="flex space-x-2" aria-label="Tabs">
        <RouterLink
          to="/phe-calculator"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          >{{ $t('phe-calculator.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/protein-calculator"
          class="bg-black/5 dark:bg-white/15 text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          aria-current="page"
          >{{ $t('protein-calculator.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <TextInput
      id-name="food"
      :label="$t('common.food-name')"
      v-model="name"
      v-if="userIsAuthenticated"
    />

    <SelectMenu id-name="factor" :label="$t('common.food-type')" v-model="select">
      <option v-for="option in type" :key="option.value" :value="option.value">
        {{ option.title }}
      </option>
    </SelectMenu>

    <div class="flex gap-4">
      <NumberInput
        id-name="protein"
        :label="$t('common.protein-per-100g')"
        v-model.number="protein"
        class="flex-1"
      />
      <NumberInput
        id-name="kcalRef"
        :label="$t('common.kcal-per-100g')"
        v-model.number="kcalReference"
        class="flex-1"
        :placeholder="$t('common.optional')"
      />
    </div>
    <NumberInput id-name="weight" :label="$t('common.consumed-weight')" v-model.number="weight" />

    <div class="flex gap-4 my-6">
      <span class="flex-1 ml-1 text-lg">≈ {{ calculatePhe() }} mg Phe</span>
      <span class="flex-1 ml-1 text-lg">= {{ calculateKcal() }} {{ $t('common.kcal') }}</span>
    </div>

    <PrimaryButton v-if="userIsAuthenticated" :text="$t('common.add')" @click="save" />
  </div>
</template>
