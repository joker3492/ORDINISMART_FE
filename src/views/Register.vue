<template>
  <div class="main-container">
    <AuthForm :isLogin="false" />
  </div>
</template>

<script>
import AuthForm from '@/components/AuthForm.vue'

export default {
  name: 'Register',
  components: {
    AuthForm,
  },
}
</script>
