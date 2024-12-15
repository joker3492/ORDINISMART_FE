import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/assets/styles/global.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth' // Importa lo store di autenticazione

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// Inizializza lo stato dell'autenticazione
const authStore = useAuthStore()
authStore.initializeAuth() // Recupera il token e aggiorna lo stato
