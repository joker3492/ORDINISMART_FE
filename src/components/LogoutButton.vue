<template>
  <button class="btn btn-outline-danger btn-icon" @click="handleLogout" title="Logout">
    <i class="fas fa-sign-out-alt"></i>
  </button>
</template>

<script>
import '@/assets/styles/ButtonStyles.css'
import useLogoutLogic from '@/logic/useLogoutLogic'

export default {
  name: 'LogoutButton',
  setup() {
    const { handleLogout } = useLogoutLogic()
    return { handleLogout }
  },
}
</script>
