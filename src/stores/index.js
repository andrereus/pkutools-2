import { defineStore } from 'pinia'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'

export const useStore = defineStore('main', {
  state: () => ({
    user: null,
    pheLog: [],
    aminoCounter: [],
    pheDiary: [],
    ownFood: [],
    settings: {}
  }),
  actions: {
    async signInGoogle() {
      const auth = getAuth()
      try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider())
        this.user = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL
        }
        this.initRef()
      } catch (error) {
        console.error(error)
      }
    },
    async signInFacebook() {
      const auth = getAuth()
      try {
        const result = await signInWithPopup(auth, new FacebookAuthProvider())
        this.user = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL
        }
        this.initRef()
      } catch (error) {
        console.error(error)
      }
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
          this.user = null
        }
      })
    },
    async signOut() {
      const auth = getAuth()
      try {
        await signOut(auth)
        this.user = null
      } catch (error) {
        console.error(error)
      }
    },
    initRef() {
      const db = getDatabase()
      const userId = this.user.id

      const bindRef = (key, dbRef) => {
        onValue(dbRef, (snapshot) => {
          this[key] = snapshot.val()
        })
      }

      bindRef('pheLog', ref(db, `${userId}/pheLog`))
      bindRef('aminoCounter', ref(db, `${userId}/aminoCounter`))
      bindRef('pheDiary', ref(db, `${userId}/pheDiary`))
      bindRef('ownFood', ref(db, `${userId}/ownFood`))
      bindRef('settings', ref(db, `${userId}/settings`))
    }
  },
  getters: {
    getUser: (state) => state.user
  }
})
