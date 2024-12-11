<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '../stores/index'
import { getDatabase, ref as dbRef, push } from 'firebase/database'
import { QrcodeStream } from 'vue-qrcode-reader'

import PageHeader from '../components/PageHeader.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import NumberInput from '../components/NumberInput.vue'
import SimpleDialog from '../components/SimpleDialog.vue'
import SelectMenu from '../components/SelectMenu.vue'

const router = useRouter()
const store = useStore()
const { t } = useI18n()
const dialog = ref(null)

// Reactive state
const loaded = ref(false)
const open = ref(false)
const code = ref('')
const error = ref('')
const result = ref(null)
const weight = ref(100)
const select = ref('other')

// Computed properties
const type = computed(() => [
  { title: t('protein-calculator.other'), value: 'other' },
  { title: t('protein-calculator.meat'), value: 'meat' },
  { title: t('protein-calculator.vegetable'), value: 'vegetable' },
  { title: t('protein-calculator.fruit'), value: 'fruit' }
])

const factor = computed(() => {
  if (select.value === 'fruit') {
    return 27
  } else if (select.value === 'vegetable') {
    return 35
  } else if (select.value === 'meat') {
    return 46
  } else {
    return 50
  }
})

const userIsAuthenticated = computed(() => store.user !== null)
const user = computed(() => store.user)
const pheLog = computed(() => store.pheLog)
const settings = computed(() => store.settings)

// Methods
const paintBoundingBox = (detectedCodes, ctx) => {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height }
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}

const onReady = () => {
  loaded.value = true
}

const onDetect = async (detectedCodes) => {
  code.value = detectedCodes[0].rawValue

  try {
    const response = await fetch(
      'https://world.openfoodfacts.org/api/v2/product/' + code.value + '.json'
    )
    if (!response.ok) {
      throw new Error(response.status)
    }
    result.value = await response.json()
  } catch (error) {
    alert(t('barcode-scanner.error'))
    console.log(error)
  }
  cancel()
}

const onError = (err) => {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    error.value += 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    error.value += 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    error.value += 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    error.value += 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    error.value +=
      'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    error.value += err.message
  }
}

const openDialog = () => {
  open.value = true
  dialog.value.openDialog()
}

const cancel = () => {
  loaded.value = false
  open.value = false
  dialog.value.closeDialog()
}

const calculatePhe = () => {
  return Math.round(
    (weight.value * (result.value.product.nutriments.proteins_100g * factor.value)) / 100
  )
}

const save = () => {
  const db = getDatabase()
  push(dbRef(db, `${user.value.id}/pheLog`), {
    name: result.value.product.product_name,
    pheReference: Math.round(result.value.product.nutriments.proteins_100g * factor.value),
    weight: Number(weight.value),
    phe: calculatePhe()
  })
  router.push('/')
}
</script>

<template>
  <div>
    <header>
      <PageHeader :title="$t('app.scanner')" />
    </header>

    <PrimaryButton :text="$t('barcode-scanner.scan-barcode')" @click="openDialog" class="mt-2" />

    <SimpleDialog ref="dialog" :title="$t('barcode-scanner.scan-barcode')" @close="cancel">
      <p v-if="loaded === false">{{ $t('barcode-scanner.please-wait') }}</p>

      <!-- Do not remove -->
      <p v-if="error !== ''">{{ error }}</p>

      <QrcodeStream
        v-if="open"
        :track="paintBoundingBox"
        :formats="['ean_13', 'ean_8']"
        @camera-on="onReady"
        @detect="onDetect"
        @error="onError"
      ></QrcodeStream>
    </SimpleDialog>

    <div v-if="result">
      <img
        v-if="result.product.image_small_url"
        :src="result.product.image_small_url"
        max-height="200"
        max-width="200"
        class="my-6"
      />

      <h2 class="text-2xl mt-3 mb-1">{{ result.product.product_name }}</h2>

      <!-- Do not remove -->
      <p v-if="code !== ''" class="text-sm mb-6">Code: {{ code }}</p>

      <div v-if="result.product.nutriments.proteins_100g">
        <p class="text-xl mb-6">
          {{ result.product.nutriments.proteins_100g }}
          {{ result.product.nutriments.proteins_unit }}
          {{ $t('common.short-protein-per-100g') }}
        </p>

        <SelectMenu id-name="factor" :label="$t('common.food-type')" v-model="select">
          <option v-for="option in type" :key="option.value" :value="option.value">
            {{ option.title }}
          </option>
        </SelectMenu>

        <NumberInput
          id-name="weight"
          :label="$t('common.consumed-weight')"
          v-model.number="weight"
          class="mb-6"
        />

        <p class="text-xl mb-6">~ {{ calculatePhe() }} mg Phe</p>

        <PrimaryButton v-if="userIsAuthenticated" :text="$t('common.add')" @click="save" />
      </div>

      <div v-if="!result.product.nutriments.proteins_100g" class="mb-6">
        <p>{{ $t('barcode-scanner.no-protein') }}</p>
        <RouterLink to="/protein-calculator" class="text-sky-500">
          {{ $t('barcode-scanner.protein-link') }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>

    <p class="mt-2">
      {{ $t('barcode-scanner.info') }}
    </p>
  </div>
</template>
