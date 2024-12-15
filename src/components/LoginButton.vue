<template>
  <button class="btn btn-outline-primary btn-icon" @click="goToLogin" title="Login">
    <i class="fas fa-sign-in-alt"></i>
  </button>
</template>

<script>
import '@/assets/styles/ButtonStyles.css'
import useLoginLogic from '@/logic/useLoginLogic'

export default {
  name: 'LoginButton',
  setup() {
    const { goToLogin } = useLoginLogic()
    return { goToLogin }
  },
}
</script>
