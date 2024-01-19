import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { en as vEn, de as vDe, es as vEs, fr as vFr } from 'vuetify/locale'

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

import { initializeApp } from 'firebase/app'

import VueApexCharts from 'vue3-apexcharts'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: {
      en: vEn,
      de: vDe,
      es: vEs,
      fr: vFr
    }
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, de, es, fr }
})

const firebaseConfig = {
  apiKey: 'AIzaSyCy-4rH75-ILcbgJPx3amMaoHUEl3fJJtw',
  authDomain: 'pku-tools.firebaseapp.com',
  databaseURL: 'https://pku-tools.firebaseio.com',
  projectId: 'pku-tools',
  storageBucket: 'pku-tools.appspot.com',
  messagingSenderId: '202032702286',
  appId: '1:202032702286:web:2daa2ac360e82ee0cfb41f'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)
app.use(VueApexCharts)

app.mount('#app')
