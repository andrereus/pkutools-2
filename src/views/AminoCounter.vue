<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <h2 class="text-h5 mt-3">{{ $t('amino-counter.title') }}</h2>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <div v-if="!userIsAuthenticated">
          <v-btn variant="flat" rounded @click="signInGoogle" class="mt-2">
            <v-icon start>{{ mdiGoogle }}</v-icon>
            {{ $t('app.signin-google') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded @click="signInFacebook" class="mt-2">
            <v-icon start>{{ mdiFacebook }}</v-icon>
            {{ $t('app.signin-facebook') }}
          </v-btn>
          <br />
          <v-btn variant="flat" rounded to="/email-auth" class="mt-2">
            <v-icon start>{{ mdiEmail }}</v-icon>
            {{ $t('email-auth.title') }}
          </v-btn>

          <img
            src="../assets/en-amino-counter.png"
            :alt="$t('amino-counter.title')"
            max-width="400"
            class="mt-10"
            v-if="$i18n.locale === 'en'"
          />
          <img
            src="../assets/de-amino-counter.png"
            :alt="$t('amino-counter.title')"
            max-width="400"
            class="mt-10"
            v-if="$i18n.locale === 'de'"
          />
        </div>

        <div v-if="userIsAuthenticated">
          <p>{{ $t('amino-counter.description') }}</p>

          <v-progress-linear
            :model-value="(calculateAmino * 100) / (settings.maxAmino || 3)"
            height="40"
            class="text-white my-6 amino-progress"
            rounded
            color="teal"
          >
            {{ calculateAmino }} {{ $t('amino-counter.progress') }}
          </v-progress-linear>

          <v-timeline density="compact">
            <v-timeline-item fill-dot dot-color="primary" size="large" :icon="mdiCupWater">
              <v-btn variant="flat" rounded @click="takeAM" color="primary" class="mr-2 mt-2">
                {{ $t('amino-counter.take') }}
              </v-btn>
              <v-btn variant="flat" rounded class="mr-2 mt-2" @click="resetAM">
                {{ $t('common.reset') }}
              </v-btn>
            </v-timeline-item>

            <v-timeline-item v-for="(item, index) in reverseAminoCounter" :key="index" size="small">
              <p class="mb-0">{{ $t('amino-counter.serving') }} {{ getlocalDate(item.date) }}</p>
            </v-timeline-item>
          </v-timeline>

          <p class="text--secondary mt-5">
            <v-icon>{{ mdiInformationVariant }}</v-icon>
            {{ $t('amino-counter.note') }}
          </p>

          <v-dialog v-model="alert" max-width="300">
            <v-card>
              <v-card-title>{{ $t('common.note') }}</v-card-title>
              <v-card-text>{{ $t('amino-counter.limit') }}</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="alert = false">{{
                  $t('common.ok')
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>

    <v-snackbar location="bottom" color="warning" v-model="offlineInfo">
      {{ $t('app.offline') }}
      <template v-slot:action="{ attrs }">
        <v-btn variant="text" v-bind="attrs" @click="offlineInfo = false">
          {{ $t('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { useStore } from '../stores/index'
import { getDatabase, ref, push, remove } from 'firebase/database'
import { formatRelative, isToday, parseISO } from 'date-fns'
import { enUS, de, fr, es } from 'date-fns/locale'
import { mdiGoogle, mdiFacebook, mdiCupWater, mdiInformationVariant, mdiEmail } from '@mdi/js'

export default {
  metaInfo() {
    return {
      title: this.$t('amino-counter.title'),
      meta: [{ name: 'description', content: this.$t('amino-counter.description') }]
    }
  },
  data: () => ({
    mdiGoogle,
    mdiFacebook,
    mdiCupWater,
    mdiInformationVariant,
    mdiEmail,
    alert: false,
    offlineInfo: false
  }),
  methods: {
    signInGoogle() {
      const store = useStore()
      if (navigator.onLine) {
        store.signInGoogle()
      } else {
        this.offlineInfo = true
      }
    },
    signInFacebook() {
      const store = useStore()
      if (navigator.onLine) {
        store.signInFacebook()
      } else {
        this.offlineInfo = true
      }
    },
    takeAM() {
      if (this.aminoCounter.length >= 100) {
        this.alert = true
      } else {
        const db = getDatabase()
        push(ref(db, `${this.user.id}/aminoCounter`), {
          date: new Date().toISOString()
        })
      }
    },
    getlocalDate(date) {
      if (date) {
        const locales = { enUS, de, fr, es }
        return formatRelative(parseISO(new Date(date).toISOString()), new Date(), {
          locale: locales[this.$i18n.locale]
        })
      } else {
        return ''
      }
    },
    resetAM() {
      let r = confirm(this.$t('common.reset') + '?')
      if (r === true) {
        const db = getDatabase()
        remove(ref(db, `${this.user.id}/aminoCounter`))
      }
    }
  },
  computed: {
    reverseAminoCounter() {
      return [...this.aminoCounter].reverse()
    },
    calculateAmino() {
      return this.aminoCounter.filter((item) => {
        return isToday(parseISO(item.date))
      }).length
    },
    userIsAuthenticated() {
      const store = useStore()
      return store.user !== null
    },
    user() {
      const store = useStore()
      return store.user
    },
    aminoCounter() {
      const store = useStore()
      return store.aminoCounter
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

.amino-progress {
  border-radius: 20px;
}
</style>
