<template>
  <div>
    <header>
      <PageHeader :title="$t('own-food.title')" />
    </header>

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
      <p class="t-mb-6">{{ $t('own-food.search-info') }}</p>

      <DataTable :headers="tableHeaders" class="t-mb-8">
        <tr
          v-for="(item, index) in ownFood"
          :key="index"
          @click="addItem(item)"
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
              v-if="item.icon === undefined || item.icon === ''"
              width="25"
              class="food-icon"
              alt="Food Icon"
            />
            {{ item.name }}
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
        @close="closeModal"
      >
        <Popover>
          <PopoverButton class="t-mt-1">
            <img
              :src="publicPath + 'img/food-icons/' + editedItem.icon + '.svg'"
              v-if="editedItem.icon !== undefined && editedItem.icon !== null"
              width="30"
              class="food-icon t-float-left"
              alt="Food Icon"
            />
            <img
              :src="publicPath + 'img/food-icons/organic-food.svg'"
              v-if="editedItem.icon === undefined || editedItem.icon === null"
              width="30"
              class="food-icon t-float-left"
              alt="Food Icon"
            />
            <span class="t-float-left t-my-1 t-ml-2 t-text-sm">{{
              $t('own-food.choose-icon')
            }}</span>
          </PopoverButton>

          <transition
            enter-active-class="t-transition t-ease-out t-duration-200"
            enter-from-class="t-transform t-opacity-0 t-scale-95"
            enter-to-class="t-transform t-opacity-100 t-scale-100"
            leave-active-class="t-transition t-ease-in t-duration-75"
            leave-from-class="t-transform t-opacity-100 t-scale-100"
            leave-to-class="t-transform t-opacity-0 t-scale-95"
          >
            <PopoverPanel v-slot="{ close }">
              <span v-for="(item, index) in foodIcons" :key="index">
                <img
                  :src="publicPath + 'img/food-icons/' + item.svg + '.svg'"
                  v-if="item.svg !== undefined"
                  width="35"
                  class="food-icon pick-icon t-m-2"
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
          class="t-mt-2"
        />
        <NumberInput
          id-name="phe"
          :label="$t('common.phe-per-100g')"
          v-model.number="editedItem.phe"
        />
      </ModalDialog>

      <SecondaryButton :text="$t('common.export')" @click="exportOwnFood" />

      <p class="t-mt-3">{{ $t('own-food.note') }}</p>

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
        <p class="t-text-xl">= {{ calculatePhe() }} mg Phe</p>
      </ModalDialog>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push, remove, update } from 'firebase/database'
import foodIcons from '../components/data/food-icons.json'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import PageHeader from '../components/PageHeader.vue'
import DataTable from '../components/DataTable.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import ModalDialog from '../components/ModalDialog.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'

export default {
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    PageHeader,
    DataTable,
    SecondaryButton,
    ModalDialog,
    PrimaryButton,
    TextInput,
    NumberInput
  },
  data: () => ({
    publicPath: import.meta.env.BASE_URL,
    editedIndex: -1,
    editedKey: null,
    editedItem: {
      name: '',
      icon: null,
      phe: null
    },
    defaultItem: {
      name: '',
      icon: null,
      phe: null
    },
    weight: 100,
    foodIcons
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
    editItem() {
      this.$refs.dialog2.closeDialog()
      this.$refs.dialog.openDialog()
    },
    deleteItem() {
      const db = getDatabase()
      remove(ref(db, `${this.user.id}/ownFood/${this.editedKey}`))
      this.closeModal()
    },
    closeModal() {
      this.$refs.dialog.closeDialog()
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
        update(ref(db, `${this.user.id}/ownFood/${this.editedKey}`), {
          name: this.editedItem.name,
          icon: this.editedItem.icon || null,
          phe: Number(this.editedItem.phe)
        })
      } else {
        if (this.ownFood.length >= 500) {
          alert(this.$t('own-food.limit'))
        } else {
          push(ref(db, `${this.user.id}/ownFood`), {
            name: this.editedItem.name,
            icon: this.editedItem.icon || null,
            phe: Number(this.editedItem.phe)
          })
        }
      }
      this.closeModal()
    },
    addItem(item) {
      this.weight = 100
      this.editedIndex = this.ownFood.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
      this.$refs.dialog2.openDialog()
    },
    calculatePhe() {
      return Math.round((this.weight * this.editedItem.phe) / 100)
    },
    add() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.editedItem.name,
        icon: this.editedItem.icon || null,
        pheReference: this.editedItem.phe,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.$refs.dialog2.closeDialog()
      this.$router.push('/')
    },
    exportOwnFood() {
      let r = confirm(this.$t('common.export') + '?')
      if (r === true) {
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += 'Name,Phe per 100g\n'

        this.ownFood.forEach((entry) => {
          const row = `${entry.name},${entry.phe}\n`
          csvContent += row
        })
        this.triggerDownload(csvContent)
      }
    },
    triggerDownload(csvContent) {
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', this.$t('own-food.export-filename') + '.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    setIcon(item, close) {
      this.editedItem.icon = item.svg
      close()
    }
  },
  computed: {
    tableHeaders() {
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
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    },
    ownFood() {
      const store = useStore()
      return store.ownFood
    },
    pheLog() {
      const store = useStore()
      return store.pheLog
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
</style>
