<template>
  <div>
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
      <DataTable :headers="tableHeaders" class="mb-8">
        <tr
          v-for="(item, index) in pheLog"
          :key="index"
          @click="editItem(item)"
          class="cursor-pointer"
        >
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
            {{ item.weight }}
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
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
        <p v-if="!editedItem.pheReference && this.editedIndex !== -1" class="mb-3">
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
        <p class="text-xl my-6">= {{ calculatePhe() }} mg Phe</p>
      </ModalDialog>

      <p v-if="lastAdded.length === 0" class="mt-3">
        {{ $t('phe-log.info') }}
      </p>

      <div v-if="lastAdded.length !== 0" class="mt-3">
        <SecondaryButton
          v-for="(item, index) in lastAdded.slice(0, visibleItems)"
          :key="index"
          :text="`${item.weight}g ${item.name.length > 14 ? item.name.slice(0, 13) + '…' : item.name}`"
          @click="addLastAdded(item)"
          class="!t-font-normal"
        />
        <SecondaryButton
          v-if="visibleItems < lastAdded.length"
          :text="$t('phe-log.more')"
          @click="showMoreItems"
        />
      </div>
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
    data: '',
    visibleItems: 5
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
    showMoreItems() {
      this.visibleItems += 5
    },
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
      this.$refs.dialog2.openDialog()
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
      if (
        this.pheDiary.length >= 100 &&
        this.settings.license !== import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
      ) {
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
      // Get the food items from the last diary entries that have a log
      const lastEntries = this.pheDiary
        .filter((obj) => Array.isArray(obj.log))
        .slice(-5)
        .map((obj) => obj.log)

      // Flatten and reverse the array to prioritize the most recent items
      const flattenedLogs = [].concat(...lastEntries).reverse()

      // Use a Map to filter out duplicates and keep track of their recency-weighted score
      const itemMap = new Map()

      flattenedLogs.forEach((item, index) => {
        const recencyWeight = flattenedLogs.length / (index + 1) // More recent items have higher weight
        if (itemMap.has(item.name)) {
          const entry = itemMap.get(item.name)
          entry.score += recencyWeight
        } else {
          itemMap.set(item.name, { ...item, score: recencyWeight })
        }
      })

      // Convert the Map back to an array and sort by combined score (recency-weighted frequency)
      const sortedItems = Array.from(itemMap.values()).sort((a, b) => b.score - a.score)

      // Limit to the top 10 items
      return sortedItems
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
