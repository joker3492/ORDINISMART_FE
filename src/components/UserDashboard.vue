<template>
  <div class="user-dashboard container mt-4">
    <h2 class="text-primary text-center mb-4">I tuoi Ordini</h2>
    <div v-if="ordini.length">
      <table class="table table-striped">
        <thead class="table-primary">
          <tr>
            <th>ID Ordine</th>
            <th>Data Ordine</th>
            <th>Totale</th>
            <th>Stato</th>
            <th class="text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ordine in ordini" :key="ordine.id">
            <td>{{ ordine.id }}</td>
            <td>{{ ordine.data_creazione }}</td>
            <td>{{ ordine.totale.toFixed(2) }} €</td>
            <td>{{ ordine.stato_corrente }}</td>
            <td class="text-center">
              <button
                @click="showOrderDetails(ordine.id)"
                :disabled="selectedOrder !== null"
                class="btn btn-sm btn-primary"
              >
                Dettagli
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-muted text-center">
      <p>Nessun ordine trovato.</p>
    </div>

    <!-- Modale per i dettagli -->
    <OrderDetailTable v-if="selectedOrder" :ordineId="selectedOrder" @close="closeOrderDetails" />
  </div>
</template>

<script>
import useDashUser from '@/logic/useDashUser'
import OrderDetailTable from '@/components/OrderDetailTable.vue'
import { ref } from 'vue'

export default {
  name: 'UserDashboard',
  components: {
    OrderDetailTable,
  },
  setup() {
    const { ordini, fetchOrders } = useDashUser()
    const selectedOrder = ref(null)

    const showOrderDetails = (ordineId) => {
      if (selectedOrder.value === null) {
        selectedOrder.value = ordineId
      }
    }

    const closeOrderDetails = () => {
      selectedOrder.value = null
    }

    fetchOrders()

    return { ordini, selectedOrder, showOrderDetails, closeOrderDetails }
  },
}
</script>
