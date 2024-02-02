<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <h2 class="text-h5 mt-3">{{ $t('phe-calculator.title') }}</h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <router-link to="/protein-calculator" class="head-link mt-n1 mb-6">
          {{ $t('phe-calculator.protein-link') }}
        </router-link>

        <v-text-field
          :label="$t('phe-calculator.phe')"
          v-model.number="phe"
          type="number"
        ></v-text-field>
        <v-text-field
          :label="$t('phe-calculator.weight')"
          v-model.number="weight"
          type="number"
        ></v-text-field>

        <p class="text-h6 font-weight-regular">= {{ calculatePhe() }} mg Phe</p>

        <div v-if="userIsAuthenticated">
          <p class="mt-6 text-caption">{{ $t('phe-log.preview') }}</p>
          <v-progress-linear
            :model-value="((pheResult + calculatePhe()) * 100) / (settings?.maxPhe || 0)"
            height="5"
            class="mt-n2 mb-4"
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
              <v-text-field :label="$t('phe-calculator.name')" v-model="name"></v-text-field>
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push } from 'firebase/database'

export default {
  metaInfo() {
    return {
      title: this.$t('phe-calculator.title'),
      meta: [{ name: 'description', content: this.$t('phe-calculator.description') }]
    }
  },
  data: () => ({
    dialog: false,
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
      this.dialog = false
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
