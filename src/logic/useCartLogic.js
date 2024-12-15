import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from '@/api/axios'

export default function useCartLogic() {
  const auth = useAuthStore()
  const showCart = ref(false)

  const toggleCart = () => {
    showCart.value = !showCart.value
  }

  // Numero totale articoli
  const cartCount = computed(() => auth.cart.reduce((total, item) => total + item.quantity, 0))

  // Elementi nel carrello
  const cartItems = computed(() => auth.cart)

  // Aggiungi prodotto al carrello
  const addToCart = (productId, quantity) => {
    const existingItem = auth.cart.find((item) => item.id === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const product = auth.products.find((item) => item.id === productId)
      auth.cart.push({ ...product, quantity })
    }
  }

  // Incrementa quantità
  const increaseQuantity = (productId) => {
    addToCart(productId, 1)
  }

  // Decrementa quantità
  const decreaseQuantity = (productId) => {
    const product = auth.cart.find((item) => item.id === productId)
    if (product && product.quantity > 1) {
      product.quantity -= 1
    } else {
      removeFromCart(productId)
    }
  }

  // Rimuove dal carrello
  const removeFromCart = (productId) => {
    auth.cart = auth.cart.filter((item) => item.id !== productId)
  }

  // Crea ordine
  const createOrder = async () => {
    try {
      // Trasferisci il carrello locale al backend
      for (const item of auth.cart) {
        await axios.post(`/carrello/${item.id}`, { quantita: item.quantity })
      }

      // Crea l'ordine
      const response = await axios.post('/ordini/')
      alert('Ordine creato con successo!')
      auth.cart = [] // Svuota il carrello locale
      showCart.value = false
    } catch (error) {
      console.error('Errore durante creazione ordine:', error.response?.data || error.message)
      alert('Errore durante creazione ordine. Verifica i dettagli.')
    }
  }

  return {
    cartCount,
    cartItems,
    toggleCart,
    showCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    createOrder,
  }
}
