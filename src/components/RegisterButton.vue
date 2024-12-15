<template>
  <button class="btn btn-outline-success btn-icon" @click="goToRegister" title="Registrati">
    <i class="fas fa-user-plus"></i>
  </button>
</template>

<script>
import '@/assets/styles/ButtonStyles.css'
import useRegisterLogic from '@/logic/useRegisterLogic'

export default {
  name: 'RegisterButton',
  setup() {
    const { goToRegister } = useRegisterLogic()
    return { goToRegister }
  },
}
</script>
