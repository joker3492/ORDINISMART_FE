<template>
  <div class="product-list">
    <h2>Prodotti Disponibili</h2>
    <div class="product-container">
      <div class="product-card" v-for="product in products" :key="product.id">
        <img :src="product.url" alt="Immagine prodotto" class="product-image" />
        <h3 class="product-title">{{ product.nome }}</h3>
        <p class="product-price">€ {{ product.prezzo.toFixed(2) }}</p>
        <div class="quantity-container">
          <label for="quantity">Quantità:</label>
          <input
            type="number"
            class="quantity-input"
            min="1"
            :value="quantities[product.id]"
            @input="updateQuantity(product.id, $event.target.value)"
          />
        </div>
        <button class="btn-add-cart" @click="addToCart(product)">Aggiungi al Carrello</button>
      </div>
    </div>
  </div>
</template>

<script>
import useProductLogic from '@/logic/useProductLogic'

export default {
  name: 'ProductList',
  setup() {
    const { products, fetchProducts, addToCart, quantities, updateQuantity } = useProductLogic()

    // Recupera i prodotti all'avvio
    fetchProducts()

    return { products, addToCart, quantities, updateQuantity }
  },
}
</script>

<style src="@/assets/styles/ProductList.css"></style>
