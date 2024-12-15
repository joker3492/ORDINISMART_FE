import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from '@/api/axios'
import jwt_decode from 'jwt-decode'
import { useRouter } from 'vue-router'

export default function useAuthLogic(isLogin) {
  const auth = useAuthStore()
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const errorMessage = ref('')

  const handleSubmit = async () => {
    errorMessage.value = ''
    loading.value = true

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/auth/login', {
          username: username.value,
          password: password.value,
        })

        const token = response.data.access_token
        const decodedToken = jwt_decode(token)

        console.log('Decoded Token:', decodedToken) // Log per verificare il token

        // Estrai il ruolo dal token
        const isAdmin = decodedToken.is_admin || false

        // Recupera i dettagli aggiuntivi dell'utente
        const userId = decodedToken.sub
        const userDetailsResponse = await axios.get(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passa il token nell'header
          },
        })

        const userDetails = userDetailsResponse.data

        auth.login(
          { id: userId, name: userDetails.username }, // Usa i dettagli utente recuperati
          isAdmin,
        )
        localStorage.setItem('accessToken', token)

        alert('Login effettuato con successo!')

        // Reindirizzamento in base al ruolo
        router.push(isAdmin ? '/dashboard' : '/') // Usa il router per reindirizzare
      } else {
        // Registrazione
        const registerResponse = await axios.post('/auth/register', {
          username: username.value,
          password: password.value,
        })

        alert(`Registrazione completata! Accesso in corso...`)

        // Login automatico
        const loginResponse = await axios.post('/auth/login', {
          username: username.value,
          password: password.value,
        })

        const token = loginResponse.data.access_token
        const decodedToken = jwt_decode(token)

        const isAdmin = decodedToken.is_admin || false

        // Recupera i dettagli aggiuntivi dell'utente
        const userId = decodedToken.sub
        const userDetailsResponse = await axios.get(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const userDetails = userDetailsResponse.data

        auth.login(
          { id: userId, name: userDetails.username }, // Usa i dettagli utente recuperati
          isAdmin,
        )
        localStorage.setItem('accessToken', token)

        // Reindirizzamento alla home
        router.push('/')
      }
    } catch (error) {
      console.error('Errore:', error.response?.data || error.message) // Log degli errori
      errorMessage.value = error.response?.data?.message || "Errore durante l'operazione."
    } finally {
      loading.value = false
    }
  }

  const buttonText = isLogin ? 'Accedi' : 'Registrati'
  const title = isLogin ? 'Accedi' : 'Registrati'
  const submitButtonClass = isLogin ? 'btn btn-primary' : 'btn btn-success'

  return {
    username,
    password,
    confirmPassword,
    handleSubmit,
    buttonText,
    title,
    submitButtonClass,
    loading,
    errorMessage,
  }
}
