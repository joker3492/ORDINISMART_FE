import { ref } from 'vue'
import axios from '@/api/axios'

export default function useDashUser() {
  const ordini = ref([]) // Lista degli ordini
  const dettagliOrdine = ref(null) // Dettagli di un ordine specifico

  // Mappa degli ID stato con le loro descrizioni
  const statoLabels = {
    1: 'Creato',
    2: 'In Lavorazione',
    3: 'Evaso',
    4: 'Annullato',
  }

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
    return new Date(dateString).toLocaleDateString('it-IT', options)
  }

  // Recupera tutti gli ordini per l'utente autenticato
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken') // Ottieni il token JWT
      const response = await axios.get('/ordini/', {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Per ogni ordine, ottieni i log degli stati
      const ordersWithState = await Promise.all(
        response.data.ordini.map(async (ordine) => {
          try {
            const logResponse = await axios.get(`/log_stato/${ordine.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })

            // Filtra e ordina i log per data e ottieni l'ultimo stato
            const logStati = logResponse.data.log_stati
            const ultimoLog = logStati.length
              ? logStati.sort((a, b) => new Date(b.data) - new Date(a.data))[0]
              : null

            return {
              ...ordine,
              data_creazione: formatDate(ordine.data_creazione), // Formatta la data
              stato_corrente: ultimoLog ? statoLabels[ultimoLog.id_stato] || 'Sconosciuto' : 'N/A', // Traduce id_stato in etichetta
            }
          } catch (logError) {
            console.error(
              `Errore durante il recupero dello stato dell'ordine ${ordine.id}:`,
              logError.response?.data || logError.message,
            )
            return {
              ...ordine,
              data_creazione: formatDate(ordine.data_creazione),
              stato_corrente: 'Errore',
            }
          }
        }),
      )

      ordini.value = ordersWithState
    } catch (error) {
      console.error(
        'Errore durante il recupero degli ordini:',
        error.response?.data || error.message,
      )
      alert('Errore durante il recupero degli ordini. Riprova più tardi.')
    }
  }

  // Recupera i dettagli di un ordine specifico
  const visualizzaDettaglio = async (ordineId) => {
    try {
      const token = localStorage.getItem('accessToken') // Ottieni il token JWT
      const ordineResponse = await axios.get(`/ordine_dettagli/${ordineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const logResponse = await axios.get(`/log_stato/${ordineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      dettagliOrdine.value = {
        id: ordineId,
        prodotti: ordineResponse.data.prodotti,
        logStati: logResponse.data.log_stati.map((log) => ({
          id: log.id,
          data: formatDate(log.data), // Formatta la data
          descrizione: statoLabels[log.id_stato] || 'Sconosciuto', // Traduce id_stato in etichetta
        })),
      }
    } catch (error) {
      console.error(
        "Errore durante il recupero dei dettagli dell'ordine:",
        error.response?.data || error.message,
      )
      alert("Errore durante il recupero dei dettagli dell'ordine.")
    }
  }

  return {
    ordini,
    dettagliOrdine,
    fetchOrders,
    visualizzaDettaglio,
  }
}
