import './assets/main.css'

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
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3498db',
          btnsecondary: '#f5f5f5'
        }
      },
      dark: {
        colors: {
          primary: '#3498db',
          btnsecondary: '#212121'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  locale: {
    locale: localStorage.i18nCurrentLocale ? JSON.parse(localStorage.i18nCurrentLocale) : 'en',
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
  locale: localStorage.i18nCurrentLocale ? JSON.parse(localStorage.i18nCurrentLocale) : 'en',
  fallbackLocale: 'en',
  messages: { en, de, es, fr }
})

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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

if (!localStorage.i18nCurrentLocale) {
  const browserLocale = navigator.language.split('-')[0]
  if (['en', 'de', 'es', 'fr'].includes(browserLocale)) {
    i18n.global.locale.value = browserLocale
    vuetify.locale.current.value = browserLocale
  }
}
