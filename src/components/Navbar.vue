<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
    <div class="container-fluid">
      <!-- Menu Hamburger -->
      <MenuHamburger />

      <!-- Logo -->
      <a class="navbar-brand" href="#">OrdiniSmart</a>

      <!-- Bottoni -->
      <div class="d-flex align-items-center gap-2">
        <LoginButton v-if="!auth.user" />
        <RegisterButton v-if="!auth.user" />
        <CartButton v-if="auth.user && !auth.isAdmin" />
        <OrdersButton v-if="auth.user && !auth.isAdmin" />
        <AdminProductButton v-if="auth.isAdmin" />
        <LogoutButton v-if="auth.user" />
      </div>
    </div>
  </nav>
</template>

<script>
import '@/assets/styles/Navbar.css'
import { useAuthStore } from '@/stores/auth'
import MenuHamburger from '@/components/MenuHamburger.vue'
import LoginButton from '@/components/LoginButton.vue'
import RegisterButton from '@/components/RegisterButton.vue'
import CartButton from '@/components/CartButton.vue'
import OrdersButton from '@/components/OrdersButton.vue'
import AdminProductButton from '@/components/AdminProductButton.vue'
import LogoutButton from '@/components/LogoutButton.vue'

export default {
  name: 'Navbar',
  components: {
    MenuHamburger,
    LoginButton,
    RegisterButton,
    CartButton,
    OrdersButton,
    AdminProductButton,
    LogoutButton,
  },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
}
</script>
