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

      <div v-if="advancedFood !== null" class="t-mt-8 t-flow-root">
        <div class="t--mx-4 t--my-2 t-overflow-x-auto sm:t--mx-6 lg:t--mx-8">
          <div class="t-inline-block t-min-w-full t-py-2 t-align-middle sm:t-px-6 lg:t-px-8">
            <div
              class="t-overflow-hidden t-shadow t-ring-1 t-ring-black dark:t-ring-gray-800 t-ring-opacity-5 sm:t-rounded-lg"
            >
              <table class="t-min-w-full t-divide-y t-divide-gray-300 dark:t-divide-gray-600">
                <thead class="t-bg-gray-50 dark:t-bg-gray-950">
                  <tr>
                    <th
                      scope="col"
                      class="t-py-3.5 t-pl-4 t-pr-3 t-text-left t-text-sm t-font-semibold t-text-gray-900 dark:t-text-gray-300 sm:t-pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="t-px-3 t-py-3.5 t-text-left t-text-sm t-font-semibold t-text-gray-900 dark:t-text-gray-300"
                    >
                      Phe
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="t-divide-y t-divide-gray-200 dark:t-divide-gray-700 t-bg-white dark:t-bg-gray-900"
                >
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p class="t-mt-8 t-italic">{{ $t('phe-search.search-info') }}</p>

      <p class="t-mt-8">
        {{ $t('phe-search.source') }}
      </p>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 mt-4">
            {{ emoji }}
            {{ name }}
          </v-card-title>

          <v-card-text>
            <v-text-field
              :label="$t('phe-search.weight')"
              v-model.number="weight"
              type="number"
              clearable
            ></v-text-field>
            <p class="text-h6 font-weight-regular">= {{ calculatePhe() }} mg Phe</p>
            <div v-if="userIsAuthenticated">
              <p class="mt-4 text-caption">{{ $t('phe-log.preview') }}</p>
              <v-progress-linear
                :model-value="((pheResult + calculatePhe()) * 100) / (settings?.maxPhe || 0)"
                height="6"
                class="mt-3 mb-8"
                rounded
              ></v-progress-linear>
            </div>
          </v-card-text>

          <v-card-actions class="mt-n6">
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="save" v-if="userIsAuthenticated">
              {{ $t('common.add') }}
            </v-btn>
            <v-btn variant="flat" color="btnsecondary" @click="dialog = false">{{
              $t('common.close')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'
import Fuse from 'fuse.js'
import { mdiMagnify, mdiInformationVariant } from '@mdi/js'

import { Search } from 'lucide-vue-next'

import PageHeader from '../components/PageHeader.vue'

export default {
  components: {
    PageHeader,
    Search
  },
  data: () => ({
    mdiMagnify,
    mdiInformationVariant,
    publicPath: import.meta.env.BASE_URL,
    dialog: false,
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
      this.dialog = true
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
      this.dialog = false
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

<style lang="scss" scoped>
.tr-edit {
  cursor: pointer;
}

.v-btn {
  text-transform: none;
}
</style>
