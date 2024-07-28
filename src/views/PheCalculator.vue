<template>
  <div>
    <header>
      <PageHeader :title="$t('app.calculator')" />
    </header>

    <div class="t-block t-mb-6">
      <nav class="t-flex t-space-x-4" aria-label="Tabs">
        <RouterLink
          to="/phe-calculator"
          class="t-bg-gray-100 t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-bg-gray-700 dark:t-text-gray-300"
          aria-current="page"
          >{{ $t('phe-calculator.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/protein-calculator"
          class="t-text-gray-500 hover:t-text-gray-700 t-rounded-md t-px-3 t-py-2 t-text-sm t-font-medium dark:t-text-gray-300"
          >{{ $t('protein-calculator.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <TextInput
      id-name="food"
      :label="$t('phe-calculator.name')"
      v-model="name"
      v-if="userIsAuthenticated"
    />

    <NumberInput id-name="phe" :label="$t('phe-calculator.phe')" v-model.number="phe" />
    <NumberInput id-name="weight" :label="$t('phe-calculator.weight')" v-model.number="weight" />

    <p class="t-text-xl t-my-6">= {{ calculatePhe() }} mg Phe</p>

    <div v-if="userIsAuthenticated">
      <p class="t-text-sm">{{ $t('phe-log.preview') }}</p>

      <v-progress-linear
        :model-value="((pheResult + calculatePhe()) * 100) / (settings?.maxPhe || 0)"
        height="6"
        class="mt-3 mb-6"
        rounded
      ></v-progress-linear>

      <PrimaryButton :text="$t('common.add')" @click="save" />
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'

import PageHeader from '../components/PageHeader.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

export default {
  components: {
    PageHeader,
    TextInput,
    NumberInput,
    PrimaryButton
  },
  data: () => ({
    phe: null,
    weight: null,
    name: ''
  }),
  methods: {
    calculatePhe() {
      return Math.round((this.weight * this.phe) / 100)
    },
    save() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.name,
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
