<template>
  <div>
    <div v-if="userIsAuthenticated">
      <v-btn
        size="small"
        variant="flat"
        color="btnsecondary"
        to="/phe-calculator"
        class="mr-3 mb-3"
        :icon="mdiCalculator"
      >
      </v-btn>
      <v-btn
        size="small"
        variant="flat"
        color="btnsecondary"
        to="/protein-calculator"
        class="mr-3 mb-3"
        :icon="mdiCalculatorVariant"
      >
      </v-btn>
      <v-btn
        size="small"
        variant="flat"
        color="btnsecondary"
        to="/barcode-scanner"
        class="mr-3 mb-3"
        :icon="mdiBarcodeScan"
      >
      </v-btn>
      <v-btn
        size="small"
        variant="flat"
        color="btnsecondary"
        to="/own-food"
        class="mr-3 mb-3"
        :icon="mdiFoodApple"
      >
      </v-btn>

      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ props }">
          <v-btn variant="flat" rounded color="btnsecondary" class="mr-3 mb-3" v-bind="props">
            <v-icon start>{{ mdiPen }}</v-icon>
            {{ $t('phe-log.quick-note') }}
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="text-h5 mt-4">
            {{ formTitle }}
          </v-card-title>

          <v-card-text>
            <v-text-field label="Name" v-model="editedItem.name">
              <template v-slot:append>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn variant="plain" rounded color="btnsecondary" v-bind="props">
                      <img
                        :src="publicPath + 'img/food-icons/' + editedItem.icon + '.svg'"
                        v-if="editedItem.icon !== undefined && editedItem.icon !== null"
                        width="40"
                        class="food-icon"
                        alt="Food Icon"
                      />
                      <img
                        :src="publicPath + 'img/food-icons/organic-food.svg'"
                        v-if="editedItem.icon === undefined || editedItem.icon === null"
                        width="40"
                        class="food-icon"
                        alt="Food Icon"
                      />
                    </v-btn>
                  </template>
                  <v-card max-width="300" max-height="250" class="overflow-y-auto">
                    <span v-for="(item, index) in foodIcons" :key="index" class="px-1">
                      <img
                        :src="publicPath + 'img/food-icons/' + item.svg + '.svg'"
                        v-if="item.svg !== undefined"
                        width="40"
                        class="food-icon pick-icon"
                        alt="Icon Picker"
                        @click="editedItem.icon = item.svg"
                      />
                    </span>
                  </v-card>
                </v-menu>
              </template>
            </v-text-field>

            <v-text-field
              :label="$t('phe-log.weight')"
              :model-value="editedItem.weight"
              @keyup="editWeight"
              type="number"
              :append-icon="lockedValues ? mdiLock : mdiLockOpenVariant"
              @click:append="lockValues"
            ></v-text-field>

            <v-text-field
              label="Phe (in mg)"
              :model-value="editedItem.phe"
              @keyup="editPhe"
              type="number"
              :append-icon="lockedValues ? mdiLock : mdiLockOpenVariant"
              @click:append="lockValues"
            ></v-text-field>

            <p class="mb-6">
              <v-icon size="small">{{ mdiLock }}</v-icon> = {{ $t('phe-log.lock-info') }}
            </p>
          </v-card-text>

          <v-card-actions class="mt-n6">
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="save">{{ $t('common.save') }}</v-btn>
            <v-btn variant="flat" color="warning" v-if="editedIndex !== -1" @click="deleteItem()">
              {{ $t('common.delete') }}
            </v-btn>
            <v-btn variant="flat" color="btnsecondary" @click="close">{{
              $t('common.cancel')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-sheet v-if="lastAdded" class="mt-3 mb-4">
        <v-slide-group>
          <v-slide-group-item v-for="(item, index) in lastAdded" :key="index">
            <v-btn
              size="small"
              variant="flat"
              rounded
              color="btnsecondary"
              class="mr-1 mb-2"
              @click="addLastAdded(item)"
            >
              + {{ item.weight }}g
              {{ item.name.length > 15 ? item.name.slice(0, 14) + '…' : item.name }}
            </v-btn>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>

      <v-data-table-virtual
        :headers="$i18n.locale === 'en' ? headersEn : headersDe"
        :items="pheLog"
      >
        <template v-slot:item="{ item }">
          <tr @click="editItem(item)" class="tr-edit">
            <td class="text-start">
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
            <td class="text-start">{{ item.weight }}</td>
            <td class="text-start">{{ item.phe }}</td>
          </tr>
        </template>
      </v-data-table-virtual>

      <v-progress-linear
        :model-value="(pheResult * 100) / (settings?.maxPhe || 0)"
        height="15"
        class="mt-8"
        rounded
      ></v-progress-linear>

      <p class="text-h6 font-weight-regular mt-6">
        {{ $t('phe-log.total') }}: {{ pheResult }} mg Phe
      </p>
      <p class="mt-1 mb-7">
        {{ $t('phe-log.remaining') }}: {{ (settings?.maxPhe || 0) - pheResult }} mg Phe
      </p>

      <v-btn variant="flat" rounded color="primary" class="mr-3 mb-3" @click="saveResult">
        {{ $t('phe-log.save-day') }}
      </v-btn>

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
import foodIcons from './data/food-icons.json'
import { format } from 'date-fns'
import confetti from 'canvas-confetti'
import {
  mdiGoogle,
  mdiFacebook,
  mdiMagnify,
  mdiCalculator,
  mdiCalculatorVariant,
  mdiFoodApple,
  mdiLock,
  mdiLockOpenVariant,
  mdiBarcodeScan,
  mdiPen,
  mdiPlus
} from '@mdi/js'

export default {
  name: 'PheLog',
  data: () => ({
    mdiGoogle,
    mdiFacebook,
    mdiMagnify,
    mdiCalculator,
    mdiCalculatorVariant,
    mdiFoodApple,
    mdiLock,
    mdiLockOpenVariant,
    mdiBarcodeScan,
    mdiPen,
    mdiPlus,
    publicPath: import.meta.env.BASE_URL,
    dialog: false,
    alert: false,
    headersEn: [
      {
        title: 'Name',
        align: 'start',
        key: 'name'
      },
      { title: 'Weight', key: 'weight' },
      { title: 'Phe', key: 'phe' }
    ],
    headersDe: [
      {
        title: 'Name',
        align: 'start',
        key: 'name'
      },
      { title: 'Gewicht', key: 'weight' },
      { title: 'Phe', key: 'phe' }
    ],
    editedIndex: -1,
    editedKey: null,
    editedItem: {
      name: '',
      emoji: null,
      icon: null,
      weight: null,
      phe: null
    },
    defaultItem: {
      name: '',
      emoji: null,
      icon: null,
      weight: null,
      phe: null
    },
    offlineInfo: false,
    lockedValues: false,
    foodIcons
  }),
  methods: {
    editItem(item) {
      this.editedIndex = this.pheLog.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
      this.lockValues()
      this.dialog = true
    },
    addLastAdded(item) {
      this.editedItem = Object.assign({}, item)
      this.save()
    },
    deleteItem() {
      const db = getDatabase()
      remove(ref(db, `${this.user.id}/pheLog/${this.editedKey}`))
      this.close()
    },
    close() {
      this.lockedValues = false
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
        update(ref(db, `${this.user.id}/pheLog/${this.editedKey}`), {
          name: this.editedItem.name,
          icon: this.editedItem.icon || null,
          weight: Number(this.editedItem.weight),
          phe: Number(this.editedItem.phe)
        })
      } else {
        push(ref(db, `${this.user.id}/pheLog`), {
          name: this.editedItem.name,
          emoji: this.editedItem.emoji || null,
          icon: this.editedItem.icon || null,
          weight: Number(this.editedItem.weight),
          phe: Number(this.editedItem.phe)
        })
      }
      this.close()
    },
    lockValues() {
      if (this.lockedValues === false) {
        this.editedItem.weight = Number(this.editedItem.weight)
        this.editedItem.phe = Number(this.editedItem.phe)
        this.lockedWeight = this.editedItem.weight
        this.lockedPhe = this.editedItem.phe
        this.lockedValues = true
      } else {
        this.lockedValues = false
      }
    },
    editWeight(event) {
      if (this.lockedValues === true) {
        const newWeight = Number(event.target.value)
        this.editedItem.phe = Math.round((newWeight * this.lockedPhe) / this.lockedWeight)
        this.editedItem.weight = newWeight
      } else {
        this.editedItem.weight = event.target.value
      }
    },
    editPhe(event) {
      if (this.lockedValues === true) {
        const newPhe = Number(event.target.value)
        this.editedItem.weight = Math.round((newPhe * this.lockedWeight) / this.lockedPhe)
        this.editedItem.phe = newPhe
      } else {
        this.editedItem.phe = event.target.value
      }
    },
    saveResult() {
      const db = getDatabase()
      if (this.pheDiary.length >= 100) {
        this.alert = true
      } else {
        confetti()
        setTimeout(() => {
          let r = confirm(this.$t('phe-log.save-diary') + '?')
          if (r === true) {
            const pheLogForFirebase = this.pheLog.map(
              ({
                // eslint-disable-next-line no-unused-vars
                '.key': key,
                ...itemWithoutKey
              }) => itemWithoutKey
            )
            push(ref(db, `${this.user.id}/pheDiary`), {
              date: format(new Date(), 'yyyy-MM-dd'),
              phe: this.pheResult,
              log: pheLogForFirebase
            }).then(() => {
              remove(ref(db, `${this.user.id}/pheLog`))
            })
            this.$router.push('phe-diary')
          }
        }, 600)
      }
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
        return this.$t('phe-log.quick-note')
      } else {
        return this.$t('common.edit')
      }
    },
    pheResult() {
      let phe = 0
      this.pheLog.forEach((item) => {
        phe += item.phe
      })
      return Math.round(phe)
    },
    lastAdded() {
      // Get last 2 objects, extract and concatenate "log" arrays, and reverse order.
      return [].concat(...this.pheDiary.slice(-2).map((obj) => obj.log)).reverse()
    },
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    },
    pheLog() {
      const store = useStore()
      return store.pheLog
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
  display: inline-block;
}

.pick-icon {
  cursor: pointer;
}

.v-theme--light.v-data-table {
  background-color: #fafafa;
}

.v-btn {
  text-transform: none;
}
</style>
