<template>
  <div>
    <header>
      <PageHeader :title="$t('app.calculator')" />
    </header>

    <div class="block mb-6">
      <nav class="flex space-x-2" aria-label="Tabs">
        <RouterLink
          to="/phe-calculator"
          class="bg-black/5 dark:bg-white/15 text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          aria-current="page"
          >{{ $t('phe-calculator.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/protein-calculator"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
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

    <NumberInput id-name="phe" :label="$t('common.phe-per-100g')" v-model.number="phe" />
    <NumberInput id-name="weight" :label="$t('common.consumed-weight')" v-model.number="weight" />

    <p class="text-xl my-6">= {{ calculatePhe() }} mg Phe</p>

    <PrimaryButton v-if="userIsAuthenticated" :text="$t('common.add')" @click="save" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push } from 'firebase/database'

import PageHeader from '../components/PageHeader.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

const router = useRouter()
const store = useStore()

// Reactive state
const phe = ref(null)
const weight = ref(null)
const name = ref('')

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const pheLog = computed(() => store.pheLog)
const settings = computed(() => store.settings)

// Methods
const calculatePhe = () => {
  return Math.round((weight.value * phe.value) / 100)
}

const save = () => {
  const db = getDatabase()
  push(dbRef(db, `${user.value.id}/pheLog`), {
    name: name.value,
    pheReference: phe.value,
    weight: Number(weight.value),
    phe: calculatePhe()
  })
  router.push('/')
}
</script>
