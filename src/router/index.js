import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PheSearch from '../views/PheSearch.vue'
import PheCalculator from '../views/PheCalculator.vue'
import ProteinCalculator from '../views/ProteinCalculator.vue'
import BarcodeScanner from '../views/BarcodeScanner.vue'
import OwnFood from '../views/OwnFood.vue'
import PheDiary from '../views/PheDiary.vue'
import BloodLevels from '../views/BloodLevels.vue'
import Settings from '../views/Settings.vue'
import EmailAuth from '../views/EmailAuth.vue'
import Help from '../views/Help.vue'
import Imprint from '../views/Imprint.vue'
import Disclaimer from '../views/Disclaimer.vue'
import PrivacyPolicy from '../views/PrivacyPolicy.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/phe-search',
      name: 'Phe Search',
      component: PheSearch
    },
    {
      path: '/barcode-scanner',
      name: 'Barcode Scanner',
      component: BarcodeScanner
    },
    {
      path: '/phe-calculator',
      name: 'Phe Calculator',
      component: PheCalculator
    },
    {
      path: '/protein-calculator',
      name: 'Protein Calculator',
      component: ProteinCalculator
    },
    {
      path: '/own-food',
      name: 'Own Food',
      component: OwnFood
    },
    {
      path: '/phe-diary',
      name: 'Phe Diary',
      component: PheDiary
    },
    {
      path: '/blood-levels',
      name: 'Blood Levels',
      component: BloodLevels
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/email-auth',
      name: 'Email Auth',
      component: EmailAuth
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/imprint',
      name: 'Imprint',
      component: Imprint
    },
    {
      path: '/disclaimer',
      name: 'Disclaimer',
      component: Disclaimer
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      component: PrivacyPolicy
    }
  ]
})

export default router
