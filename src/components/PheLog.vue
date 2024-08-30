<template>
  <div>
    <div v-if="userIsAuthenticated">
      <div class="t-block t-mb-6">
        <nav class="t-flex t-space-x-4" aria-label="Tabs">
          <RouterLink
            to="/"
            class="t-bg-gray-100 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-bg-gray-700 dark:t-text-gray-300"
            aria-current="page"
            >{{ $t('phe-log.tab-title') }}</RouterLink
          >
          <RouterLink
            to="/phe-diary"
            class="t-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
            >{{ $t('phe-diary.tab-title') }}</RouterLink
          >
        </nav>
      </div>

      <p v-if="lastAdded.length === 0">
        {{ $t('phe-log.info') }}
      </p>

      <v-sheet v-if="lastAdded" class="mb-6 t-bg-transparent">
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

      <DataTable :headers="tableHeaders" class="t-mb-8">
        <tr
          v-for="(item, index) in pheLog"
          :key="index"
          @click="editItem(item)"
          class="t-cursor-pointer"
        >
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
            {{ item.weight }}
          </td>
          <td
            class="t-whitespace-nowrap t-px-3 t-py-4 t-text-sm t-text-gray-500 dark:t-text-gray-400"
          >
            {{ item.phe }}
          </td>
        </tr>
      </DataTable>

      <PrimaryButton :text="$t('phe-log.save-day')" @click="$refs.dialog.openDialog()" />

      <ModalDialog
        ref="dialog"
        :title="$t('phe-log.save-day')"
        :buttons="[
          { label: $t('common.save'), type: 'submit', visible: true },
          { label: $t('common.cancel'), type: 'simpleClose', visible: true }
        ]"
        @submit="saveResult"
      >
        <DateInput id-name="date" :label="$t('phe-diary.date')" v-model="date" class="t-mb-6" />
      </ModalDialog>

      <SecondaryButton :text="$t('phe-log.quick-note')" @click="$refs.dialog2.openDialog()" />

      <ModalDialog
        ref="dialog2"
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
          :label="$t('common.weight-in-g')"
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
      </ModalDialog>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push, remove, update } from 'firebase/database'
import foodIcons from './data/food-icons.json'
import { format } from 'date-fns'
import { mdiLock, mdiLockOpenVariant } from '@mdi/js'

import DataTable from '../components/DataTable.vue'
import ModalDialog from '../components/ModalDialog.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import DateInput from '../components/DateInput.vue'

export default {
  name: 'PheLog',
  components: {
    DataTable,
    ModalDialog,
    PrimaryButton,
    SecondaryButton,
    DateInput
  },
  data: () => ({
    mdiLock,
    mdiLockOpenVariant,
    publicPath: import.meta.env.BASE_URL,
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
    lockedValues: false,
    foodIcons,
    data: ''
  }),
  methods: {
    editItem(item) {
      this.editedIndex = this.pheLog.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
      this.lockValues()
      this.$refs.dialog2.openDialog()
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
      this.$refs.dialog2.closeDialog()
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
        alert(this.$t('phe-diary.limit'))
      } else {
        const pheLogForFirebase = this.pheLog.map(
          ({
            // eslint-disable-next-line no-unused-vars
            '.key': key,
            ...itemWithoutKey
          }) => itemWithoutKey
        )
        push(ref(db, `${this.user.id}/pheDiary`), {
          date: this.date,
          phe: this.pheResult,
          log: pheLogForFirebase
        }).then(() => {
          remove(ref(db, `${this.user.id}/pheLog`))
        })
        this.$router.push('phe-diary')
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  },
  created() {
    this.date = format(new Date(), 'yyyy-MM-dd')
  },
  computed: {
    tableHeaders() {
      return [
        { key: 'food', title: this.$t('common.food') },
        { key: 'weight', title: this.$t('common.weight') },
        { key: 'phe', title: this.$t('common.phe') }
      ]
    },
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
      // Get the food items from the last 2 diary entries that have a log
      return []
        .concat(
          ...this.pheDiary
            .filter((obj) => Array.isArray(obj.log))
            .slice(-2)
            .map((obj) => obj.log)
        )
        .reverse()
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
.food-icon {
  vertical-align: bottom;
  display: inline-block;
}

.pick-icon {
  cursor: pointer;
}

.v-btn {
  text-transform: none;
}
</style>
