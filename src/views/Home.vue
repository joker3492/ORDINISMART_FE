<template>
  <div class="main-container"></div>
  <h1>Home Page</h1>
  <p>Benvenuto in OrdiniSmart!</p>
  <ProductList />
</template>
<script>
import '@/assets/styles/Home.css'

import ProductList from '@/components/ProductList.vue'

export default {
  name: 'Home',
  components: { ProductList },
}
</script>
