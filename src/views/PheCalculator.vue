<template>
  <div>
    <header>
      <PageHeader :title="$t('app.calculator')" />
    </header>

    <div class="block mb-6">
      <nav class="flex space-x-2" aria-label="Tabs">
        <RouterLink
          to="/phe-calculator"
          class="bg-black/5 dark:bg-white/15 text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          aria-current="page"
          >{{ $t('phe-calculator.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/protein-calculator"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          >{{ $t('protein-calculator.tab-title') }}</RouterLink
        >
      </nav>
    </div>

    <TextInput
      id-name="food"
      :label="$t('common.food-name')"
      v-model="name"
      v-if="userIsAuthenticated"
    />

    <NumberInput id-name="phe" :label="$t('common.phe-per-100g')" v-model.number="phe" />
    <NumberInput id-name="weight" :label="$t('common.consumed-weight')" v-model.number="weight" />

    <p class="text-xl my-6">= {{ calculatePhe() }} mg Phe</p>

    <PrimaryButton v-if="userIsAuthenticated" :text="$t('common.add')" @click="save" />

    <a href="https://www.buymeacoffee.com/andrereus" target="_blank">
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        class="w-28 mt-8"
      />
    </a>
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
        pheReference: this.phe,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.$router.push('/')
    }
  },
  computed: {
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
