import { defineStore } from 'pinia'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai'

const defaultSettings = {
  maxPhe: null,
  labUnit: 'mgdl',
  license: null
}

export const useStore = defineStore('main', {
  state: () => ({
    user: null,
    pheLog: [],
    pheDiary: [],
    labValues: [],
    ownFood: [],
    settings: { ...defaultSettings },
    unsubscribeFunctions: {},
    chatMessages: [],
    assistantBusy: false
  }),
  actions: {
    async signInGoogle() {
      const auth = getAuth()
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      this.user = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoUrl: result.user.photoURL
      }
      this.initRef()
    },
    async registerWithEmail(email, password, name) {
      const auth = getAuth()
      auth.useDeviceLanguage()
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, {
        displayName: name
      })
      this.user = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoUrl: result.user.photoURL
      }
      this.initRef()
    },
    async signInWithEmail(email, password) {
      const auth = getAuth()
      auth.useDeviceLanguage()
      const result = await signInWithEmailAndPassword(auth, email, password)
      this.user = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoUrl: result.user.photoURL
      }
      this.initRef()
    },
    autoSignIn(user) {
      this.user = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL
      }
    },
    checkAuthState() {
      const auth = getAuth()
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.autoSignIn(user)
          this.initRef()
        } else {
          this.unsubscribeAll()
          this.user = null
        }
      })
    },
    async signOut() {
      const auth = getAuth()
      try {
        await signOut(auth)
        this.unsubscribeAll()
        this.user = null
      } catch (error) {
        console.error(error)
      }
    },
    async resetPassword(email) {
      const auth = getAuth()
      auth.useDeviceLanguage()
      await sendPasswordResetEmail(auth, email)
    },
    async sendChatMessage(message) {
      if (!this.settings.license) return

      const vertexAI = getVertexAI()
      const model = getGenerativeModel(vertexAI, { model: 'gemini-2.0-flash' })

      const todayEntries = this.pheDiary.filter(
        (entry) => entry.date === new Date().toISOString().split('T')[0]
      )

      const context = {
        todayPhe: todayEntries.reduce((sum, entry) => sum + entry.phe, 0),
        todayKcal: todayEntries.reduce((sum, entry) => sum + entry.kcal, 0),
        maxPhe: this.settings.maxPhe,
        maxKcal: this.settings.maxKcal,
        recentLabValues: this.labValues.length
          ? [...this.labValues].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          : null
      }

      const systemPrompt = `You are a helpful assistant for people with PKU (Phenylketonuria).
Today's nutrition: ${context.todayPhe}mg Phe (${Math.round((context.todayPhe / context.maxPhe) * 100)}% of daily limit)
${context.todayKcal}kcal (${Math.round((context.todayKcal / context.maxKcal) * 100)}% of daily limit)
Latest Phe blood level: ${context.recentLabValues?.phe || 'unknown'} ${this.settings.labUnit}
Keep responses concise and focused on PKU diet advice.`

      this.chatMessages.push({ role: 'user', content: message })
      this.assistantBusy = true

      try {
        const result = await model.generateContent([
          { role: 'system', content: systemPrompt },
          ...this.chatMessages.slice(-4)
        ])

        const response = result.response.text()
        this.chatMessages.push({ role: 'assistant', content: response })

        // Save to Firebase
        const db = getDatabase()
        const chatRef = ref(db, `${this.user.id}/chatMessages`)
        set(chatRef, this.chatMessages.slice(-10))
      } catch (error) {
        console.error('Chat error:', error)
      } finally {
        this.assistantBusy = false
      }
    },
    initRef() {
      const db = getDatabase()
      const userId = this.user.id
      const initialState = {
        pheLog: [],
        pheDiary: [],
        labValues: [],
        ownFood: [],
        settings: { ...defaultSettings },
        chatMessages: []
      }

      const bindRef = (key, dbRef) => {
        const unsubscribe = onValue(dbRef, (snapshot) => {
          const data = snapshot.val()
          const isInitiallyArray = Array.isArray(initialState[key])

          if (data && typeof data === 'object') {
            if (isInitiallyArray) {
              this[key] = Object.entries(data).map(([key, value]) => ({ ...value, '.key': key }))
            } else if (key === 'settings') {
              this[key] = { ...defaultSettings, ...data }
            } else {
              this[key] = data
            }
          } else {
            if (isInitiallyArray) {
              this[key] = []
            } else if (key === 'settings') {
              this[key] = { ...defaultSettings }
            } else {
              this[key] = {}
            }
          }
        })
        this.unsubscribeFunctions[key] = unsubscribe
      }

      bindRef('pheLog', ref(db, `${userId}/pheLog`))
      bindRef('pheDiary', ref(db, `${userId}/pheDiary`))
      bindRef('labValues', ref(db, `${userId}/labValues`))
      bindRef('ownFood', ref(db, `${userId}/ownFood`))
      bindRef('settings', ref(db, `${userId}/settings`))
      bindRef('chatMessages', ref(db, `${userId}/chatMessages`))
    },
    unsubscribeAll() {
      Object.values(this.unsubscribeFunctions).forEach((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
      this.unsubscribeFunctions = {}
    }
  },
  getters: {
    getUser: (state) => state.user
  }
})
