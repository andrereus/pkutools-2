<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push, remove, update } from 'firebase/database'
import { format, parseISO, formatISO } from 'date-fns'
import { enUS, de, fr, es } from 'date-fns/locale'
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
import PageHeader from '../components/PageHeader.vue'

const store = useStore()
const { t, locale: i18nLocale } = useI18n()
const dialog = ref(null)

// Reactive state
const editedIndex = ref(-1)
const editedKey = ref(null)

const defaultItem = {
  date: format(new Date(), 'yyyy-MM-dd'),
  phe: null,
  tyrosine: null
}

const editedItem = ref({ ...defaultItem })

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const labValues = computed(() => store.labValues)
const settings = computed(() => store.settings)

const license = computed(
  () => settings.value.license === import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
)

const tableHeaders = computed(() => [
  { key: 'date', title: t('lab-values.date') },
  { key: 'phe', title: t('lab-values.phe') },
  { key: 'tyrosine', title: t('lab-values.tyrosine') }
])

const formTitle = computed(() => {
  return editedIndex.value === -1 ? t('common.add') : t('common.edit')
})

const graph = computed(() => {
  let newLabValues = labValues.value
  let chartLabValues = newLabValues
    .map((obj) => {
      return { x: obj.date, y: obj.phe }
    })
    .sort((a, b) => {
      return parseISO(a.x) - parseISO(b.x)
    })
  return [
    {
      name: 'Phe',
      data: chartLabValues
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
            headerValue: 'Phe',
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
    theme: {
      mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    },
    colors: ['#3498db']
  }
})

const sortedLabValues = computed(() => {
  return [...labValues.value].sort((a, b) => {
    return parseISO(a.date) - parseISO(b.date)
  })
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

const editItem = (item) => {
  editedIndex.value = labValues.value.indexOf(item)
  editedKey.value = item['.key']
  editedItem.value = JSON.parse(JSON.stringify(item))
  dialog.value.openDialog()
}

const deleteItem = () => {
  const db = getDatabase()
  remove(dbRef(db, `${user.value.id}/labValues/${editedKey.value}`))
  close()
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
    update(dbRef(db, `${user.value.id}/labValues/${editedKey.value}`), {
      date: editedItem.value.date,
      phe: Number(editedItem.value.phe),
      tyrosine: Number(editedItem.value.tyrosine)
    })
  } else {
    if (
      labValues.value.length >= 50 &&
      settings.value.license !== import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
    ) {
      alert(t('lab-values.limit'))
    } else {
      push(dbRef(db, `${user.value.id}/labValues`), {
        date: editedItem.value.date,
        phe: Number(editedItem.value.phe),
        tyrosine: Number(editedItem.value.tyrosine)
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

const exportLabValues = () => {
  let r = confirm(t('lab-values.export') + '?')
  if (r === true) {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Date,Phe,Tyrosine\n'

    labValues.value.forEach((entry) => {
      const date = formatISO(parseISO(entry.date), { representation: 'date' })
      const row =
        [escapeCSV(date), escapeCSV(entry.phe), escapeCSV(entry.tyrosine)].join(',') + '\n'
      csvContent += row
    })
    triggerDownload(csvContent)
  }
}

const triggerDownload = (csvContent) => {
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', t('lab-values.export-filename') + '.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('lab-values.title')" />
    </header>

    <div v-if="!userIsAuthenticated">
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
      <p v-if="labValues.length < 2" class="mb-6">{{ $t('lab-values.chart-info') }}</p>

      <apexchart
        v-if="labValues.length >= 2"
        type="area"
        height="250"
        :options="chartOptions"
        :series="graph"
        class="-mb-2"
      ></apexchart>

      <!-- TODO: Add sort feature -->
      <DataTable :headers="tableHeaders" class="mb-8">
        <tr
          v-for="(item, index) in sortedLabValues"
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
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
            {{ item.tyrosine }}
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
        <DateInput id-name="date" :label="$t('lab-values.date')" v-model="editedItem.date" />

        <NumberInput
          id-name="phe"
          :label="$t('lab-values.phe') + (settings.labUnit === 'mgdl' ? ' (mg/dL)' : ' (µmol/L)')"
          v-model.number="editedItem.phe"
        />

        <NumberInput
          id-name="tyrosine"
          :label="
            $t('lab-values.tyrosine') + (settings.labUnit === 'mgdl' ? ' (mg/dL)' : ' (µmol/L)')
          "
          v-model.number="editedItem.tyrosine"
        />

        <p class="text-sm mt-4">{{ $t('lab-values.unit-info') }}</p>
      </ModalDialog>

      <SecondaryButton :text="$t('lab-values.export')" @click="exportLabValues" />

      <p v-if="!license" class="mt-3">
        {{ $t('app.license') }}
        <a href="https://buymeacoffee.com/andrereus" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            class="w-24 mt-3"
          />
        </a>
      </p>
      <p v-if="license" class="mt-3 text-sm">
        <BadgeCheck class="h-5 w-5 text-sky-500 inline-block mr-1" aria-hidden="true" />
        {{ $t('lab-values.unlimited') }}
      </p>
    </div>
  </div>
</template>
