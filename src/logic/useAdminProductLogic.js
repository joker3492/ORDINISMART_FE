import { ref } from 'vue'
import axios from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

export default function useAdminProductLogic() {
  const prodotti = ref([])
  const categorie = ref([])
  const loading = ref(false)
  const error = ref(null)
  const productCount = ref(0)

  // Recupera tutti i prodotti da gestire
  const fetchProductsToManage = async () => {
    try {
      const response = await axios.get('/prodotti_da_gestire/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      productCount.value = response.data.prodotti.length
    } catch (err) {
      console.error('Errore durante il recupero dei prodotti da gestire:', err.message)
    }
  }

  // Recupera tutti i prodotti
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      const user = authStore.user

      //  le categorie siano caricate prima
      if (categorie.value.length === 0) {
        await fetchCategories()
      }

      const response = await axios.get('/prodotti/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })

      prodotti.value = response.data.prodotti.filter(
        (product) => product.id_admin === Number(user.id),
      )
    } catch (err) {
      error.value = 'Errore durante il recupero dei prodotti: ' + err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Recupera tutte le categorie
  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await axios.get('/categorie/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })
      categorie.value = response.data
      console.log('Categorie recuperate:', categorie.value) // Debug
    } catch (err) {
      console.error('Errore durante il recupero delle categorie:', err)
    } finally {
      loading.value = false
    }
  }

  const addCategory = async (categoryDescription) => {
    try {
      console.log('Valore ricevuto per categoryDescription:', categoryDescription)

      // Estrarre direttamente la descrizione se viene passato un oggetto.
      const valueToCheck =
        typeof categoryDescription === 'object' && categoryDescription.descrizione
          ? categoryDescription.descrizione
          : String(categoryDescription)

      console.log('Valore convertito a stringa:', valueToCheck)

      // Verifica che il valore sia una stringa valida
      if (!valueToCheck || valueToCheck.trim() === '') {
        throw new Error(
          'La descrizione della categoria è obbligatoria e deve essere una stringa valida.',
        )
      }

      // Passa il payload corretto
      await axios.post(
        '/categorie/',
        { descrizione: valueToCheck.trim() },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        },
      )
      await fetchCategories()
    } catch (err) {
      console.error("Errore durante l'aggiunta della categoria:", err.message)
    }
  }

  const addProduct = async (product) => {
    try {
      const payload = {
        id_categoria: product.id_categoria,
        nome: product.nome.trim(),
        prezzo: parseFloat(product.prezzo),
        quantita: parseInt(product.quantita, 10),
      }

      // Aggiungi url_foto solo se esiste
      if (product.url && product.url.trim() !== '') {
        payload.url_foto = product.url.trim()
      }

      console.log('Payload inviato:', payload) // Debug

      const response = await axios.post('/prodotti/', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })

      console.log('Prodotto aggiunto:', response.data) // Debug
      await fetchProducts()
    } catch (err) {
      error.value = "Errore durante l'aggiunta del prodotto: " + err.message
      console.error('Errore nel POST del prodotto:', err.response?.data || err.message)
    }
  }

  const updateProduct = async (id, product) => {
    try {
      const payload = {
        id_categoria: product.id_categoria,
        nome: product.nome.trim(),
        prezzo: parseFloat(product.prezzo),
        quantita: parseInt(product.quantita, 10),
      }

      // Aggiungi url_foto solo se esiste
      if (product.url_foto && product.url_foto.trim() !== '') {
        payload.url_foto = product.url_foto.trim()
      }

      console.log('Payload inviato per aggiornare il prodotto:', payload) // Debug

      await axios.put(`/prodotti/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })

      console.log('Prodotto aggiornato con successo.') // Debug
      await fetchProducts() // Aggiorna la lista dei prodotti
    } catch (err) {
      error.value = 'Errore durante la modifica del prodotto: ' + err.message
      console.error('Errore nel PUT del prodotto:', err.response?.data || err.message)
    }
  }

  // Elimina un prodotto
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/prodotti/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      })
      fetchProducts()
    } catch (err) {
      error.value = "Errore durante l'eliminazione del prodotto: " + err.message
      console.error(err)
    }
  }

  return {
    prodotti,
    categorie,
    loading,
    error,
    productCount,
    fetchProductsToManage,
    fetchProducts,
    fetchCategories,
    addCategory,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
