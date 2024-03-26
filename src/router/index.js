import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/phe-calculator',
      name: 'Phe Calculator',
      component: () => import('../views/PheCalculator.vue')
    },
    {
      path: '/protein-calculator',
      name: 'Protein Calculator',
      component: () => import('../views/ProteinCalculator.vue')
    },
    {
      path: '/barcode-scanner',
      name: 'Barcode Scanner',
      component: () => import('../views/BarcodeScanner.vue')
    },
    {
      path: '/own-food',
      name: 'Own Food',
      component: () => import('../views/OwnFood.vue')
    },
    {
      path: '/phe-diary',
      name: 'Phe Diary',
      component: () => import('../views/PheDiary.vue')
    },
    {
      path: '/accountsettings',
      name: 'Settings',
      component: () => import('../views/Settings.vue')
    },
    {
      path: '/email-auth',
      name: 'Email Auth',
      component: () => import('../views/EmailAuth.vue')
    },
    {
      path: '/help',
      name: 'Help',
      component: () => import('../views/Help.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue')
    },
    {
      path: '/disclaimer',
      name: 'Disclaimer',
      component: () => import('../views/Disclaimer.vue')
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      component: () => import('../views/PrivacyPolicy.vue')
    }
  ]
})

export default router
