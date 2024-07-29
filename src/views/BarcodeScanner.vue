<template>
  <div>
    <header>
      <PageHeader :title="$t('app.search')" />
    </header>

    <div class="t-block t-mb-6">
      <nav class="t-flex t-space-x-4" aria-label="Tabs">
        <RouterLink
          to="/phe-search"
          class="t-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
          >{{ $t('phe-search.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/barcode-scanner"
          class="t-bg-gray-100 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-bg-gray-700 dark:t-text-gray-300"
          aria-current="page"
          >{{ $t('barcode-scanner.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ props }">
        <v-btn variant="flat" rounded color="primary" v-bind="props" class="mt-2 mr-3 mb-3">
          {{ $t('barcode-scanner.scan-barcode') }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 mt-4">
          {{ $t('barcode-scanner.scan-barcode') }}
        </v-card-title>

        <v-card-text>
          <p v-if="loaded === false">{{ $t('barcode-scanner.please-wait') }}</p>

          <!-- Do not remove -->
          <p v-if="error !== ''">{{ error }}</p>

          <QrcodeStream
            v-if="dialog === true"
            :track="paintBoundingBox"
            :formats="['ean_13', 'ean_8']"
            @camera-on="onReady"
            @detect="onDetect"
            @error="onError"
          ></QrcodeStream>
        </v-card-text>

        <v-card-actions class="mt-n6">
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="btnsecondary" @click="cancel">{{
            $t('common.cancel')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="result !== null">
      <img
        v-if="result.product.image_small_url"
        :src="result.product.image_small_url"
        max-height="200"
        max-width="200"
        class="my-6"
      />

      <h2 class="text-h5 mt-3 mb-1">{{ result.product.product_name }}</h2>

      <!-- Do not remove -->
      <p v-if="code !== ''" class="t-mb-6">Code: {{ code }}</p>

      <div v-if="this.result.product.nutriments.proteins_100g">
        <p class="text-h6 font-weight-regular mb-6">
          {{ result.product.nutriments.proteins_100g }}
          {{ result.product.nutriments.proteins_unit }}
          {{ $t('barcode-scanner.protein') }}
        </p>

        <v-text-field
          :label="$t('protein-calculator.weight')"
          v-model.number="weight"
          type="number"
          clearable
        ></v-text-field>

        <p class="text-h6 font-weight-regular">~ {{ calculatePhe() }} mg Phe</p>

        <div v-if="userIsAuthenticated">
          <p class="mt-6 text-caption">{{ $t('phe-log.preview') }}</p>
          <v-progress-linear
            :model-value="((pheResult + calculatePhe()) * 100) / (settings?.maxPhe || 0)"
            height="6"
            class="mt-3 mb-6"
            rounded
          ></v-progress-linear>
        </div>

        <v-btn
          variant="flat"
          rounded
          color="primary"
          @click="save"
          class="mr-3 mt-3"
          v-if="userIsAuthenticated"
        >
          {{ $t('common.add') }}
        </v-btn>
      </div>

      <div v-if="!this.result.product.nutriments.proteins_100g">
        <p>{{ $t('barcode-scanner.no-protein') }}</p>
        <br />
        <RouterLink to="/protein-calculator" class="head-link mt-n1 mb-6 t-text-sky-500">
          {{ $t('barcode-scanner.protein-link') }}
        </RouterLink>
      </div>
    </div>

    <p class="mt-6 text--secondary">
      <v-icon>{{ mdiInformationVariant }}</v-icon>
      {{ $t('barcode-scanner.info') }}
    </p>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'
import { QrcodeStream } from 'vue-qrcode-reader'
import { mdiInformationVariant } from '@mdi/js'

import PageHeader from '../components/PageHeader.vue'

export default {
  components: {
    QrcodeStream,
    PageHeader
  },
  data: () => ({
    mdiInformationVariant,
    dialog: false,
    loaded: false,
    code: '',
    error: '',
    result: null,
    weight: 100
  }),
  methods: {
    paintBoundingBox(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const {
          boundingBox: { x, y, width, height }
        } = detectedCode

        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
      }
    },
    onReady() {
      this.loaded = true
    },
    onDetect(detectedCodes) {
      this.code = detectedCodes[0].rawValue

      fetch('https://world.openfoodfacts.org/api/v2/product/' + this.code + '.json')
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error(response.status)
        })
        .then((result) => {
          this.result = result
        })
        .catch((error) => {
          console.log(error)
        })
      this.loaded = false
      this.dialog = false
    },
    onError(err) {
      this.error = `[${err.name}]: `

      if (err.name === 'NotAllowedError') {
        this.error += 'you need to grant camera access permission'
      } else if (err.name === 'NotFoundError') {
        this.error += 'no camera on this device'
      } else if (err.name === 'NotSupportedError') {
        this.error += 'secure context required (HTTPS, localhost)'
      } else if (err.name === 'NotReadableError') {
        this.error += 'is the camera already in use?'
      } else if (err.name === 'OverconstrainedError') {
        this.error += 'installed cameras are not suitable'
      } else if (err.name === 'StreamApiNotSupportedError') {
        this.error += 'Stream API is not supported in this browser'
      } else if (err.name === 'InsecureContextError') {
        this.error +=
          'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
      } else {
        this.error += err.message
      }
    },
    cancel() {
      if (this.loaded === true) {
        this.loaded = false
      }
      this.dialog = false
    },
    calculatePhe() {
      return Math.round((this.weight * (this.result.product.nutriments.proteins_100g * 50)) / 100)
    },
    save() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.result.product.product_name,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.$router.push('/')
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
.v-btn {
  text-transform: none;
}

.head-link {
  display: block;
  text-decoration: none;
}
</style>
