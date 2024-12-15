import { ref, computed } from 'vue'
import axios from '@/api/axios'

export default function useAdminProductStateLogic() {
  const productsToManage = ref([]) // Array reattivo per i prodotti
  const loading = ref(false)
  const error = ref(null)
  const orders = ref([]) // Lista degli ordini da gestire
  const showOrderList = ref(false) // Stato del dropdown
  const groupedOrders = ref([]) // Lista raggruppata per id_ordine

  // Funzione per recuperare tutti i prodotti
  const fetchAdminProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/ordine_dettagli/admin_dettagli', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Corretto
        },
      })
      productsToManage.value = response.data.map((product) => ({
        id: product.id,
        id_ordine: product.id_ordine,
        nome_prodotto: product.nome_prodotto,
        quantita: product.quantita,
        prezzo_unitario: product.prezzo_unitario,
        stato: product.stato,
      }))
    } catch (err) {
      error.value = 'Errore durante il caricamento dei prodotti.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Funzione per aggiornare lo stato di un prodotto
  const updateProductState = async (id_dettaglio, payload) => {
    try {
      await axios.put(`/ordine_dettagli/${id_dettaglio}/aggiorna_stato`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Corretto
        },
      })
      console.log("Stato dell'ordine aggiornato con successo.")

      // Aggiorna la lista degli ordini in tempo reale
      await fetchAdminOrders('Creato')
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato dell'ordine:", error)
    }
  }

  // Funzione per recuperare e raggruppare gli ordini per ID Ordine
  const fetchAdminOrders = async (filterStatus = 'Creato') => {
    try {
      const response = await axios.get('/ordine_dettagli/admin_dettagli', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Corretto
        },
      })

      // Raggruppa gli ordini per ID Ordine con filtro per stato
      const orderMap = {}
      response.data.forEach((order) => {
        if (order.stato === filterStatus) {
          if (!orderMap[order.id_ordine]) {
            orderMap[order.id_ordine] = {
              id_ordine: order.id_ordine,
              stato: order.stato,
              prodotti: [],
            }
          }
          orderMap[order.id_ordine].prodotti.push({
            nome_prodotto: order.nome_prodotto,
            quantita: order.quantita,
          })
        }
      })

      groupedOrders.value = Object.values(orderMap) // Converte l'oggetto in un array
    } catch (error) {
      console.error('Errore nel recupero degli ordini:', error)
    }
  }

  // Mostra o nasconde la lista degli ordini
  const toggleOrderList = () => {
    showOrderList.value = !showOrderList.value
  }

  // Conteggio degli ordini da gestire
  const orderCount = computed(() => groupedOrders.value.length)

  return {
    productsToManage,
    fetchAdminProducts,
    loading,
    updateProductState,
    error,
    orders,
    groupedOrders,
    orderCount,
    showOrderList,
    fetchAdminOrders,
    toggleOrderList,
  }
}
