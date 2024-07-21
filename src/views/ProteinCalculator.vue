<template>
  <div>
    <h2 class="text-h5 mb-6">{{ $t('protein-calculator.title') }}</h2>

    <v-select
      v-model="select"
      :items="type"
      :label="$t('protein-calculator.factor')"
      item-title="title"
      item-value="value"
    ></v-select>

    <v-text-field
      :label="$t('protein-calculator.protein')"
      v-model.number="protein"
      type="number"
    ></v-text-field>

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

    <v-dialog v-model="dialog" max-width="500px" v-if="userIsAuthenticated">
      <template v-slot:activator="{ props }">
        <v-btn variant="flat" rounded color="primary" v-bind="props" class="mr-3 mt-3">
          {{ $t('common.add') }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 mt-4">
          {{ $t('common.add') }}
        </v-card-title>

        <v-card-text>
          <v-text-field :label="$t('protein-calculator.name')" v-model="name"></v-text-field>
        </v-card-text>

        <v-card-actions class="mt-n6">
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="save">{{ $t('common.save') }}</v-btn>
          <v-btn variant="flat" color="btnsecondary" @click="dialog = false">{{
            $t('common.cancel')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'

export default {
  data: () => ({
    dialog: false,
    protein: null,
    weight: 100,
    name: '',
    select: 'other'
  }),
  methods: {
    calculateProtein() {
      return Math.round(this.protein * this.factor)
    },
    calculatePhe() {
      return Math.round((this.weight * (this.protein * this.factor)) / 100)
    },
    save() {
      const db = getDatabase()
      push(ref(db, `${this.user.id}/pheLog`), {
        name: this.name,
        weight: Number(this.weight),
        phe: this.calculatePhe()
      })
      this.dialog = false
      this.$router.push('/')
    }
  },
  computed: {
    type() {
      return [
        { title: this.$t('protein-calculator.other'), value: 'other' },
        { title: this.$t('protein-calculator.vegetable'), value: 'vegetable' },
        { title: this.$t('protein-calculator.fruit'), value: 'fruit' }
      ]
    },
    factor() {
      if (this.select === 'fruit') {
        return 30
      } else if (this.select === 'vegetable') {
        return 40
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

<style lang="scss" scoped>
.v-btn {
  text-transform: none;
}
</style>
