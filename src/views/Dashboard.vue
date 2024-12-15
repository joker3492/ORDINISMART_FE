<script>
import { useAuthStore } from '@/stores/auth'
import UserDashboard from '@/components/UserDashboard.vue'
import AdminProductManagement from '@/components/AdminProductManagement.vue'
import { onMounted, watch } from 'vue'

export default {
  name: 'Dashboard',
  components: {
    UserDashboard,
    AdminProductManagement,
  },
  setup() {
    const auth = useAuthStore()

    // Osserva i cambiamenti di isInitialized e forza il controllo
    watch(
      () => auth.isInitialized,
      (isInitialized) => {
        if (isInitialized) {
          console.log('Inizializzazione completata:', auth.isAdmin ? 'Admin' : 'User')
        }
      },
    )

    // Forza una verifica del ruolo ogni volta che l'utente cambia
    watch(
      () => auth.user,
      (user) => {
        if (!user) {
          console.warn('Utente non autenticato, reindirizzamento al login.')
          auth.logout()
        }
      },
    )

    // Inizializza l'autenticazione all'avvio
    onMounted(() => {
      if (!auth.isInitialized) {
        auth.initializeAuth()
      }
    })

    return { auth }
  },
}
</script>

<template>
  <div>
    <!-- Mostra caricamento durante l'inizializzazione -->
    <div v-if="!auth.isInitialized" class="loading">
      <h2>Caricamento...</h2>
    </div>

    <!-- Mostra la dashboard solo dopo l'inizializzazione -->
    <div v-else-if="auth.user" class="main-container">
      <h1>Dashboard</h1>
      <!-- Contenuto Admin -->
      <div v-if="auth.isAdmin">
        <h3>Sezione Amministratore</h3>
        <AdminProductManagement />
      </div>
      <!-- Contenuto Utente -->
      <div v-else>
        <p>Area Cliente</p>
        <UserDashboard />
      </div>
    </div>

    <!-- Mostra un messaggio di errore se non è autenticato -->
    <div v-else class="error">
      <h2>Errore: utente non autenticato.</h2>
      <p>Reindirizzamento al login...</p>
    </div>
  </div>
</template>
