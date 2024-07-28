<template>
  <div>
    <p v-if="!userIsAuthenticated" class="mb-8">{{ $t('app.description') }}</p>

    <PheLog v-if="userIsAuthenticated" />

    <p class="t-mt-4 t-mb-2">{{ $t('app.redesign') }}</p>

    <div v-if="!userIsAuthenticated">
      <v-menu v-if="!userIsAuthenticated">
        <template v-slot:activator="{ props }">
          <v-btn variant="flat" rounded color="primary" class="mt-6 mr-3 mb-4" v-bind="props">
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
          <v-list-item to="/email-auth">
            <span>
              <v-icon>{{ mdiEmail }}</v-icon>
              {{ $t('email-auth.title') }}
            </span>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn variant="flat" rounded color="btnsecondary" to="/help" class="mt-6 mr-3 mb-4">
        <v-icon start>{{ mdiDownload }}</v-icon>
        {{ $t('app.install') }}
      </v-btn>

      <h2 class="text-h5 mt-6 mb-6">{{ $t('home.features') }}</h2>
      <FeatureComparison home class="mb-8" />
    </div>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import FeatureComparison from '../components/FeatureComparison.vue'
import PheLog from '../components/PheLog.vue'
import { mdiGoogle, mdiEmail, mdiDownload, mdiLoginVariant } from '@mdi/js'

export default {
  components: {
    FeatureComparison,
    PheLog
  },
  data: () => ({
    mdiGoogle,
    mdiEmail,
    mdiDownload,
    mdiLoginVariant
  }),
  methods: {
    async signInGoogle() {
      const store = useStore()
      try {
        await store.signInGoogle()
      } catch (error) {
        alert(this.$t('app.auth-error'))
        console.error(error)
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: none;
}
</style>
