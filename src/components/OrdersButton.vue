<template>
  <button class="btn btn-outline-primary btn-icon" @click="goToDashboard" title="Dashboard">
    <i class="fas fa-box"></i>
  </button>
</template>

<script>
import '@/assets/styles/ButtonStyles.css'
import useOrdersLogic from '@/logic/useOrdersLogic'

export default {
  name: 'OrdersButton',
  setup() {
    const { goToDashboard } = useOrdersLogic()
    return { goToDashboard }
  },
}
</script>
