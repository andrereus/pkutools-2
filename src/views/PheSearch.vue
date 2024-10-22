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

      <a href="https://www.buymeacoffee.com/andrereus" target="_blank">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          class="w-28 mt-8"
        />
      </a>

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
        pheReference: this.phe,
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
