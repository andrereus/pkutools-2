<template>
  <div>
    <header>
      <PageHeader :title="$t('app.calculator')" />
    </header>

    <div class="block mb-6">
      <nav class="flex space-x-2" aria-label="Tabs">
        <RouterLink
          to="/phe-calculator"
          class="text-gray-500 hover:text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          >{{ $t('phe-calculator.tab-title') }}</RouterLink
        >
        <RouterLink
          to="/protein-calculator"
          class="bg-black/5 dark:bg-white/15 text-gray-700 rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
          aria-current="page"
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

    <SelectMenu id-name="factor" :label="$t('common.food-type')" v-model="select">
      <option v-for="option in type" :key="option.value" :value="option.value">
        {{ option.title }}
      </option>
    </SelectMenu>

    <NumberInput
      id-name="protein"
      :label="$t('common.protein-per-100g')"
      v-model.number="protein"
    />
    <NumberInput id-name="weight" :label="$t('common.consumed-weight')" v-model.number="weight" />

    <p class="text-xl my-6">~ {{ calculatePhe() }} mg Phe</p>

    <PrimaryButton v-if="userIsAuthenticated" :text="$t('common.add')" @click="save" />
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'

import PageHeader from '../components/PageHeader.vue'
import SelectMenu from '../components/SelectMenu.vue'
import TextInput from '../components/TextInput.vue'
import NumberInput from '../components/NumberInput.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

export default {
  components: {
    PageHeader,
    SelectMenu,
    TextInput,
    NumberInput,
    PrimaryButton
  },
  data: () => ({
    protein: null,
    weight: null,
    name: '',
    select: 'other'
  }),
  methods: {
    calculatePhe() {
      return Math.round((this.weight * (this.protein * this.factor)) / 100)
    },
    save() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.name,
        pheReference: Math.round(this.protein * this.factor),
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
