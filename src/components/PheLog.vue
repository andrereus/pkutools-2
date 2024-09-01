<template>
  <div>
    <div v-if="userIsAuthenticated">
      <div class="t-block t-mb-6">
        <nav class="t-flex t-space-x-4" aria-label="Tabs">
          <RouterLink
            to="/"
            class="t-bg-black/5 dark:t-bg-white/15 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
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

      <p v-if="lastAdded.length === 0">
        {{ $t('phe-log.info') }}
      </p>

      <div v-if="lastAdded" class="t-mb-6">
        <SecondaryButton
          v-for="(item, index) in lastAdded"
          :key="index"
          :text="`${item.weight}g ${item.name.length > 15 ? item.name.slice(0, 14) + '…' : item.name}`"
          @click="addLastAdded(item)"
          class="t-text-xs t-font-normal"
        />
      </div>

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
        <DateInput id-name="date" :label="$t('phe-diary.date')" v-model="date" />
      </ModalDialog>

      <SecondaryButton :text="$t('common.add')" @click="$refs.dialog2.openDialog()" />

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
        <p v-if="!editedItem.pheReference && this.editedIndex !== -1" class="t-mb-3">
          {{ $t('phe-log.data-warning') }}
        </p>
        <TextInput id-name="food" :label="$t('common.food-name')" v-model="editedItem.name" />
        <NumberInput
          id-name="phe"
          :label="$t('common.phe-per-100g')"
          v-model.number="editedItem.pheReference"
        />
        <NumberInput
          id-name="weight"
          :label="$t('common.consumed-weight')"
          v-model.number="editedItem.weight"
        />
        <p class="t-text-xl t-my-6">= {{ calculatePhe() }} mg Phe</p>
      </ModalDialog>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push, remove, update } from 'firebase/database'
import { format } from 'date-fns'

import DataTable from '../components/DataTable.vue'
import ModalDialog from '../components/ModalDialog.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import DateInput from '../components/DateInput.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'

export default {
  name: 'PheLog',
  components: {
    DataTable,
    ModalDialog,
    PrimaryButton,
    SecondaryButton,
    DateInput,
    TextInput,
    NumberInput
  },
  data: () => ({
    publicPath: import.meta.env.BASE_URL,
    editedIndex: -1,
    editedKey: null,
    editedItem: {
      name: '',
      emoji: null,
      icon: null,
      pheReference: null,
      weight: null,
      phe: null
    },
    defaultItem: {
      name: '',
      emoji: null,
      icon: null,
      pheReference: null,
      weight: null,
      phe: null
    },
    data: ''
  }),
  methods: {
    calculatePhe() {
      return Math.round((this.editedItem.weight * this.editedItem.pheReference) / 100) || 0
    },
    editItem(item) {
      this.editedIndex = this.pheLog.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
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
          pheReference: Number(this.editedItem.pheReference) || 0,
          weight: Number(this.editedItem.weight),
          phe: this.calculatePhe()
        })
      } else {
        push(ref(db, `${this.user.id}/pheLog`), {
          name: this.editedItem.name,
          emoji: this.editedItem.emoji || null,
          icon: this.editedItem.icon || null,
          pheReference: Number(this.editedItem.pheReference) || 0,
          weight: Number(this.editedItem.weight),
          phe: this.calculatePhe()
        })
      }
      this.close()
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
        return this.$t('common.add')
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
</style>
