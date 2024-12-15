<template>
  <div class="admin-container">
    <button class="btn-admin" @click="handleShowOrdersTable" title="Ordini da gestire">
      <i class="fas fa-clipboard-list"></i>
      <span v-if="orderCount > 0" class="admin-badge">{{ orderCount }}</span>
    </button>
  </div>
</template>

<script>
import { useAdminOrdersStore } from '@/stores/adminOrdersStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

export default {
  setup() {
    const adminOrdersStore = useAdminOrdersStore()
    const { orderCount } = storeToRefs(adminOrdersStore)
    const { toggleShowOrdersTable, fetchAdminOrders } = adminOrdersStore

    const handleShowOrdersTable = () => {
      toggleShowOrdersTable()
    }

    onMounted(async () => {
      await fetchAdminOrders()
    })

    return {
      orderCount,
      handleShowOrdersTable,
    }
  },
}
</script>
