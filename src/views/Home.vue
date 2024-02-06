<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <v-alert type="info" variant="tonal">
          {{ $t('app.change-info') }}
        </v-alert>
        <p v-if="!userIsAuthenticated" class="mt-5 mb-1">{{ $t('app.description') }}</p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="10" lg="8" xl="6">
        <div>
          <v-text-field
            v-model="search"
            :label="$t('phe-search.search')"
            autocomplete="off"
            @keyup="searchFood"
            clearable
            @click:clear="advancedFood = null"
          >
            <template v-slot:append>
              <v-btn
                variant="flat"
                color="primary"
                :loading="loading"
                @click="searchFood"
                :icon="mdiMagnify"
              >
              </v-btn>
            </template>
          </v-text-field>

          <v-data-table-virtual
            :headers="headers"
            :items="advancedFood"
            :sort-by="['name']"
            v-if="advancedFood !== null"
          >
            <template v-slot:item="{ item }">
              <tr @click="loadItem(item)" class="tr-edit">
                <td class="text-start">
                  {{ item.emoji }}
                  {{ item.name }}
                </td>
                <td class="text-start">{{ item.phe }}</td>
              </tr>
            </template>
          </v-data-table-virtual>

          <p class="mt-6 text--secondary" v-if="advancedFood !== null">
            <v-icon>{{ mdiInformationVariant }}</v-icon>
            {{ $t('phe-search.source') }}
          </p>

          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5 mt-4">
                {{ emoji }}
                {{ name }}
              </v-card-title>

              <v-card-text>
                <v-text-field
                  :label="$t('phe-search.weight')"
                  v-model.number="weight"
                  type="number"
                  clearable
                ></v-text-field>
                <p class="text-h6 font-weight-regular">= {{ calculatePhe() }} mg Phe</p>
                <div v-if="userIsAuthenticated">
                  <p class="mt-4 text-caption">{{ $t('phe-log.preview') }}</p>
                  <v-progress-linear
                    :model-value="((pheResult + calculatePhe()) * 100) / (settings?.maxPhe || 0)"
                    height="6"
                    class="mt-3 mb-8"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-card-text>

              <v-card-actions class="mt-n6">
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="primary" @click="save" v-if="userIsAuthenticated">
                  {{ $t('common.add') }}
                </v-btn>
                <v-btn variant="flat" color="btnsecondary" @click="dialog = false">{{
                  $t('common.close')
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

        <div v-if="advancedFood === null">
          <v-btn variant="flat" rounded color="btnsecondary" to="/phe-calculator" class="mr-3 mb-3">
            <v-icon start>{{ mdiCalculator }}</v-icon>
            {{ $t('phe-calculator.title') }}
          </v-btn>
          <v-btn
            variant="flat"
            rounded
            color="btnsecondary"
            to="/protein-calculator"
            class="mr-3 mb-3"
          >
            <v-icon start>{{ mdiCalculatorVariant }}</v-icon>
            {{ $t('protein-calculator.title') }}
          </v-btn>
          <v-btn
            variant="flat"
            rounded
            color="btnsecondary"
            to="/barcode-scanner"
            class="mr-3 mb-3"
          >
            <v-icon start>{{ mdiBarcodeScan }}</v-icon>
            {{ $t('barcode-scanner.title') }}
          </v-btn>
          <v-btn
            v-if="userIsAuthenticated"
            variant="flat"
            rounded
            color="btnsecondary"
            to="/own-food"
            class="mr-3 mb-3"
          >
            <v-icon start>{{ mdiFoodApple }}</v-icon>
            {{ $t('home.own-food') }}
          </v-btn>
        </div>

        <PheLog v-if="userIsAuthenticated && advancedFood === null" />

        <div v-if="!userIsAuthenticated && advancedFood === null">
          <img
            src="../assets/eating-together.svg"
            alt="Food Illustration"
            class="mt-6 mb-10 illustration"
          />

          <v-menu v-if="!userIsAuthenticated">
            <template v-slot:activator="{ props }">
              <v-btn variant="flat" rounded color="primary" class="mr-3 mb-3" v-bind="props">
                <v-icon start>{{ mdiLoginVariant }}</v-icon>
                {{ $t('email-auth.signin') }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="signInGoogle">
                <span>
                  <v-icon>{{ mdiGoogle }}</v-icon>
                  {{ $t('app.signin-google') }}
                </span>
              </v-list-item>
              <v-list-item @click="signInFacebook">
                <span>
                  <v-icon>{{ mdiFacebook }}</v-icon>
                  {{ $t('app.signin-facebook') }}
                </span>
              </v-list-item>
              <v-list-item to="/email-auth">
                <span>
                  <v-icon>{{ mdiEmail }}</v-icon>
                  {{ $t('email-auth.title') }}
                </span>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn variant="flat" rounded color="btnsecondary" to="/help" class="mr-3 mb-3">
            <v-icon start>{{ mdiDownload }}</v-icon>
            {{ $t('app.install') }}
          </v-btn>

          <v-btn
            v-if="this.$i18n.locale !== 'de' && $vuetify.display.smAndUp"
            variant="flat"
            rounded
            color="btnsecondary"
            href="https://youtu.be/lmiejnEFccY"
            target="_blank"
            class="mr-3 mb-3"
          >
            <v-icon start>{{ mdiPlayCircleOutline }}</v-icon>
            {{ $t('home.video') }}
          </v-btn>

          <v-btn
            v-if="this.$i18n.locale === 'de' && $vuetify.display.smAndUp"
            variant="flat"
            rounded
            color="btnsecondary"
            href="https://youtu.be/5_-F4tM8_RQ"
            target="_blank"
            class="mr-3 mb-3"
          >
            <v-icon start>{{ mdiPlayCircleOutline }}</v-icon>
            {{ $t('home.video') }}
          </v-btn>

          <v-btn
            v-if="$vuetify.display.xsOnly"
            variant="flat"
            rounded
            color="btnsecondary"
            href="https://youtu.be/ITfvSliHwc0"
            target="_blank"
            class="mr-3 mb-3"
          >
            <v-icon start>{{ mdiPlay }}</v-icon>
            {{ $t('home.mobile-video') }}
          </v-btn>

          <h2 class="text-h5 mt-6 mb-6">{{ $t('home.features') }}</h2>
          <FeatureComparison home class="mb-8" />

          <v-btn variant="flat" rounded color="btnsecondary" to="/other-apps" class="mr-3 mb-3">
            {{ $t('home.compare') }}
          </v-btn>
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
import { getDatabase, ref, push } from 'firebase/database'
import Fuse from 'fuse.js'
import FeatureComparison from '../components/FeatureComparison.vue'
import PheLog from '../components/PheLog.vue'
import {
  mdiGoogle,
  mdiFacebook,
  mdiMagnify,
  mdiCalculator,
  mdiCalculatorVariant,
  mdiFoodApple,
  mdiPoll,
  mdiPlayCircleOutline,
  mdiPlay,
  mdiInformationVariant,
  mdiPlus,
  mdiHelpCircleOutline,
  mdiBarcodeScan,
  mdiEmail,
  mdiDownload,
  mdiLoginVariant
} from '@mdi/js'

export default {
  components: {
    FeatureComparison,
    PheLog
  },
  metaInfo() {
    return {
      title: this.$t('app.title'),
      titleTemplate: null,
      meta: [{ name: 'description', content: this.$t('app.description') }]
    }
  },
  data: () => ({
    mdiGoogle,
    mdiFacebook,
    mdiMagnify,
    mdiCalculator,
    mdiCalculatorVariant,
    mdiFoodApple,
    mdiPoll,
    mdiPlayCircleOutline,
    mdiPlay,
    mdiInformationVariant,
    mdiPlus,
    mdiHelpCircleOutline,
    mdiBarcodeScan,
    mdiEmail,
    mdiDownload,
    mdiLoginVariant,
    offlineInfo: false,
    publicPath: import.meta.env.BASE_URL,
    dialog: false,
    search: null,
    phe: null,
    weight: 100,
    name: '',
    emoji: '🌱',
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'name'
      },
      { title: 'Phe', key: 'phe' }
    ],
    advancedFood: null,
    loading: false
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
    loadItem(item) {
      this.name = item.name
      this.emoji = item.emoji
      this.phe = item.phe
      this.weight = 100
      this.dialog = true
    },
    calculatePhe() {
      return Math.round((this.weight * this.phe) / 100)
    },
    save() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.name,
        emoji: this.emoji,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.dialog = false
      this.advancedFood = null
    },
    async searchFood() {
      this.loading = true
      let res, food, langFood

      if (this.$i18n.locale === 'de') {
        res = await fetch(this.publicPath + 'data/usda-icon-de.json')
        langFood = await res.json()
      } else if (this.$i18n.locale === 'es') {
        res = await fetch(this.publicPath + 'data/usda-icon-es.json')
        langFood = await res.json()
      } else if (this.$i18n.locale === 'fr') {
        res = await fetch(this.publicPath + 'data/usda-icon-fr.json')
        langFood = await res.json()
      } else {
        res = await fetch(this.publicPath + 'data/usda-icon-en.json')
        langFood = await res.json()
      }
      // TODO: Optional: Checkbox if search should be with or without own food
      food = langFood.concat(this.ownFood)

      const fuse = new Fuse(food, {
        keys: ['name', 'phe'],
        threshold: 0.2,
        minMatchCharLength: 2,
        ignoreLocation: true
      })
      let results = fuse.search(this.search.trim())

      this.advancedFood = results.map((result) => {
        return result.item
      })
      this.loading = false
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
.illustration {
  width: 100%;
  max-width: 550px;
  height: auto;
}

.tr-edit {
  cursor: pointer;
}

.food-icon {
  vertical-align: bottom;
  display: inline-block;
}

.v-theme--light.v-data-table {
  background-color: #fafafa;
}

.v-btn {
  text-transform: none;
}
</style>
