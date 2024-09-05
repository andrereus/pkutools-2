<template>
  <div>
    <div class="t-block t-mb-6">
      <nav class="t-flex t-space-x-2" aria-label="Tabs">
        <RouterLink
          :to="{ path: '/', query: { home: true } }"
          class="t-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
        >
          <House class="t-h-4 t-w-4 t-mt-0.5" aria-hidden="true" />
        </RouterLink>
        <RouterLink
          :to="{ path: '/', query: { log: true } }"
          class="t-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
        >
          {{ $t('phe-log.tab-title') }}
        </RouterLink>
        <RouterLink
          to="/phe-diary"
          class="t-bg-black/5 dark:t-bg-white/15 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
          aria-current="page"
          >{{ $t('phe-diary.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <div v-if="!userIsAuthenticated" class="t-mt-8">
      <SecondaryButton :text="$t('app.signin-google')" @click="signInGoogle" />
      <br />
      <RouterLink
        type="button"
        to="/email-auth"
        class="t-rounded t-bg-black/5 dark:t-bg-white/15 t-px-2 t-py-1 t-text-sm t-font-semibold t-text-gray-900 dark:t-text-gray-300 t-shadow-sm hover:t-bg-black/10 dark:hover:t-bg-white/10 t-mr-3 t-mb-6"
      >
        {{ $t('email-auth.title') }}
      </RouterLink>
    </div>

    <div v-if="userIsAuthenticated">
      <p v-if="pheDiary.length < 2" class="t-mb-6">{{ $t('phe-diary.chart-info') }}</p>

      <apexchart
        v-if="pheDiary.length >= 2"
        type="area"
        height="250"
        :options="chartOptions"
        :series="graph"
        class="t--mb-2"
      ></apexchart>

      <!-- TODO: Add sort feature -->
      <DataTable :headers="tableHeaders" class="t-mb-8">
        <tr
          v-for="(item, index) in pheDiary"
          :key="index"
          @click="editItem(item)"
          class="t-cursor-pointer"
        >
          <td
            class="t-py-4 t-pl-4 t-pr-3 t-text-sm t-font-medium t-text-gray-900 dark:t-text-gray-300 sm:t-pl-6"
          >
            {{ getlocalDate(item.date) }}
          </td>
          <td
            class="t-whitespace-nowrap t-px-3 t-py-4 t-text-sm t-text-gray-500 dark:t-text-gray-400"
          >
            {{ item.phe }}
          </td>
        </tr>
      </DataTable>

      <PrimaryButton :text="$t('common.add')" @click="$refs.dialog.openDialog()" />

      <ModalDialog
        ref="dialog"
        :title="formTitle"
        :buttons="[
          { label: $t('common.save'), type: 'submit', visible: true },
          { label: $t('common.delete'), type: 'delete', visible: editedIndex !== -1 },
          { label: $t('common.cancel'), type: 'close', visible: true }
        ]"
        @submit="save"
        @delete="deleteItem"
        @close="close"
      >
        <DateInput id-name="date" :label="$t('phe-diary.date')" v-model="editedItem.date" />

        <NumberInput
          id-name="total-phe"
          :label="$t('phe-diary.phe')"
          v-model.number="editedItem.phe"
        />

        <DataTable v-if="editedItem.log" :headers="tableHeaders2" class="t-mb-3">
          <tr v-for="(item, index) in editedItem.log" :key="index">
            <td
              class="t-py-4 t-pl-4 t-pr-3 t-text-sm t-font-medium t-text-gray-900 dark:t-text-gray-300 sm:t-pl-6"
            >
              <img
                :src="publicPath + 'img/food-icons/' + item.icon + '.svg'"
                v-if="item.icon !== undefined && item.icon !== ''"
                onerror="this.src='img/food-icons/organic-food.svg'"
                width="25"
                class="food-icon"
                alt="Food Icon"
              />
              <img
                :src="publicPath + 'img/food-icons/organic-food.svg'"
                v-if="(item.icon === undefined || item.icon === '') && item.emoji === undefined"
                width="25"
                class="food-icon"
                alt="Food Icon"
              />
              {{
                (item.icon === undefined || item.icon === '') && item.emoji !== undefined
                  ? item.emoji
                  : null
              }}
              {{ item.name }}
            </td>
            <td
              class="t-whitespace-nowrap t-px-3 t-py-4 t-text-sm t-text-gray-500 dark:t-text-gray-400"
            >
              {{ item.phe }}
            </td>
          </tr>
        </DataTable>
      </ModalDialog>

      <SecondaryButton :text="$t('phe-diary.export-food')" @click="exportAllFoodItems" />
      <SecondaryButton :text="$t('phe-diary.export-days')" @click="exportDailyPheTotals" />

      <p class="t-mt-3">{{ $t('phe-diary.note') }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push, remove, update } from 'firebase/database'
import { format, parseISO, formatISO } from 'date-fns'
import { enUS, de, fr, es } from 'date-fns/locale'
import VueApexCharts from 'vue3-apexcharts'
import enChart from 'apexcharts/dist/locales/en.json'
import deChart from 'apexcharts/dist/locales/de.json'
import frChart from 'apexcharts/dist/locales/fr.json'
import esChart from 'apexcharts/dist/locales/es.json'

import DataTable from '../components/DataTable.vue'
import ModalDialog from '../components/ModalDialog.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NumberInput from '../components/NumberInput.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import DateInput from '../components/DateInput.vue'

import { House } from 'lucide-vue-next'

export default {
  components: {
    apexchart: VueApexCharts,
    DataTable,
    ModalDialog,
    PrimaryButton,
    NumberInput,
    SecondaryButton,
    DateInput,
    House
  },
  data: () => ({
    publicPath: import.meta.env.BASE_URL,
    editedIndex: -1,
    editedKey: null,
    editedItem: {
      date: '',
      phe: null
    },
    defaultItem: {
      date: '',
      phe: null
    }
  }),
  methods: {
    async signInGoogle() {
      const store = useStore()
      try {
        await store.signInGoogle()
      } catch (error) {
        alert(this.$t('app.auth-error'))
        console.error(error)
      }
    },
    editItem(item) {
      this.editedIndex = this.pheDiary.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
      this.$refs.dialog.openDialog()
    },
    deleteItem() {
      let r = confirm(this.$t('common.delete') + '?')
      if (r === true) {
        const db = getDatabase()
        remove(ref(db, `${this.user.id}/pheDiary/${this.editedKey}`))
        this.close()
      }
    },
    close() {
      this.$refs.dialog.closeDialog()
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.editedKey = null
      })
    },
    save() {
      const db = getDatabase()
      if (this.editedIndex > -1) {
        if (this.editedItem.log) {
          update(ref(db, `${this.user.id}/pheDiary/${this.editedKey}`), {
            date: this.editedItem.date,
            phe: Number(this.editedItem.phe),
            log: this.editedItem.log
          })
        } else {
          update(ref(db, `${this.user.id}/pheDiary/${this.editedKey}`), {
            date: this.editedItem.date,
            phe: Number(this.editedItem.phe)
          })
        }
      } else {
        if (this.pheDiary.length >= 100) {
          alert(this.$t('phe-diary.limit'))
        } else {
          push(ref(db, `${this.user.id}/pheDiary`), {
            date: this.editedItem.date,
            phe: Number(this.editedItem.phe)
          })
        }
      }
      this.close()
    },
    getlocalDate(date) {
      if (date) {
        const locales = { enUS, de, fr, es }
        return format(parseISO(date), 'eee P', { locale: locales[this.$i18n.locale] })
      } else {
        return ''
      }
    },
    exportAllFoodItems() {
      let r = confirm(this.$t('common.export') + '?')
      if (r === true) {
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += 'Date,Name,Weight,Phe\n'

        this.pheDiary.forEach((diaryEntry) => {
          const date = formatISO(parseISO(diaryEntry.date), { representation: 'date' })
          if (diaryEntry.log && diaryEntry.log.length > 0) {
            diaryEntry.log.forEach((logEntry) => {
              const row = `${date},${logEntry.name},${logEntry.weight},${logEntry.phe}\n`
              csvContent += row
            })
          }
        })
        this.triggerDownload(csvContent)
      }
    },
    exportDailyPheTotals() {
      let r = confirm(this.$t('common.export') + '?')
      if (r === true) {
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += 'Date,Total Phe\n'

        this.pheDiary.forEach((diaryEntry) => {
          const date = formatISO(parseISO(diaryEntry.date), { representation: 'date' })
          const row = `${date},${diaryEntry.phe}\n`
          csvContent += row
        })
        this.triggerDownload(csvContent)
      }
    },
    triggerDownload(csvContent) {
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', this.$t('phe-diary.export-filename') + '.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  computed: {
    tableHeaders() {
      return [
        { key: 'date', title: this.$t('phe-diary.date') },
        { key: 'phe', title: this.$t('common.phe') }
      ]
    },
    tableHeaders2() {
      return [
        { key: 'food', title: this.$t('common.food') },
        { key: 'phe', title: this.$t('common.phe') }
      ]
    },
    formTitle() {
      if (this.editedIndex === -1) {
        return this.$t('common.add')
      } else {
        return this.$t('common.edit')
      }
    },
    computelocalDate() {
      if (this.editedItem.date) {
        const locales = { enUS, de, fr, es }
        return format(parseISO(this.editedItem.date), 'eee P', {
          locale: locales[this.$i18n.locale]
        })
      } else {
        return ''
      }
    },
    graph() {
      let newPheDiary = this.pheDiary
      let chartPheDiary = newPheDiary
        .map((obj) => {
          return { x: obj.date, y: obj.phe }
        })
        .sort((a, b) => {
          return parseISO(a.x) - parseISO(b.x)
        })
      return [
        {
          name: 'Phe',
          data: chartPheDiary
        }
      ]
    },
    chartOptions() {
      let en = enChart
      let de = deChart
      let fr = frChart
      let es = esChart
      return {
        chart: {
          locales: [en, de, fr, es],
          defaultLocale: this.$i18n.locale,
          toolbar: {
            export: {
              csv: {
                filename: 'PKU Tools - Chart Data',
                headerCategory: 'Date',
                headerValue: 'Total Phe',
                dateFormatter(timestamp) {
                  return timestamp
                }
              },
              svg: {
                filename: 'PKU Tools - Chart'
              },
              png: {
                filename: 'PKU Tools - Chart'
              }
            }
          },
          zoom: {
            enabled: false
          },
          background: 'transparent'
        },
        stroke: {
          curve: 'smooth'
        },
        markers: {
          size: 1
        },
        grid: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          min: 0
        },
        annotations: {
          yaxis: [
            {
              y: this.settings.maxPhe || 0,
              borderWidth: 2,
              borderColor: '#3498db',
              strokeDashArray: 6
            }
          ]
        },
        theme: {
          mode: this.$vuetify.theme.dark === true ? 'dark' : 'light'
        },
        colors: ['#3498db']
      }
    },
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    },
    pheDiary() {
      const store = useStore()
      return store.pheDiary
    },
    settings() {
      const store = useStore()
      return store.settings
    }
  }
}
</script>

<style lang="scss" scoped>
.food-icon {
  vertical-align: bottom;
  display: inline-block;
}
</style>
