<template>
  <div class="cart-page">
    <h1 class="cart-title">Your Cart</h1>
    <ul class="cart-list">
      <li v-for="item in cartItems" :key="item.id" class="cart-item">
        <div class="item-details">
          <p class="item-title">{{ item.title }}</p>
          <p class="item-price">{{ item.price }} USD</p>
          <div class="item-quantity">
            <!-- Кнопки для изменения количества -->
            <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1" class="quantity-button">-</button>
            <span class="quantity-display">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item.id)" class="quantity-button">+</button>
          </div>
        </div>
        <button class="remove-button" @click="removeFromCart(item.id)">Remove</button>
      </li>
    </ul>
    <div class="cart-summary">
      <p class="total-price">Total: {{ totalPrice }} USD</p>
      <button class="payment-button" @click="goToPaymentPage">Go to Payment</button>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart';

export default {
  name: 'CartPage',
  computed: {
    cartItems() {
      return this.cartStore.items;
    },
    totalPrice() {
      return this.cartStore.totalPrice.toFixed(2);
    },
  },
  methods: {
    removeFromCart(id) {
      this.cartStore.removeFromCart(id);
    },
    goToPaymentPage() {
      this.$router.push('/payment');
    },
    increaseQuantity(id) {
      this.cartStore.updateQuantity(id, 'increase');
    },
    decreaseQuantity(id) {
      this.cartStore.updateQuantity(id, 'decrease');
    }
  },
  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },
};
</script>

<style scoped>
.cart-page {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cart-title {
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: box-shadow 0.2s;
}

.cart-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.item-price {
  font-size: 16px;
  color: #666;
}

.remove-button {
  padding: 5px 10px;
  background-color: #ff5c5c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #ff1f1f;
}

.cart-summary {
  margin-top: 20px;
  text-align: center;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.payment-button {
  padding: 10px 20px;
  background-color: #2d8b30;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.payment-button:hover {
  background-color: #2d8b30;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-button {
  padding: 5px 10px;
  font-size: 18px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-button:hover {
  background-color: #e2e2e2;
}

.quantity-display {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>