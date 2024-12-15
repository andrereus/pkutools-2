<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push, remove, update } from 'firebase/database'
import { format } from 'date-fns'

import DataTable from './DataTable.vue'
import ModalDialog from './ModalDialog.vue'
import PrimaryButton from './PrimaryButton.vue'
import SecondaryButton from './SecondaryButton.vue'
import DateInput from './DateInput.vue'
import TextInput from './TextInput.vue'
import NumberInput from './NumberInput.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()
const dialog = ref(null)
const dialog2 = ref(null)
const publicPath = import.meta.env.BASE_URL

// Reactive state
const editedIndex = ref(-1)
const editedKey = ref(null)
const date = ref(format(new Date(), 'yyyy-MM-dd'))
const visibleItems = ref(5)

const defaultItem = {
  name: '',
  emoji: null,
  icon: null,
  pheReference: null,
  weight: null,
  phe: null
}

const editedItem = ref({ ...defaultItem })

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const pheLog = computed(() => store.pheLog)
const pheDiary = computed(() => store.pheDiary)
const settings = computed(() => store.settings)

const tableHeaders = computed(() => [
  { key: 'food', title: t('common.food') },
  { key: 'weight', title: t('common.weight') },
  { key: 'phe', title: t('common.phe') }
])

const formTitle = computed(() => {
  return editedIndex.value === -1 ? t('common.add') : t('common.edit')
})

const pheResult = computed(() => {
  let phe = 0
  pheLog.value.forEach((item) => {
    phe += item.phe
  })
  return Math.round(phe)
})

const lastAdded = computed(() => {
  // Get the food items from the last diary entries that have a log
  const lastEntries = pheDiary.value
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

const showMoreItems = () => {
  visibleItems.value += 5
}

const calculatePhe = () => {
  return Math.round((editedItem.value.weight * editedItem.value.pheReference) / 100) || 0
}

const editItem = (item) => {
  editedIndex.value = pheLog.value.indexOf(item)
  editedKey.value = item['.key']
  editedItem.value = Object.assign({}, item)
  dialog2.value.openDialog()
}

const addLastAdded = (item) => {
  editedItem.value = Object.assign({}, item)
  dialog2.value.openDialog()
}

const deleteItem = () => {
  const db = getDatabase()
  remove(dbRef(db, `${user.value.id}/pheLog/${editedKey.value}`))
  close()
}

const close = () => {
  dialog2.value.closeDialog()
  editedItem.value = Object.assign({}, defaultItem)
  editedIndex.value = -1
  editedKey.value = null
}

const save = () => {
  const db = getDatabase()
  if (editedIndex.value > -1) {
    update(dbRef(db, `${user.value.id}/pheLog/${editedKey.value}`), {
      name: editedItem.value.name,
      icon: editedItem.value.icon || null,
      pheReference: Number(editedItem.value.pheReference) || 0,
      weight: Number(editedItem.value.weight),
      phe: calculatePhe()
    })
  } else {
    push(dbRef(db, `${user.value.id}/pheLog`), {
      name: editedItem.value.name,
      emoji: editedItem.value.emoji || null,
      icon: editedItem.value.icon || null,
      pheReference: Number(editedItem.value.pheReference) || 0,
      weight: Number(editedItem.value.weight),
      phe: calculatePhe()
    })
  }
  close()
}

const saveResult = () => {
  const db = getDatabase()
  if (
    pheDiary.value.length >= 100 &&
    settings.value.license !== import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
  ) {
    alert(t('phe-diary.limit'))
  } else {
    const pheLogForFirebase = pheLog.value.map(
      ({
        // eslint-disable-next-line no-unused-vars
        '.key': key,
        ...itemWithoutKey
      }) => itemWithoutKey
    )
    push(dbRef(db, `${user.value.id}/pheDiary`), {
      date: date.value,
      phe: pheResult.value,
      log: pheLogForFirebase
    }).then(() => {
      remove(dbRef(db, `${user.value.id}/pheLog`))
    })
    router.push('phe-diary')
  }
}
</script>

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
        <p v-if="!editedItem.pheReference && editedIndex !== -1" class="mb-3">
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

<style lang="scss" scoped>
.food-icon {
  vertical-align: bottom;
  display: inline-block;
}
</style>
