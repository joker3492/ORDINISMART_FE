import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Stato utente
    isAdmin: false, // Ruolo
    cart: [], // Carrello
    isInitialized: false, // Inizializzazione completata?
  }),

  actions: {
    // Inizializza l'autenticazione (carica il token JWT dal localStorage)
    async initializeAuth() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          // Recupera i dati dal token decodificato (è responsabilità di `useAuthLogic` passarli correttamente)
          const { sub: userId, is_admin: isAdmin } = JSON.parse(atob(token.split('.')[1])) // Decodifica solo il payload del JWT
          this.user = { id: userId } // Imposta l'utente con ID
          this.isAdmin = isAdmin || false // Imposta il ruolo
          console.log('Inizializzazione riuscita:', { user: this.user, isAdmin: this.isAdmin })
        } catch (error) {
          console.error('Errore durante l’inizializzazione:', error)
          this.logout() // Logout automatico in caso di errore
        }
      } else {
        console.warn('Nessun token trovato nel localStorage.')
      }
      this.isInitialized = true // Imposta l'inizializzazione come completata
    },

    // Effettua il login
    login(user, isAdmin) {
      try {
        // Aggiorna lo stato utente e amministratore
        this.user = user
        this.isAdmin = isAdmin

        console.log('Login completato:', { user, isAdmin })

        // Reindirizza alla dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Errore durante il login:', error)
        alert('Errore durante il login. Riprova.')
      }
    },

    // Effettua il logout
    logout() {
      this.user = null
      this.isAdmin = false
      this.isInitialized = false
      this.cart = []

      // Rimuovi token
      localStorage.removeItem('accessToken')

      // Reindirizza al login
      router.push('/login')
    },

    // Aggiungi un articolo al carrello
    addToCart(item) {
      const existingItem = this.cart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        existingItem.quantity += item.quantity || 1 // Incrementa la quantità se esiste
      } else {
        this.cart.push({ ...item, quantity: item.quantity || 1 }) // Aggiungi un nuovo articolo
      }
    },

    // Rimuovi un articolo dal carrello
    removeFromCart(itemId) {
      this.cart = this.cart.filter((item) => item.id !== itemId)
    },

    // Aggiorna la quantità di un articolo nel carrello
    updateCartItemQuantity(itemId, quantity) {
      const cartItem = this.cart.find((item) => item.id === itemId)
      if (cartItem) {
        cartItem.quantity = quantity
        if (cartItem.quantity <= 0) {
          this.removeFromCart(itemId) // Rimuovi se quantità <= 0
        }
      }
    },

    // Svuota completamente il carrello
    clearCart() {
      this.cart = []
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user, // Verifica se l'utente è autenticato
    cartCount: (state) => state.cart.reduce((total, item) => total + item.quantity, 0), // Numero totale di articoli nel carrello
    cartTotalPrice: (state) =>
      state.cart.reduce((total, item) => total + item.price * item.quantity, 0), // Prezzo totale
  },
})
