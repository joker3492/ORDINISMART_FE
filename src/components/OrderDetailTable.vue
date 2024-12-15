<!-- OrderDetailTable Component -->
<template>
  <div class="order-detail mt-5">
    <h3 class="text-primary text-center mb-4">Dettagli Ordine #{{ ordineId }}</h3>

    <div v-if="loading" class="text-muted text-center">
      <p>Caricamento dettagli...</p>
    </div>
    <div v-else-if="error" class="text-danger text-center">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead class="table-primary">
          <tr>
            <th>Nome Prodotto</th>
            <th>Quantità</th>
            <th>Prezzo Unitario</th>
            <th>Totale</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prodotto in prodottiAggregati" :key="prodotto.id">
            <td>{{ prodotto.nome }}</td>
            <td>{{ prodotto.quantita }}</td>
            <td>{{ prodotto.prezzo_unitario.toFixed(2) }} €</td>
            <td>{{ prodotto.totale.toFixed(2) }} €</td>
            <td>
              <span
                :class="{
                  'badge bg-success': prodotto.stato === 'Completato',
                  'badge bg-warning': prodotto.stato === 'In corso',
                  'badge bg-danger': prodotto.stato === 'Annullato',
                }"
              >
                {{ prodotto.stato }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-3">
        <button @click="$emit('close')" class="btn btn-secondary">Chiudi Dettagli</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import useOrderDetails from '@/logic/useOrderDetails'

export default {
  name: 'OrderDetailTable',
  props: {
    ordineId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { prodottiAggregati, loading, error, fetchOrderDetails } = useOrderDetails(props.ordineId)

    onMounted(fetchOrderDetails)

    return { prodottiAggregati, loading, error }
  },
}
</script>
