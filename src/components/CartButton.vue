<template>
  <div class="cart-container">
    <!-- Bottone del carrello -->
    <button class="btn-cart" @click="toggleCart" title="Carrello">
      <i class="fas fa-shopping-cart"></i>
      <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
    </button>

    <!-- Dropdown del carrello -->
    <div v-if="showCart" class="cart-dropdown">
      <h3>Il tuo carrello</h3>
      <div v-if="cartItems.length > 0">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.url" alt="Immagine prodotto" class="cart-item-image" />
          <div class="cart-item-details">
            <h4>{{ item.nome }}</h4>
            <p>€ {{ item.prezzo.toFixed(2) }}</p>
            <div class="cart-quantity">
              <button @click="decreaseQuantity(item.id)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)">+</button>
            </div>
            <button class="btn-remove" @click="removeFromCart(item.id)">Rimuovi</button>
          </div>
        </div>
        <button class="btn-create-order" @click="createOrder">Crea Ordine</button>
      </div>
      <div v-else>
        <p>Il carrello è vuoto.</p>
      </div>
    </div>
  </div>
</template>

<script>
import useCartLogic from '@/logic/useCartLogic'

export default {
  name: 'CartButton',
  setup() {
    const {
      cartCount,
      cartItems,
      toggleCart,
      showCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      createOrder,
    } = useCartLogic()

    return {
      cartCount,
      cartItems,
      toggleCart,
      showCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      createOrder,
    }
  },
}
</script>

<style src="@/assets/styles/ButtonStyles.css"></style>
