<template>
  <div class="payment-page">
    <h1 class="payment-title">Payment Page</h1>
    <p class="payment-info">Please proceed with your payment to complete the order.</p>
    <div class="payment-form">
      <div class="form-group">
        <label for="payment-method" class="form-label">Select Payment Method</label>
        <select v-model="paymentMethod" id="payment-method" class="form-input">
          <option value="card">Credit/Debit Card</option>
          <option value="cash">Pay on Delivery</option>
        </select>
      </div>

      <!-- Payment by Card -->
      <div v-if="paymentMethod === 'card'" class="form-group">
        <label for="card-number" class="form-label">Card Number</label>
        <input
          type="text"
          id="card-number"
          v-model="cardNumber"
          class="form-input"
          placeholder="1234 5678 9012 3456"
          maxlength="16"
        />
      </div>
      <div v-if="paymentMethod === 'card'" class="form-group">
        <label for="card-cvv" class="form-label">CVV</label>
        <input
          type="text"
          id="card-cvv"
          v-model="cardCVV"
          class="form-input"
          placeholder="123"
          maxlength="3"
        />
      </div>

      <div class="payment-summary">
        <p class="total-price">Total Amount: {{ totalAmount }} USD</p>
        <!-- Button text changes based on payment method -->
        <button class="pay-button" @click="processPayment">
          {{ paymentMethod === 'cash' ? 'Confirm Order' : 'Pay Now' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart';
import backendApi from '@/backendApi/backendApi';

export default {
  name: 'PaymentPage',
  data() {
    return {
      cardNumber: '', // Номер карты
      cardCVV: '',    // CVV код
      paymentMethod: 'card', // Способ оплаты (по умолчанию карта)
    };
  },
  computed: {
    totalAmount() {
      const cartStore = useCartStore();
      return cartStore.totalPrice.toFixed(2);
    },
  },
  methods: {
    async processPayment() {
      if (this.paymentMethod === 'card') {
        // Если выбран способ оплаты картой
        if (this.cardNumber.length === 16 && this.cardCVV.length === 3) {
          try {
            const cartStore = useCartStore();
            const bookList = cartStore.items.map(item => ({
            id: item.id, // ID книги
            quantity: item.quantity, // Количество книги
          }));
            console.log(bookList);
            const data = {
              books: bookList, cardNumber: this.cardNumber, cardCVV: this.cardCVV, paymentMethod: this.paymentMethod, amount: cartStore.totalPrice.toFixed(2)
            };
            await backendApi.post('/buybooks', data);
            alert('Your order is confirmed!');
            cartStore.clearCart();
            this.$router.push('/')
          } catch (error) {
            alert('Erros to confirm order');
          }
        } else {
          alert('Please check your card details!');
        }
      } else if (this.paymentMethod === 'cash') {
        try {
            const cartStore = useCartStore();
            const bookList = cartStore.items.map(item => ({
            id: item.id, // ID книги
            quantity: item.quantity, // Количество книги
          }));
            console.log(bookList);
            const data = {
              books: bookList, paymentMethod: this.paymentMethod, amount: cartStore.totalPrice.toFixed(2)
            };
            await backendApi.post('/buybooks', data);
            alert('Your order will be confirmed on delivery.');
            cartStore.clearCart();
            this.$router.push('/')
          } catch (error) {
            alert('Erros to confirm order');
          }
        // Логика для подтверждения заказа при доставке
      }
    },
  },
};
</script>

<style scoped>
.payment-page {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.payment-title {
  font-size: 28px;
  color: #240349;
  text-align: center;
  margin-bottom: 20px;
}

.payment-info {
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
}

.payment-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
}

.form-input {
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.payment-summary {
  text-align: center;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.pay-button {
  padding: 10px 20px;
  background-color: #2d8b30;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.pay-button:hover {
  background-color: #45a049;
}
</style>