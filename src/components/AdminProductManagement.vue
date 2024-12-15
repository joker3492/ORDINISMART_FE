<template>
  <div class="main-container">
    <!-- Bottoni per aggiungere prodotto e visualizzare prodotti -->
    <div class="button-group mb-4 d-flex gap-2">
      <button class="btn btn-primary" @click="openModal('add')">
        <i class="bi bi-plus-circle"></i> Aggiungi Prodotto
      </button>
      <button class="btn btn-info" @click="toggleShowProductsTable">
        <i class="bi bi-eye"></i>
        {{ showProductsTable ? 'Nascondi Prodotti' : 'Visualizza Prodotti' }}
      </button>
    </div>

    <!-- Tabella Prodotti -->
    <div v-if="showProductsTable">
      <h1>Gestione Prodotti</h1>
      <table class="table table-striped">
        <thead class="table-primary">
          <tr>
            <th>Nome</th>
            <th>Prezzo</th>
            <th>Quantità</th>
            <th>Categoria</th>
            <th>Immagine</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in prodotti" :key="product.id">
            <td>{{ product.nome }}</td>
            <td>&euro; {{ product.prezzo.toFixed(2) }}</td>
            <td>{{ product.quantita }}</td>
            <td>{{ getCategoriaDescrizione(product.id_categoria) }}</td>
            <td>
              <img
                :src="product.url || 'https://via.placeholder.com/100'"
                alt="Immagine prodotto"
                class="img-thumbnail"
                style="max-width: 100px"
              />
            </td>
            <td>
              <button @click="openModal('edit', product)" class="btn btn-warning btn-sm">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button @click="deleteProduct(product.id)" class="btn btn-danger btn-sm">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="prodotti.length === 0 && !loading">
            <td colspan="6" class="text-center">Nessun prodotto trovato.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Gestione Stato Prodotti -->
    <div v-else>
      <AdminProductState />
    </div>

    <!-- Modal riutilizzabile per aggiungere o modificare prodotto -->
    <div class="modal fade show d-block" tabindex="-1" v-if="showModal" @click.self="closeModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="nome" class="form-label">Nome Prodotto</label>
                <input
                  type="text"
                  v-model="currentProduct.nome"
                  class="form-control"
                  id="nome"
                  placeholder="Nome prodotto"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="prezzo" class="form-label">Prezzo</label>
                <input
                  type="number"
                  v-model="currentProduct.prezzo"
                  class="form-control"
                  id="prezzo"
                  placeholder="Prezzo"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="quantita" class="form-label">Quantità</label>
                <input
                  type="number"
                  v-model="currentProduct.quantita"
                  class="form-control"
                  id="quantita"
                  placeholder="Quantità"
                  min="1"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="categoria" class="form-label">Categoria</label>
                <select
                  id="categoria"
                  v-model="currentProduct.id_categoria"
                  class="form-select"
                  required
                >
                  <option value="" disabled>Seleziona una categoria</option>
                  <option
                    v-for="categoria in categorie.categorie"
                    :key="categoria.id"
                    :value="categoria.id"
                  >
                    {{ categoria.descrizione }}
                  </option>
                </select>
                <button type="button" class="btn btn-link mt-2" @click="openCategoryModal">
                  Aggiungi Nuova Categoria
                </button>
              </div>
              <div class="mb-3">
                <label for="url" class="form-label">URL Immagine</label>
                <input
                  type="text"
                  v-model="currentProduct.url"
                  class="form-control"
                  id="url"
                  placeholder="URL immagine prodotto"
                />
              </div>
              <button type="submit" class="btn btn-success">
                <i class="bi bi-save"></i> Salva
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale per Aggiungere Nuova Categoria -->
    <div
      class="modal fade show d-block"
      tabindex="-1"
      v-if="showCategoryModal"
      @click.self="closeCategoryModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Aggiungi Nuova Categoria</h5>
            <button type="button" class="btn-close" @click="closeCategoryModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNewCategory">
              <div class="mb-3">
                <label for="newCategory" class="form-label">Descrizione Nuova Categoria</label>
                <input
                  type="text"
                  v-model="newCategory"
                  class="form-control"
                  id="newCategory"
                  placeholder="Inserisci nuova categoria"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success">
                <i class="bi bi-plus-circle"></i> Aggiungi Categoria
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Messaggio di caricamento -->
    <div v-if="loading" class="text-center mt-4">
      <span class="spinner-border text-primary"></span>
      <p>Caricamento prodotti...</p>
    </div>
    <div v-if="error" class="alert alert-danger mt-4">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AdminProductState from '@/components/AdminProductState.vue'
import useAdminProductLogic from '@/logic/useAdminProductLogic'
import '@/assets/styles/ButtonStyles.css'
import { useAdminOrdersStore } from '@/stores/adminOrdersStore'
import { storeToRefs } from 'pinia'

export default {
  components: {
    AdminProductState,
  },
  setup() {
    // Collega lo store
    const adminOrdersStore = useAdminOrdersStore()
    const { showOrdersTable, showProductsTable } = storeToRefs(adminOrdersStore)
    const { toggleShowOrdersTable, toggleShowProductsTable, fetchAdminOrders } = adminOrdersStore

    const {
      prodotti,
      categorie,
      fetchProducts,
      fetchCategories,
      addProduct,
      deleteProduct,
      updateProduct,
      addCategory,
      loading,
      error,
    } = useAdminProductLogic()

    const isStateModalOpen = ref(false)
    const selectedProduct = ref(null)

    const showModal = ref(false)
    const showCategoryModal = ref(false)
    const modalTitle = ref('')
    const actionType = ref('add')
    const newCategory = ref('')
    const currentProduct = ref({
      nome: '',
      prezzo: 0,
      quantita: 1,
      url: '',
      id_categoria: null,
    })

    fetchProducts()
    fetchCategories()

    const openModal = (type, product = null) => {
      actionType.value = type
      modalTitle.value = type === 'add' ? 'Aggiungi Nuovo Prodotto' : 'Modifica Prodotto'
      currentProduct.value = product
        ? { ...product }
        : { nome: '', prezzo: 0, quantita: 1, url: '', id_categoria: null }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    const openCategoryModal = () => {
      showCategoryModal.value = true
      newCategory.value = '' // Pulisce il campo input
    }

    const closeCategoryModal = () => {
      showCategoryModal.value = false
      newCategory.value = '' // Resetta il campo input
    }

    const handleSubmit = async () => {
      try {
        if (!currentProduct.value.id_categoria) {
          throw new Error('La categoria è obbligatoria.')
        }

        if (actionType.value === 'add') {
          await addProduct(currentProduct.value)
        } else if (actionType.value === 'edit') {
          await updateProduct(currentProduct.value.id, currentProduct.value)
        }

        await fetchProducts()
        closeModal()
      } catch (err) {
        console.error('Errore durante il salvataggio del prodotto:', err.message)
      }
    }

    const addNewCategory = async () => {
      try {
        const categoryDescription = newCategory.value.trim()
        if (!categoryDescription) {
          throw new Error('La descrizione della categoria non può essere vuota.')
        }

        await addCategory({ descrizione: categoryDescription }) // Aggiunge la categoria
        await fetchCategories() // Aggiorna la lista categorie
        closeCategoryModal() // Chiude il modale
      } catch (err) {
        console.error("Errore durante l'aggiunta della categoria:", err.message)
      }
    }

    const getCategoriaDescrizione = (id_categoria) => {
      const categoria = categorie.value?.categorie?.find((cat) => cat.id === id_categoria)
      return categoria ? categoria.descrizione : 'Non specificata'
    }

    return {
      prodotti,
      categorie,
      currentProduct,
      fetchProducts,
      fetchCategories,
      handleSubmit,
      addNewCategory,
      showOrdersTable,
      showProductsTable,
      toggleShowProductsTable, // Aggiunta la variabile
      openModal,
      openCategoryModal,
      closeModal,
      closeCategoryModal,
      deleteProduct,
      toggleShowOrdersTable,
      loading,
      error,
      showModal,
      showCategoryModal,
      modalTitle,
      newCategory,
      getCategoriaDescrizione,
      isStateModalOpen,
      selectedProduct,
    }
  },
}
</script>
