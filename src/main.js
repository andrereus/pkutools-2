import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

import { initializeApp } from 'firebase/app'

import VueApexCharts from 'vue3-apexcharts'

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
app.use(i18n)
app.use(VueApexCharts)

app.mount('#app')

if (!localStorage.i18nCurrentLocale) {
  const browserLocale = navigator.language.split('-')[0]
  if (['en', 'de', 'es', 'fr'].includes(browserLocale)) {
    i18n.global.locale.value = browserLocale
  }
}
