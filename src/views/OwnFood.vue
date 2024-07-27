<template>
  <div>
    <header>
      <h2 class="t-text-2xl t-text-gray-900 dark:t-text-gray-300 t-mb-6">
        {{ $t('own-food.title') }}
      </h2>
    </header>

    <div v-if="!userIsAuthenticated">
      <v-btn variant="flat" rounded color="btnsecondary" @click="signInGoogle" class="mt-2">
        <v-icon start>{{ mdiGoogle }}</v-icon>
        {{ $t('app.signin-google') }}
      </v-btn>
      <br />
      <v-btn variant="flat" rounded color="btnsecondary" to="/email-auth" class="mt-2">
        <v-icon start>{{ mdiEmail }}</v-icon>
        {{ $t('email-auth.title') }}
      </v-btn>
    </div>

    <div v-if="userIsAuthenticated">
      <p class="mb-6">{{ $t('own-food.search-info') }}</p>

      <v-data-table-virtual :headers="headers" :items="ownFood" class="mb-3">
        <template v-slot:item="{ item }">
          <tr @click="addItem(item)" class="tr-edit">
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
                v-if="item.icon === undefined || item.icon === ''"
                width="25"
                class="food-icon"
                alt="Food Icon"
              />
              {{ item.name }}
            </td>
            <td class="text-start">{{ item.phe }}</td>
          </tr>
        </template>
      </v-data-table-virtual>

      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ props }">
          <v-btn variant="flat" rounded color="primary" class="mr-3 mt-3" v-bind="props">
            {{ $t('common.add') }}
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
              :label="$t('own-food.phe')"
              v-model.number="editedItem.phe"
              type="number"
            ></v-text-field>
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

      <v-btn variant="flat" rounded color="btnsecondary" class="mr-3 mt-3" @click="exportOwnFood">
        {{ $t('own-food.export') }}
      </v-btn>

      <p class="text--secondary mt-5">
        <v-icon>{{ mdiInformationVariant }}</v-icon>
        {{ $t('own-food.note') }}
      </p>

      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title class="text-h5 mt-4">
            <img
              :src="publicPath + 'img/food-icons/' + editedItem.icon + '.svg'"
              v-if="editedItem.icon !== undefined"
              width="35"
              class="food-icon"
              alt="Food Icon"
            />
            <img
              :src="publicPath + 'img/food-icons/organic-food.svg'"
              v-if="editedItem.icon === undefined"
              width="35"
              class="food-icon"
              alt="Food Icon"
            />
            {{ editedItem.name }}
          </v-card-title>

          <v-card-text>
            <v-text-field
              :label="$t('own-food.weight')"
              v-model.number="weight"
              type="number"
              clearable
            ></v-text-field>
            <p class="text-h6 font-weight-regular">= {{ calculatePhe() }} mg Phe</p>
            <p class="mt-4 text-caption">{{ $t('phe-log.preview') }}</p>
            <v-progress-linear
              :model-value="((pheResult + calculatePhe()) * 100) / (settings?.maxPhe || 0)"
              height="6"
              class="mt-3 mb-8"
              rounded
            ></v-progress-linear>
          </v-card-text>

          <v-card-actions class="mt-n6">
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="add">
              {{ $t('common.add') }}
            </v-btn>
            <v-btn variant="flat" color="btnsecondary" @click="editItem()">{{
              $t('common.edit')
            }}</v-btn>
            <v-btn variant="flat" color="btnsecondary" @click="dialog2 = false">{{
              $t('common.cancel')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="alert" max-width="300">
        <v-card>
          <v-card-title>{{ $t('common.note') }}</v-card-title>
          <v-card-text>{{ $t('own-food.limit') }}</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="alert = false">{{
              $t('common.ok')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push, remove, update } from 'firebase/database'
import foodIcons from '../components/data/food-icons.json'
import { mdiGoogle, mdiInformationVariant, mdiEmail } from '@mdi/js'

export default {
  data: () => ({
    mdiGoogle,
    mdiInformationVariant,
    mdiEmail,
    publicPath: import.meta.env.BASE_URL,
    dialog: false,
    dialog2: false,
    alert: false,
    menu: false,
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'name'
      },
      { title: 'Phe', key: 'phe' }
    ],
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
      this.dialog2 = false
      this.dialog = true
    },
    deleteItem() {
      const db = getDatabase()
      remove(ref(db, `${this.user.id}/ownFood/${this.editedKey}`))
      this.close()
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
        update(ref(db, `${this.user.id}/ownFood/${this.editedKey}`), {
          name: this.editedItem.name,
          icon: this.editedItem.icon || null,
          phe: Number(this.editedItem.phe)
        })
      } else {
        if (this.ownFood.length >= 500) {
          this.alert = true
        } else {
          push(ref(db, `${this.user.id}/ownFood`), {
            name: this.editedItem.name,
            icon: this.editedItem.icon || null,
            phe: Number(this.editedItem.phe)
          })
        }
      }
      this.close()
    },
    addItem(item) {
      this.weight = 100
      this.editedIndex = this.ownFood.indexOf(item)
      this.editedKey = item['.key']
      this.editedItem = Object.assign({}, item)
      this.dialog2 = true
    },
    calculatePhe() {
      return Math.round((this.weight * this.editedItem.phe) / 100)
    },
    add() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.editedItem.name,
        icon: this.editedItem.icon || null,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.dialog2 = false
      this.$router.push('/')
    },
    exportOwnFood() {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Name,Phe per 100g\n'

      this.ownFood.forEach((entry) => {
        const row = `${entry.name},${entry.phe}\n`
        csvContent += row
      })
      this.triggerDownload(csvContent)
    },
    triggerDownload(csvContent) {
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', this.$t('own-food.export-filename') + '.csv')
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
    pheResult() {
      let phe = 0
      this.pheLog.forEach((item) => {
        phe += item.phe
      })
      return Math.round(phe)
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

.v-btn {
  text-transform: none;
}
</style>
