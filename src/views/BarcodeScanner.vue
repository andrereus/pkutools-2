<template>
  <div>
    <header>
      <PageHeader :title="$t('app.scanner')" />
    </header>

    <PrimaryButton :text="$t('barcode-scanner.scan-barcode')" @click="open = true" class="t-mt-2" />

    <SimpleDialog :open="open" :title="$t('barcode-scanner.scan-barcode')" @close="cancel">
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
    </SimpleDialog>

    <div v-if="result !== null">
      <img
        v-if="result.product.image_small_url"
        :src="result.product.image_small_url"
        max-height="200"
        max-width="200"
        class="t-my-6"
      />

      <h2 class="t-text-2xl t-mt-3 t-mb-1">{{ result.product.product_name }}</h2>

      <!-- Do not remove -->
      <p v-if="code !== ''" class="t-text-sm t-mb-6">Code: {{ code }}</p>

      <div v-if="this.result.product.nutriments.proteins_100g">
        <p class="t-text-xl t-mb-6">
          {{ result.product.nutriments.proteins_100g }}
          {{ result.product.nutriments.proteins_unit }}
          {{ $t('barcode-scanner.protein') }}
        </p>

        <SelectMenu id-name="factor" :label="$t('protein-calculator.factor')" v-model="select">
          <option v-for="option in type" :key="option.value" :value="option.value">
            {{ option.title }}
          </option>
        </SelectMenu>

        <NumberInput
          id-name="weight"
          :label="$t('protein-calculator.weight')"
          v-model.number="weight"
          class="t-mb-6"
        />

        <p class="t-text-xl t-mb-6">~ {{ calculatePhe() }} mg Phe</p>

        <PrimaryButton v-if="userIsAuthenticated" :text="$t('common.add')" @click="save" />
      </div>

      <div v-if="!this.result.product.nutriments.proteins_100g" class="t-mb-6">
        <p>{{ $t('barcode-scanner.no-protein') }}</p>
        <RouterLink to="/protein-calculator" class="t-text-sky-500">
          {{ $t('barcode-scanner.protein-link') }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>

    <p class="t-mt-2">
      {{ $t('barcode-scanner.info') }}
    </p>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'
import { QrcodeStream } from 'vue-qrcode-reader'

import PageHeader from '../components/PageHeader.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NumberInput from '../components/NumberInput.vue'
import SimpleDialog from '../components/SimpleDialog.vue'

export default {
  components: {
    QrcodeStream,
    PageHeader,
    PrimaryButton,
    NumberInput,
    SimpleDialog
  },
  data: () => ({
    loaded: false,
    open: false,
    code: '',
    error: '',
    result: null,
    weight: 100,
    select: 'other'
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
          alert(this.$t('common.error'))
          console.log(error)
        })
      this.loaded = false
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
      this.open = false
    },
    calculatePhe() {
      return Math.round(
        (this.weight *
          (this.result.product.nutriments.proteins_100g * (this.protein * this.factor))) /
          100
      )
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
    type() {
      return [
        { title: this.$t('protein-calculator.other'), value: 'other' },
        { title: this.$t('protein-calculator.meat'), value: 'meat' },
        { title: this.$t('protein-calculator.vegetable'), value: 'vegetable' },
        { title: this.$t('protein-calculator.fruit'), value: 'fruit' }
      ]
    },
    factor() {
      if (this.select === 'fruit') {
        return 27
      } else if (this.select === 'vegetable') {
        return 35
      } else if (this.select === 'meat') {
        return 46
      } else {
        return 50
      }
    },
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
