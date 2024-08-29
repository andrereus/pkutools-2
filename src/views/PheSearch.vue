<template>
  <div>
    <header>
      <PageHeader :title="$t('app.search')" />
    </header>

    <div>
      <div class="t-w-full t-mb-6">
        <label for="search" class="t-sr-only">{{ $t('phe-search.search') }}</label>
        <div class="t-relative">
          <div
            class="t-pointer-events-none t-absolute t-inset-y-0 t-left-0 t-flex t-items-center t-pl-3"
          >
            <Search class="t-h-5 t-w-5 t-text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            id="search"
            name="search"
            v-model="search"
            :placeholder="$t('phe-search.search')"
            @keyup="searchFood"
            autocomplete="off"
            class="t-block t-w-full t-rounded-md t-border-0 t-bg-white t-py-1.5 t-pl-10 t-pr-3 t-text-gray-900 t-ring-1 t-ring-inset t-ring-gray-300 placeholder:t-text-gray-400 focus:t-ring-2 focus:t-ring-inset focus:t-ring-sky-500 sm:t-text-sm sm:t-leading-6 dark:t-bg-gray-800 dark:t-text-gray-300 dark:t-ring-gray-600 dark:focus:t-ring-sky-500"
          />
        </div>
      </div>

      <DataTable v-if="advancedFood !== null" :headers="tableHeaders">
        <tr
          v-for="(item, index) in advancedFood"
          :key="index"
          @click="loadItem(item)"
          class="t-cursor-pointer"
        >
          <td
            class="t-py-4 t-pl-4 t-pr-3 t-text-sm t-font-medium t-text-gray-900 dark:t-text-gray-300 sm:t-pl-6"
          >
            {{ item.emoji }}
            {{ item.name }}
          </td>
          <td
            class="t-whitespace-nowrap t-px-3 t-py-4 t-text-sm t-text-gray-500 dark:t-text-gray-400"
          >
            {{ item.phe }}
          </td>
        </tr>
      </DataTable>

      <p class="t-mt-8">{{ $t('phe-search.search-info') }}</p>

      <ModalDialog
        ref="dialog"
        :title="emoji ? emoji + ' ' + name : name"
        :auth="userIsAuthenticated"
        :buttons="[
          { label: $t('common.add'), type: 'submit' },
          { label: $t('common.close'), type: 'close' }
        ]"
        @submit="save"
      >
        <NumberInput
          id-name="weight"
          :label="$t('common.weight-in-g')"
          v-model.number="weight"
          class="t-mb-6"
        />
        <p class="t-text-xl">= {{ calculatePhe() }} mg Phe</p>
      </ModalDialog>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'
import Fuse from 'fuse.js'

import { Search } from 'lucide-vue-next'

import PageHeader from '../components/PageHeader.vue'
import ModalDialog from '../components/ModalDialog.vue'
import NumberInput from '../components/NumberInput.vue'
import DataTable from '../components/DataTable.vue'

export default {
  components: {
    PageHeader,
    ModalDialog,
    NumberInput,
    DataTable,
    Search
  },
  data: () => ({
    publicPath: import.meta.env.BASE_URL,
    search: null,
    phe: null,
    weight: 100,
    name: '',
    emoji: '🌱',
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'name'
      },
      { title: 'Phe', key: 'phe' }
    ],
    advancedFood: null,
    loading: false
  }),
  methods: {
    loadItem(item) {
      this.name = item.name
      this.emoji = item.emoji
      this.phe = item.phe
      this.weight = 100
      this.$refs.dialog.openDialog()
    },
    calculatePhe() {
      return Math.round((this.weight * this.phe) / 100)
    },
    save() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.name,
        emoji: this.emoji || null,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.$refs.dialog.closeDialog()
      this.$router.push('/')
    },
    async searchFood() {
      this.loading = true
      let res, food, langFood

      if (this.$i18n.locale === 'de') {
        res = await fetch(this.publicPath + 'data/usda-icon-de.json')
        langFood = await res.json()
      } else if (this.$i18n.locale === 'es') {
        res = await fetch(this.publicPath + 'data/usda-icon-es.json')
        langFood = await res.json()
      } else if (this.$i18n.locale === 'fr') {
        res = await fetch(this.publicPath + 'data/usda-icon-fr.json')
        langFood = await res.json()
      } else {
        res = await fetch(this.publicPath + 'data/usda-icon-en.json')
        langFood = await res.json()
      }
      food = langFood.concat(this.ownFood)

      const fuse = new Fuse(food, {
        keys: ['name', 'phe'],
        threshold: 0.2,
        minMatchCharLength: 2,
        ignoreLocation: true,
        useExtendedSearch: true
      })
      let results = fuse.search(this.search.trim())

      this.advancedFood = results.map((result) => {
        return result.item
      })
      this.loading = false
    }
  },
  computed: {
    tableHeaders() {
      return [
        { key: 'food', title: this.$t('common.food') },
        { key: 'phe', title: this.$t('common.phe') }
      ]
    },
    pheResult() {
      let phe = 0
      this.pheLog.forEach((item) => {
        phe += item.phe
      })
      return Math.round(phe)
    },
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    },
    ownFood() {
      const store = useStore()
      return store.ownFood
    },
    pheLog() {
      const store = useStore()
      return store.pheLog
    },
    settings() {
      const store = useStore()
      return store.settings
    }
  }
}
</script>
