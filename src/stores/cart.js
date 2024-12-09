import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),
  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id);
      if (!existingItem) {
        this.items.push({ ...product, quantity: 1 });
      } else {
        existingItem.quantity++;
      }
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    clearCart() {
      this.items = [];
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    updateQuantity(productId, action) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        if (action === 'increase') {
          item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
          item.quantity--;
        }
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },
  },
});