<template>
  <div>
    <h1>Gestione Ordini</h1>

    <!-- Messaggi di caricamento o errore -->
    <div v-if="loading" class="alert alert-info">Caricamento prodotti...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Tabella dei prodotti -->
    <table v-if="!loading && !error" class="table table-striped">
      <thead class="table-primary">
        <tr>
          <th>ID Ordine</th>
          <th>Nome Prodotto</th>
          <th>Quantità</th>
          <th>Prezzo Unitario</th>
          <th>Stato</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in productsToManage" :key="product.id">
          <td>{{ product.id_ordine || 'N/A' }}</td>
          <!-- Mostra l'ID Ordine -->
          <td>{{ product.nome_prodotto || 'N/A' }}</td>
          <!-- Mostra il Nome Prodotto -->
          <td>{{ product.quantita }}</td>
          <!-- Quantità -->
          <td>&euro; {{ product.prezzo_unitario.toFixed(2) }}</td>
          <!-- Prezzo Unitario -->
          <td>
            <!-- Dropdown per la modifica dello stato -->
            <template v-if="product.id === editingProductId">
              <select
                v-model="product.nuovoStato"
                class="form-select"
                @change="updateState(product)"
              >
                <option value="Creato">Creato</option>
                <option value="In Lavorazione">In Lavorazione</option>
                <option value="Evaso">Evaso</option>
                <option value="Annullato">Annullato</option>
              </select>
            </template>
            <template v-else>
              {{ product.stato }}
            </template>
          </td>
          <td>
            <button @click="openEditModal(product)" class="btn btn-warning btn-sm">
              <i class="fas fa-pencil-alt"></i>
            </button>
          </td>
        </tr>
        <tr v-if="productsToManage.length === 0">
          <td colspan="6" class="text-center">Nessun prodotto trovato</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { storeToRefs } from 'pinia'
import { useAdminOrdersStore } from '@/stores/adminOrdersStore'
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const adminOrdersStore = useAdminOrdersStore()
    const { productsToManage, loading, error } = storeToRefs(adminOrdersStore)
    const { fetchAdminProducts, updateProductState } = adminOrdersStore

    const editingProductId = ref(null)

    onMounted(async () => {
      await fetchAdminProducts()
    })

    const openEditModal = (product) => {
      editingProductId.value = product.id
      product.nuovoStato = product.stato
    }

    const updateState = async (product) => {
      const payload = { nuovo_stato: product.nuovoStato }
      await updateProductState(product.id, payload)
      product.stato = product.nuovoStato
      editingProductId.value = null
    }

    return {
      productsToManage,
      loading,
      error,
      openEditModal,
      updateState,
      editingProductId,
    }
  },
}
</script>
