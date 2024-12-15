import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/api/axios'

export const useAdminOrdersStore = defineStore('adminOrders', () => {
  // Stati reattivi
  const productsToManage = ref([]) // Array reattivo per i prodotti
  const loading = ref(false) // Stato di caricamento
  const error = ref(null) // Gestione errori
  const groupedOrders = ref([]) // Ordini raggruppati
  const showOrderList = ref(false) // Mostra/nasconde la lista degli ordini
  const showOrdersTable = ref(false) // Stato per mostrare la tabella degli ordini
  const showProductsTable = ref(false) // Stato per mostrare la tabella dei prodotti

  const toggleShowOrdersTable = () => {
    showOrdersTable.value = !showOrdersTable.value
    showProductsTable.value = false // Nasconde la tabella prodotti
  }

  const toggleShowProductsTable = () => {
    showProductsTable.value = !showProductsTable.value
    showOrdersTable.value = false // Nasconde la tabella ordini
  }

  // Funzione per recuperare i prodotti
  const fetchAdminProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/ordine_dettagli/admin_dettagli', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
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

  // Funzione per aggiornare lo stato di un ordine
  const updateProductState = async (id_dettaglio, payload) => {
    try {
      await axios.put(`/ordine_dettagli/${id_dettaglio}/aggiorna_stato`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })
      console.log("Stato dell'ordine aggiornato con successo.")
      await fetchAdminOrders('Creato')
    } catch (err) {
      console.error("Errore nell'aggiornamento dello stato dell'ordine:", err)
    }
  }

  // Funzione per recuperare e raggruppare gli ordini per ID Ordine
  const fetchAdminOrders = async (filterStatus = 'Creato') => {
    try {
      const response = await axios.get('/ordine_dettagli/admin_dettagli', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })

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

      groupedOrders.value = Object.values(orderMap)
    } catch (err) {
      console.error('Errore nel recupero degli ordini:', err)
    }
  }

  // Mostra/nasconde la lista degli ordini
  const toggleOrderList = () => {
    showOrderList.value = !showOrderList.value
  }

  // Computed per il conteggio degli ordini
  const orderCount = computed(() => groupedOrders.value.length)

  return {
    productsToManage,
    loading,
    error,
    groupedOrders,
    showOrderList,
    showOrdersTable,
    showProductsTable,
    orderCount,
    fetchAdminProducts,
    fetchAdminOrders,
    updateProductState,
    toggleOrderList,
    toggleShowOrdersTable, // Funzione per alternare ordini
    toggleShowProductsTable, // Funzione per alternare prodotti
  }
})
