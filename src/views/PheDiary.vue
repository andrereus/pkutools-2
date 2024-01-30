<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <h2 class="text-h5 mt-3">{{ $t('phe-diary.title') }}</h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <div v-if="!userIsAuthenticated">
          <v-btn variant="flat" rounded @click="signInGoogle" class="mt-2">
            <v-icon start>{{ mdiGoogle }}</v-icon>
            {{ $t('app.signin-google') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded @click="signInFacebook" class="mt-2">
            <v-icon start>{{ mdiFacebook }}</v-icon>
            {{ $t('app.signin-facebook') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded to="/email-auth" class="mt-2">
            <v-icon start>{{ mdiEmail }}</v-icon>
            {{ $t('email-auth.title') }}
          </v-btn>

          <img
            src="../assets/en-phe-diary.png"
            :alt="$t('phe-diary.title')"
            max-width="400"
            class="mt-10"
            v-if="$i18n.locale === 'en'"
          />
          <img
            src="../assets/de-phe-diary.png"
            :alt="$t('phe-diary.title')"
            max-width="400"
            class="mt-10"
            v-if="$i18n.locale === 'de'"
          />
        </div>

        <div v-if="userIsAuthenticated">
          <p v-if="pheDiary.length < 2">{{ $t('phe-diary.chart-info') }}</p>

          <apexchart
            v-if="pheDiary.length >= 2"
            type="area"
            height="250"
            :options="chartOptions"
            :series="graph"
            class="mt-n1 mb-1"
          ></apexchart>

          <v-data-table
            :headers="$i18n.locale === 'en' ? headersEn : headersDe"
            :items="pheDiary"
            disable-pagination
            hide-default-footer
            mobile-breakpoint="0"
            :sort-by="['date']"
            class="mb-3"
          >
            <template v-slot:item="{ item }">
              <tr @click="editItem(item)" class="tr-edit">
                <td class="text-start">{{ getlocalDate(item.date) }}</td>
                <td class="text-start">{{ item.phe }}</td>
              </tr>
            </template>
          </v-data-table>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn variant="flat" rounded color="primary" class="mr-3 mt-3" v-bind="props">
                {{ $t('common.add') }}
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="290px"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      variant="filled"
                      rounded
                      :model-value="computelocalDate"
                      :label="$t('phe-diary.date')"
                      readonly
                      v-bind="props"
                      class="mt-4"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.date"
                    no-title
                    scrollable
                    @input="menu = false"
                  ></v-date-picker>
                </v-menu>

                <v-text-field
                  variant="filled"
                  rounded
                  :label="$t('phe-diary.phe')"
                  v-model.number="editedItem.phe"
                  type="number"
                ></v-text-field>

                <p v-if="editedItem.log" class="ml-2 mt-n2 text-caption">
                  {{ $t('phe-diary.log') }}
                </p>

                <v-data-table
                  :headers="headers2"
                  :items="editedItem.log"
                  disable-pagination
                  hide-default-footer
                  mobile-breakpoint="0"
                  class="table-read-only mt-n2 mb-6"
                  v-if="editedItem.log"
                >
                  <template v-slot:item="{ item }">
                    <tr class="tr-read-only">
                      <td class="text-start">
                        <img
                          :src="publicPath + 'img/food-icons/' + item.icon + '.svg'"
                          v-if="item.icon !== undefined && item.icon !== ''"
                          onerror="this.src='img/food-icons/organic-food.svg'"
                          width="25"
                          class="food-icon"
                        />
                        <img
                          :src="publicPath + 'img/food-icons/organic-food.svg'"
                          v-if="
                            (item.icon === undefined || item.icon === '') &&
                            item.emoji === undefined
                          "
                          width="25"
                          class="food-icon"
                        />
                        {{
                          (item.icon === undefined || item.icon === '') && item.emoji !== undefined
                            ? item.emoji
                            : null
                        }}
                        {{ item.name }}
                      </td>
                      <td class="text-start">
                        {{ item.phe }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>

              <v-card-actions class="mt-n6">
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="primary" @click="save">{{ $t('common.save') }}</v-btn>
                <v-btn
                  variant="flat"
                  color="warning"
                  v-if="editedIndex !== -1"
                  @click="deleteItem()"
                >
                  {{ $t('common.delete') }}
                </v-btn>
                <v-btn variant="flat" @click="close">{{ $t('common.cancel') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn variant="flat" rounded class="mr-3 mt-3" @click="exportAllFoodItems">
            {{ $t('phe-diary.export-food') }}
          </v-btn>

          <v-btn variant="flat" rounded class="mr-3 mt-3" @click="exportDailyPheTotals">
            {{ $t('phe-diary.export-days') }}
          </v-btn>

          <p class="text--secondary mt-5">
            <v-icon>{{ mdiInformationVariant }}</v-icon>
            {{ $t('phe-diary.note') }}
          </p>

          <v-dialog v-model="alert" max-width="300">
            <v-card>
              <v-card-title>{{ $t('common.note') }}</v-card-title>
              <v-card-text>{{ $t('phe-diary.limit') }}</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="alert = false">{{
                  $t('common.ok')
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>

    <v-snackbar location="bottom" color="warning" v-model="offlineInfo">
      {{ $t('app.offline') }}
      <template v-slot:action="{ attrs }">
        <v-btn variant="text" v-bind="attrs" @click="offlineInfo = false">
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
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
import { mdiGoogle, mdiFacebook, mdiInformationVariant, mdiEmail } from '@mdi/js'

export default {
  components: {
    apexchart: VueApexCharts
  },
  metaInfo() {
    return {
      title: this.$t('phe-diary.title'),
      meta: [{ name: 'description', content: this.$t('phe-diary.description') }]
    }
  },
  data: () => ({
    mdiGoogle,
    mdiFacebook,
    mdiInformationVariant,
    mdiEmail,
    publicPath: import.meta.env.BASE_URL,
    dialog: false,
    alert: false,
    menu: false,
    headersEn: [
      {
        text: 'Date',
        align: 'start',
        value: 'date'
      },
      { text: 'Phe', value: 'phe' }
    ],
    headersDe: [
      {
        text: 'Datum',
        align: 'start',
        value: 'date'
      },
      { text: 'Phe', value: 'phe' }
    ],
    headers2: [
      {
        text: 'Name',
        align: 'start',
        value: 'name'
      },
      { text: 'Phe', value: 'phe' }
    ],
    editedIndex: -1,
    editedKey: null,
    editedItem: {
      date: '',
      phe: null
    },
    defaultItem: {
      date: '',
      phe: null
    },
    offlineInfo: false
  }),
  methods: {
    signInGoogle() {
      const store = useStore()
      if (navigator.onLine) {
        store.signInGoogle()
      } else {
        this.offlineInfo = true
      }
    },
    signInFacebook() {
      const store = useStore()
      if (navigator.onLine) {
        store.signInFacebook()
      } else {
        this.offlineInfo = true
      }
    },
    editItem(item) {
      this.editedIndex = this.pheDiary.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
      this.dialog = true
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
      this.dialog = false
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
          this.alert = true
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
    },
    exportDailyPheTotals() {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Date,Total Phe\n'

      this.pheDiary.forEach((diaryEntry) => {
        const date = formatISO(parseISO(diaryEntry.date), { representation: 'date' })
        const row = `${date},${diaryEntry.phe}\n`
        csvContent += row
      })
      this.triggerDownload(csvContent)
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
.tr-edit {
  cursor: pointer;
}

.v-theme--dark.v-toolbar.v-sheet {
  background-color: #121212;
}

.food-icon {
  vertical-align: bottom;
}

.v-theme--light.v-data-table {
  background-color: #fafafa;
}

.v-btn {
  text-transform: none;
}

.v-theme--dark.table-read-only {
  background-color: #2e2e2e;
}

.tr-read-only:hover {
  background-color: inherit !important;
}
</style>
