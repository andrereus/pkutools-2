<template>
  <div>
    <header>
      <PageHeader :title="$t('app.scanner')" />
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

    <PrimaryButton :text="$t('barcode-scanner.scan-barcode')" @click="open = true" />

    <TransitionRoot as="template" :show="open">
      <Dialog class="t-relative t-z-10" @close="open = false">
        <TransitionChild
          as="template"
          enter="t-ease-out t-duration-300"
          enter-from="t-opacity-0"
          enter-to="t-opacity-100"
          leave="t-ease-in t-duration-200"
          leave-from="t-opacity-100"
          leave-to="t-opacity-0"
        >
          <div class="t-fixed t-inset-0 t-bg-gray-500 t-bg-opacity-75 t-transition-opacity" />
        </TransitionChild>

        <div class="t-fixed t-inset-0 t-z-10 t-w-screen t-overflow-y-auto">
          <div
            class="t-flex t-min-h-full t-items-center t-justify-center t-p-4 t-text-center sm:t-p-0"
          >
            <TransitionChild
              as="template"
              enter="t-ease-out t-duration-300"
              enter-from="t-opacity-0 t-translate-y-4 sm:t-translate-y-0 sm:t-scale-95"
              enter-to="t-opacity-100 t-translate-y-0 sm:t-scale-100"
              leave="t-ease-in t-duration-200"
              leave-from="t-opacity-100 t-translate-y-0 sm:t-scale-100"
              leave-to="t-opacity-0 t-translate-y-4 sm:t-translate-y-0 sm:t-scale-95"
            >
              <DialogPanel
                class="t-relative t-transform t-overflow-hidden t-rounded-lg t-bg-white t-px-4 t-pb-4 t-pt-5 t-text-left t-shadow-xl t-transition-all sm:t-my-8 sm:t-w-full sm:t-max-w-screen-sm sm:t-p-6"
              >
                <div>
                  <div class="t-text-center">
                    <DialogTitle
                      as="h3"
                      class="t-text-base t-font-semibold t-leading-6 t-text-gray-900"
                      >{{ $t('barcode-scanner.scan-barcode') }}</DialogTitle
                    >
                    <div class="t-mt-2">
                      <p v-if="loaded === false">{{ $t('barcode-scanner.please-wait') }}</p>

                      <!-- Do not remove -->
                      <p v-if="error !== ''">{{ error }}</p>

                      <QrcodeStream
                        v-if="open === true"
                        :track="paintBoundingBox"
                        :formats="['ean_13', 'ean_8']"
                        @camera-on="onReady"
                        @detect="onDetect"
                        @error="onError"
                      ></QrcodeStream>
                    </div>
                  </div>
                </div>
                <div class="t-mt-5 sm:t-mt-6">
                  <button
                    type="button"
                    class="t-inline-flex t-w-full t-justify-center t-rounded-md t-bg-indigo-600 t-px-3 t-py-2 t-text-sm t-font-semibold t-text-white t-shadow-sm t-hover:bg-indigo-500 t-focus-visible:outline t-focus-visible:outline-2 t-focus-visible:outline-offset-2 t-focus-visible:outline-indigo-600"
                    @click="cancel"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

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
      <p v-if="code !== ''" class="t-mb-6 text-caption">Code: {{ code }}</p>

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

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

import PageHeader from '../components/PageHeader.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

export default {
  components: {
    QrcodeStream,
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    PageHeader,
    PrimaryButton
  },
  data: () => ({
    mdiInformationVariant,
    dialog: false,
    loaded: false,
    open: false,
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
      this.open = false
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
      this.open = false
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
