<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push, remove, update } from 'firebase/database'
import { format, parseISO, formatISO } from 'date-fns'
import { enUS, de, fr, es } from 'date-fns/locale'
import VueApexCharts from 'vue3-apexcharts'
import enChart from 'apexcharts/dist/locales/en.json'
import deChart from 'apexcharts/dist/locales/de.json'
import frChart from 'apexcharts/dist/locales/fr.json'
import esChart from 'apexcharts/dist/locales/es.json'
import { BadgeCheck } from 'lucide-vue-next'

import DataTable from '../components/DataTable.vue'
import ModalDialog from '../components/ModalDialog.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NumberInput from '../components/NumberInput.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import DateInput from '../components/DateInput.vue'

const router = useRouter()
const store = useStore()
const { t, locale: i18nLocale } = useI18n()
const dialog = ref(null)
const publicPath = import.meta.env.BASE_URL

// Reactive state
const editedIndex = ref(-1)
const editedKey = ref(null)

const defaultItem = {
  date: format(new Date(), 'yyyy-MM-dd'),
  phe: null
}

const editedItem = ref({ ...defaultItem })

// Computed properties
const license = computed(
  () => settings.value.license === import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
)

const tableHeaders = computed(() => [
  { key: 'date', title: t('phe-diary.date') },
  { key: 'phe', title: t('common.phe') }
])

const tableHeaders2 = computed(() => [
  { key: 'food', title: t('common.food') },
  { key: 'phe', title: t('common.phe') }
])

const formTitle = computed(() => {
  return editedIndex.value === -1 ? t('common.add') : t('common.edit')
})

const computelocalDate = computed(() => {
  if (editedItem.value.date) {
    const locales = { enUS, de, fr, es }
    return format(parseISO(editedItem.value.date), 'eee P', {
      locale: locales[i18nLocale.value]
    })
  } else {
    return ''
  }
})

const graph = computed(() => {
  let newPheDiary = pheDiary.value
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
})

const chartOptions = computed(() => {
  let en = enChart
  let de = deChart
  let fr = frChart
  let es = esChart
  return {
    chart: {
      locales: [en, de, fr, es],
      defaultLocale: i18nLocale.value,
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
          y: settings.value.maxPhe || 0,
          borderWidth: 2,
          borderColor: '#3498db',
          strokeDashArray: 6
        }
      ]
    },
    theme: {
      mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    },
    colors: ['#3498db']
  }
})

const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const pheDiary = computed(() => store.pheDiary)
const settings = computed(() => store.settings)

// Methods
const signInGoogle = async () => {
  try {
    await store.signInGoogle()
  } catch (error) {
    alert(t('app.auth-error'))
    console.error(error)
  }
}

const editItem = (item) => {
  editedIndex.value = pheDiary.value.indexOf(item)
  editedKey.value = item['.key']
  editedItem.value = Object.assign({}, item)
  dialog.value.openDialog()
}

const deleteItem = () => {
  let r = confirm(t('common.delete') + '?')
  if (r === true) {
    const db = getDatabase()
    remove(dbRef(db, `${user.value.id}/pheDiary/${editedKey.value}`))
    close()
  }
}

const close = () => {
  dialog.value.closeDialog()
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
  editedKey.value = null
}

const save = () => {
  const db = getDatabase()
  if (editedIndex.value > -1) {
    if (editedItem.value.log) {
      update(dbRef(db, `${user.value.id}/pheDiary/${editedKey.value}`), {
        date: editedItem.value.date,
        phe: Number(editedItem.value.phe),
        log: editedItem.value.log
      })
    } else {
      update(dbRef(db, `${user.value.id}/pheDiary/${editedKey.value}`), {
        date: editedItem.value.date,
        phe: Number(editedItem.value.phe)
      })
    }
  } else {
    if (
      pheDiary.value.length >= 100 &&
      settings.value.license !== import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
    ) {
      alert(t('phe-diary.limit'))
    } else {
      push(dbRef(db, `${user.value.id}/pheDiary`), {
        date: editedItem.value.date,
        phe: Number(editedItem.value.phe)
      })
    }
  }
  close()
}

const getlocalDate = (date) => {
  if (date) {
    const locales = { enUS, de, fr, es }
    return format(parseISO(date), 'eee P', { locale: locales[i18nLocale.value] })
  } else {
    return ''
  }
}

const escapeCSV = (value) => {
  if (value === null || value === undefined) return ''
  return `"${value.toString().replace(/"/g, '""')}"`
}

const exportAllFoodItems = () => {
  let r = confirm(t('phe-diary.export-food') + '?')
  if (r === true) {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Date,Name,Weight,Phe\n'

    pheDiary.value.forEach((diaryEntry) => {
      const date = formatISO(parseISO(diaryEntry.date), { representation: 'date' })
      if (diaryEntry.log && diaryEntry.log.length > 0) {
        diaryEntry.log.forEach((logEntry) => {
          const row =
            [
              escapeCSV(date),
              escapeCSV(logEntry.name),
              escapeCSV(logEntry.weight),
              escapeCSV(logEntry.phe)
            ].join(',') + '\n'
          csvContent += row
        })
      }
    })
    triggerDownload(csvContent)
  }
}

const exportDailyPheTotals = () => {
  let r = confirm(t('phe-diary.export-days') + '?')
  if (r === true) {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Date,Total Phe\n'

    pheDiary.value.forEach((diaryEntry) => {
      const date = formatISO(parseISO(diaryEntry.date), { representation: 'date' })
      const row = [escapeCSV(date), escapeCSV(diaryEntry.phe)].join(',') + '\n'
      csvContent += row
    })
    triggerDownload(csvContent)
  }
}

const triggerDownload = (csvContent) => {
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', t('phe-diary.export-filename') + '.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div>
    <div class="block mb-6">
      <nav class="flex space-x-2" aria-label="Tabs">
        <RouterLink
          :to="{ path: '/', query: { log: true } }"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
        >
          {{ $t('phe-log.tab-title') }}
        </RouterLink>
        <RouterLink
          to="/phe-diary"
          class="bg-black/5 dark:bg-white/15 text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          aria-current="page"
          >{{ $t('phe-diary.tab-title') }}</RouterLink
        >
        <!-- <RouterLink
          to="/blood-levels"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          >{{ $t('blood-levels.tab-title') }}</RouterLink
        > -->
      </nav>
    </div>

    <div v-if="!userIsAuthenticated" class="mt-8">
      <SecondaryButton :text="$t('app.signin-google')" @click="signInGoogle" />
      <br />
      <RouterLink
        type="button"
        to="/email-auth"
        class="rounded bg-black/5 dark:bg-white/15 px-2 py-1 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm hover:bg-black/10 dark:hover:bg-white/10 mr-3 mb-6"
      >
        {{ $t('email-auth.title') }}
      </RouterLink>
    </div>

    <div v-if="userIsAuthenticated">
      <p v-if="pheDiary.length < 2" class="mb-6">{{ $t('phe-diary.chart-info') }}</p>

      <apexchart
        v-if="pheDiary.length >= 2"
        type="area"
        height="250"
        :options="chartOptions"
        :series="graph"
        class="-mb-2"
      ></apexchart>

      <!-- TODO: Add sort feature -->
      <DataTable :headers="tableHeaders" class="mb-8">
        <tr
          v-for="(item, index) in pheDiary"
          :key="index"
          @click="editItem(item)"
          class="cursor-pointer"
        >
          <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-6">
            {{ getlocalDate(item.date) }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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

        <DataTable v-if="editedItem.log" :headers="tableHeaders2" class="mb-3">
          <tr v-for="(item, index) in editedItem.log" :key="index">
            <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-300 sm:pl-6">
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
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ item.phe }}
            </td>
          </tr>
        </DataTable>
      </ModalDialog>

      <SecondaryButton :text="$t('phe-diary.export-food')" @click="exportAllFoodItems" />
      <SecondaryButton :text="$t('phe-diary.export-days')" @click="exportDailyPheTotals" />

      <p v-if="!license" class="mt-3">
        {{ $t('phe-diary.note') }}
        <a href="https://buymeacoffee.com/andrereus/membership" target="_blank" class="text-sky-500"
          >PKU Tools Unlimited</a
        >.
      </p>
      <p v-if="license" class="mt-3 text-sm">
        <BadgeCheck class="h-5 w-5 text-sky-500 inline-block mr-1" aria-hidden="true" />
        {{ $t('phe-diary.unlimited') }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.food-icon {
  vertical-align: bottom;
  display: inline-block;
}
</style>
