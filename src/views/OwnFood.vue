<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push, remove, update } from 'firebase/database'
import foodIcons from '../components/data/food-icons.json'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { BadgeCheck } from 'lucide-vue-next'

import PageHeader from '../components/PageHeader.vue'
import DataTable from '../components/DataTable.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import ModalDialog from '../components/ModalDialog.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()
const dialog = ref(null)
const dialog2 = ref(null)
const publicPath = import.meta.env.BASE_URL

// Reactive state
const editedIndex = ref(-1)
const editedKey = ref(null)
const weight = ref(100)

const defaultItem = {
  name: '',
  icon: null,
  phe: null
}

const editedItem = ref({ ...defaultItem })

// Computed properties
const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const ownFood = computed(() => store.ownFood)
const settings = computed(() => store.settings)

const license = computed(
  () => settings.value.license === import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
)

const tableHeaders = computed(() => [
  { key: 'food', title: t('common.food') },
  { key: 'phe', title: t('common.phe') }
])

const formTitle = computed(() => {
  return editedIndex.value === -1 ? t('common.add') : t('common.edit')
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

const editItem = () => {
  dialog2.value.closeDialog()
  dialog.value.openDialog()
}

const deleteItem = () => {
  const db = getDatabase()
  remove(dbRef(db, `${user.value.id}/ownFood/${editedKey.value}`))
  closeModal()
}

const closeModal = () => {
  dialog.value.closeDialog()
  dialog2.value.closeDialog()
  editedItem.value = { ...defaultItem }
  editedIndex.value = -1
  editedKey.value = null
}

const save = () => {
  const db = getDatabase()
  if (editedIndex.value > -1) {
    update(dbRef(db, `${user.value.id}/ownFood/${editedKey.value}`), {
      name: editedItem.value.name,
      icon: editedItem.value.icon || null,
      phe: Number(editedItem.value.phe)
    })
  } else {
    if (
      ownFood.value.length >= 250 &&
      settings.value.license !== import.meta.env.VITE_PKU_TOOLS_LICENSE_KEY
    ) {
      alert(t('own-food.limit'))
    } else {
      push(dbRef(db, `${user.value.id}/ownFood`), {
        name: editedItem.value.name,
        icon: editedItem.value.icon || null,
        phe: Number(editedItem.value.phe)
      })
    }
  }
  closeModal()
}

const addItem = (item) => {
  weight.value = 100
  editedIndex.value = ownFood.value.indexOf(item)
  editedKey.value = item['.key']
  editedItem.value = { ...item }
  dialog2.value.openDialog()
}

const calculatePhe = () => {
  return Math.round((weight.value * editedItem.value.phe) / 100)
}

const add = () => {
  const db = getDatabase()
  push(dbRef(db, `${user.value.id}/pheLog`), {
    name: editedItem.value.name,
    icon: editedItem.value.icon || null,
    pheReference: editedItem.value.phe,
    weight: Number(weight.value),
    phe: calculatePhe()
  })
  dialog2.value.closeDialog()
  router.push('/')
}

const escapeCSV = (value) => {
  if (value === null || value === undefined) return ''
  return `"${value.toString().replace(/"/g, '""')}"`
}

const exportOwnFood = () => {
  let r = confirm(t('common.export') + '?')
  if (r === true) {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Name,Phe per 100g\n'

    ownFood.value.forEach((entry) => {
      const row = [escapeCSV(entry.name), escapeCSV(entry.phe)].join(',') + '\n'
      csvContent += row
    })
    triggerDownload(csvContent)
  }
}

const triggerDownload = (csvContent) => {
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', t('own-food.export-filename') + '.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const setIcon = (item, close) => {
  editedItem.value.icon = item.svg
  close()
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('own-food.title')" />
    </header>

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
      <p class="mb-6">{{ $t('own-food.search-info') }}</p>

      <DataTable :headers="tableHeaders" class="mb-8">
        <tr
          v-for="(item, index) in ownFood"
          :key="index"
          @click="addItem(item)"
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
              v-if="item.icon === undefined || item.icon === ''"
              width="25"
              class="food-icon"
              alt="Food Icon"
            />
            {{ item.name }}
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
        @close="closeModal"
      >
        <Popover>
          <PopoverButton class="mt-1">
            <img
              :src="publicPath + 'img/food-icons/' + editedItem.icon + '.svg'"
              v-if="editedItem.icon !== undefined && editedItem.icon !== null"
              width="30"
              class="food-icon float-left"
              alt="Food Icon"
            />
            <img
              :src="publicPath + 'img/food-icons/organic-food.svg'"
              v-if="editedItem.icon === undefined || editedItem.icon === null"
              width="30"
              class="food-icon float-left"
              alt="Food Icon"
            />
            <span class="float-left my-1 ml-2 text-sm">{{ $t('own-food.choose-icon') }}</span>
          </PopoverButton>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <PopoverPanel v-slot="{ close }">
              <span v-for="(item, index) in foodIcons" :key="index">
                <img
                  :src="publicPath + 'img/food-icons/' + item.svg + '.svg'"
                  v-if="item.svg !== undefined"
                  width="35"
                  class="food-icon pick-icon m-2"
                  alt="Food Icon"
                  @click="setIcon(item, close)"
                />
              </span>
            </PopoverPanel>
          </transition>
        </Popover>

        <TextInput
          id-name="food"
          :label="$t('common.food-name')"
          v-model="editedItem.name"
          class="mt-2"
        />
        <NumberInput
          id-name="phe"
          :label="$t('common.phe-per-100g')"
          v-model.number="editedItem.phe"
        />
      </ModalDialog>

      <SecondaryButton :text="$t('common.export')" @click="exportOwnFood" />

      <p v-if="!license" class="mt-3">
        {{ $t('own-food.note') }}
        <a href="https://buymeacoffee.com/andrereus" target="_blank" class="text-sky-500"
          >PKU Tools Unlimited</a
        >.
      </p>
      <p v-if="license" class="mt-3 text-sm">
        <BadgeCheck class="h-5 w-5 text-sky-500 inline-block mr-1" aria-hidden="true" />
        {{ $t('own-food.unlimited') }}
      </p>

      <ModalDialog
        ref="dialog2"
        :title="editedItem.name"
        :buttons="[
          { label: $t('common.add'), type: 'submit', visible: true },
          { label: $t('common.edit'), type: 'edit', visible: true },
          { label: $t('common.cancel'), type: 'close', visible: true }
        ]"
        @submit="add"
        @edit="editItem"
        @close="closeModal"
      >
        <NumberInput id-name="weight" :label="$t('common.weight-in-g')" v-model.number="weight" />
        <p class="text-xl">= {{ calculatePhe() }} mg Phe</p>
      </ModalDialog>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.food-icon {
  vertical-align: bottom;
  display: inline-block;
}

.pick-icon {
  cursor: pointer;
}
</style>
