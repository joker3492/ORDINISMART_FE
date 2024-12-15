<template>
  <div class="auth-form">
    <h1 class="text-center mb-4">{{ title }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          placeholder="Inserisci il tuo username"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Inserisci la tua password"
          required
        />
      </div>
      <div v-if="!isLogin" class="mb-3">
        <label for="confirm-password" class="form-label">Conferma Password</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Conferma la tua password"
          required
        />
      </div>
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <button type="submit" :class="submitButtonClass" class="w-100 mt-3">
        {{ buttonText }}
      </button>
    </form>
  </div>
</template>

<script>
import useAuthLogic from '@/logic/useAuthLogic'

export default {
  name: 'AuthForm',
  props: {
    isLogin: {
      type: Boolean,
      default: true, // Determina se è un form di login o registrazione
    },
  },
  setup(props) {
    return useAuthLogic(props.isLogin)
  },
}
</script>

<style src="@/assets/styles/AuthForm.css"></style>
