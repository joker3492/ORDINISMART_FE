import { ref } from 'vue'
import axios from '@/api/axios'

export default function useOrderDetails(ordineId) {
  const ordine = ref(null)
  const prodottiAggregati = ref([])
  const loading = ref(true)
  const error = ref(null)

  const fetchOrderDetails = async () => {
    try {
      // Chiamata API per ottenere i dettagli dell'ordine
      const response = await axios.get(`/ordine_dettagli/${ordineId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Passa il token JWT
        },
      })

      // Salva i dati ricevuti
      ordine.value = response.data

      // Aggrega e formatta i dati per la visualizzazione
      prodottiAggregati.value = ordine.value.dettagli.map((dettaglio) => ({
        id: dettaglio.id,
        nome: dettaglio.prodotto?.nome || 'Sconosciuto', // Recupera il nome del prodotto
        quantita: dettaglio.quantita, // Quantità acquistata
        prezzo_unitario: dettaglio.prezzo_unitario, // Prezzo unitario
        totale: dettaglio.quantita * dettaglio.prezzo_unitario, // Totale calcolato
        stato: dettaglio.stato || 'N/A', // Stato del prodotto
      }))
    } catch (err) {
      error.value = 'Errore nel caricamento dei dettagli ordine.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return { ordine, prodottiAggregati, loading, error, fetchOrderDetails }
}
