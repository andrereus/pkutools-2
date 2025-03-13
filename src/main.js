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
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'

import VueApexCharts from 'vue3-apexcharts'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.i18nCurrentLocale ? JSON.parse(localStorage.i18nCurrentLocale) : 'en',
  fallbackLocale: 'en',
  messages: { en, de, es, fr }
})

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const firebaseApp = initializeApp(firebaseConfig)

if (import.meta.env.MODE === 'development') {
  const auth = getAuth(firebaseApp)
  const db = getDatabase(firebaseApp)

  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectDatabaseEmulator(db, 'localhost', 9000)

  console.log('Connected to Firebase emulators')
}

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
