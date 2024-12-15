<template>
  <button
    class="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#hamburgerMenu"
    aria-controls="hamburgerMenu"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="hamburgerMenu">
    <ul class="navbar-nav">
      <li class="nav-item">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink class="nav-link" to="/about">About</RouterLink>
      </li>
      <li v-if="auth.user && auth.isAdmin" class="nav-item">
        <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'MenuHamburger',
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
}
</script>
