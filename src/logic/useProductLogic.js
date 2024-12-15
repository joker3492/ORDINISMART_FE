import { ref } from 'vue'
import axios from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

export default function useProductLogic() {
  const auth = useAuthStore()
  const products = ref([])
  const quantities = ref({}) // Mappa per tracciare le quantità per prodotto

  // Recupera i prodotti dal backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/prodotti/')
      products.value = response.data.prodotti
      // Inizializza le quantità a 1 per ogni prodotto
      products.value.forEach((product) => {
        quantities.value[product.id] = 1
      })
    } catch (error) {
      console.error('Errore durante il recupero dei prodotti:', error)
    }
  }

  // Aggiunge un prodotto al carrello
  const addToCart = (product) => {
    if (!auth.isAuthenticated) {
      alert('Effettua il login per aggiungere prodotti al carrello!')
      return
    }

    const quantity = quantities.value[product.id] || 1 // Ottieni la quantità selezionata
    auth.addToCart({ ...product, quantity })
    alert(`${product.nome} aggiunto al carrello con successo! (${quantity} pezzo/i)`)
  }

  const updateQuantity = (productId, quantity) => {
    quantities.value[productId] = quantity
  }

  return { products, fetchProducts, addToCart, quantities, updateQuantity }
}
