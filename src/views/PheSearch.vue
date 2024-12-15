<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push } from 'firebase/database'
import Fuse from 'fuse.js'
import { Search } from 'lucide-vue-next'

import PageHeader from '../components/PageHeader.vue'
import ModalDialog from '../components/ModalDialog.vue'
import NumberInput from '../components/NumberInput.vue'
import DataTable from '../components/DataTable.vue'

const router = useRouter()
const store = useStore()
const { t, locale } = useI18n()
const dialog = ref(null)
const publicPath = import.meta.env.BASE_URL

// Reactive state
const search = ref(null)
const phe = ref(null)
const weight = ref(100)
const name = ref('')
const emoji = ref('🌱')
const advancedFood = ref(null)
const loading = ref(false)

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const ownFood = computed(() => store.ownFood)

const tableHeaders = computed(() => [
  { key: 'food', title: t('common.food') },
  { key: 'phe', title: t('common.phe') }
])

// Methods
const loadItem = (item) => {
  name.value = item.name
  emoji.value = item.emoji
  phe.value = item.phe
  weight.value = 100
  dialog.value.openDialog()
}

const calculatePhe = () => {
  return Math.round((weight.value * phe.value) / 100)
}

const save = () => {
  const db = getDatabase()
  push(dbRef(db, `${user.value.id}/pheLog`), {
    name: name.value,
    emoji: emoji.value || null,
    pheReference: phe.value,
    weight: Number(weight.value),
    phe: calculatePhe()
  })
  dialog.value.closeDialog()
  router.push('/')
}

const searchFood = async () => {
  loading.value = true
  let res, food, langFood

  // Load language-specific food data
  const langMap = {
    de: 'usda-icon-de.json',
    es: 'usda-icon-es.json',
    fr: 'usda-icon-fr.json',
    en: 'usda-icon-en.json'
  }

  const fileName = langMap[locale.value] || langMap.en
  res = await fetch(publicPath + 'data/' + fileName)
  langFood = await res.json()
  food = langFood.concat(ownFood.value)

  const fuse = new Fuse(food, {
    keys: ['name', 'phe'],
    threshold: 0.2,
    minMatchCharLength: 2,
    ignoreLocation: true,
    useExtendedSearch: true
  })

  let results = fuse.search(search.value.trim())
  advancedFood.value = results.map((result) => result.item)
  loading.value = false
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('app.search')" />
    </header>

    <div>
      <div class="w-full mb-6">
        <label for="search" class="sr-only">{{ $t('phe-search.search') }}</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            id="search"
            name="search"
            v-model="search"
            :placeholder="$t('phe-search.search')"
            @keyup="searchFood"
            autocomplete="off"
            class="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:focus:ring-sky-500"
          />
        </div>
      </div>

      <DataTable v-if="advancedFood !== null" :headers="tableHeaders">
        <tr
          v-for="(item, index) in advancedFood"
          :key="index"
          @click="loadItem(item)"
          class="cursor-pointer"
        >
          <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-6">
            {{ item.emoji }}
            {{ item.name }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
            {{ item.phe }}
          </td>
        </tr>
      </DataTable>

      <p class="mt-8">{{ $t('phe-search.search-info') }}</p>

      <ModalDialog
        ref="dialog"
        :title="emoji ? emoji + ' ' + name : name"
        :buttons="[
          { label: $t('common.add'), type: 'submit', visible: userIsAuthenticated },
          { label: $t('common.close'), type: 'simpleClose', visible: true }
        ]"
        @submit="save"
      >
        <NumberInput id-name="weight" :label="$t('common.weight-in-g')" v-model.number="weight" />
        <p class="text-xl">= {{ calculatePhe() }} mg Phe</p>
      </ModalDialog>
    </div>
  </div>
</template>
