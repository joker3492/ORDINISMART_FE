<template>
  <div class="main-container">
    <AuthForm :isLogin="true" />
  </div>
</template>

<script>
import AuthForm from '@/components/AuthForm.vue'

export default {
  name: 'Login',
  components: {
    AuthForm,
  },
}
</script>
