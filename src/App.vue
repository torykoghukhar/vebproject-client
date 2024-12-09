<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="site-title">
        <h1>Bookworm</h1>
      </div>
      <nav>
        <ul>
          <li><router-link :to="'/'" class="nav-button">Home</router-link></li>
          <li><router-link :to="'/catalog'" class="nav-button">Catalog</router-link></li>
          <li v-if="!isAdmin"><router-link :to="'/my-books'" class="nav-button">My Books</router-link></li>
          <li><router-link :to="'/book-club'" class="nav-button">Book Club</router-link></li>
          <li class="cart-container" v-if="!isAdmin">
            <router-link :to="'/cart'" class="nav-button">
              <i class="fas fa-shopping-cart"></i> Cart
            </router-link>
            <!-- Popup Cart Preview -->
            <div v-if="cartItems.length" class="cart-popup">
            <ul>
              <li v-for="item in cartItems" :key="item.id">
                {{ item.title }} - {{ item.price }} USD - Qty {{ item.quantity }}
              </li>
            </ul>
            <p class="cart-total">Total: {{ totalPrice }} USD</p>
          </div>
          </li>
          
          <li v-if="isAdmin"><router-link :to="'/statistics'" class="nav-button">Statistics</router-link></li>
          <li v-if="isAdmin"><router-link :to="'/users'" class="nav-button">Users</router-link></li>
          <li>
            <router-link :to="'/account'" class="nav-button">
              <i class="fas fa-user"></i> Account
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Central Content -->
    <main>
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>Support: support@bookworm.com | Phone: +1 234 567 890</p>
        <div class="social-links">
          <a href="https://facebook.com" target="_blank" class="social-link">Facebook</a> |
          <a href="https://twitter.com" target="_blank" class="social-link">Twitter</a> |
          <a href="https://instagram.com" target="_blank" class="social-link">Instagram</a>
        </div>
        <p>&copy; 2024 Bookstore. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useCartStore } from "@/stores/cart";
import { jwtDecode } from "jwt-decode";
import { ref, computed, onMounted } from 'vue';

export default {
  name: "App",
  setup() {
    const isAdmin = ref(false);
    const cartStore = useCartStore();
    
    const checkIsAdmin = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        isAdmin.value = false;
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        isAdmin.value = decodedToken.role && decodedToken.role.includes('ROLE_ADMIN');
      } catch (error) {
        console.error('Invalid token:', error);
        isAdmin.value = false;
      }
    };

    // Вычисляемое свойство для общей суммы корзины
    const totalPrice = computed(() => {
      return cartStore.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    });

    onMounted(() => {
      checkIsAdmin();
    });

    return {
      cartItems: cartStore.items,
      totalPrice,
      isAdmin,
      checkIsAdmin,
    };
  },
};
</script>

<style>
/* Importing a stylish font */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

/* Importing Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

@keyframes gradientAnimation {
  0% {
    background: linear-gradient(135deg, #c4d9fc, #bdfdf3);
  }
  50% {
    background: linear-gradient(135deg, #bdfdf3, #c4d9fc);
  }
  100% {
    background: linear-gradient(135deg, #c4d9fc, #bdfdf3);
  }
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: gradientAnimation 10s ease infinite; /* Анимация градиента */
  position: relative;
}

.header {
  background-color: rgba(60, 0, 139, 0.8); /* Темно-синий с прозрачностью 80% */
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 50px;
  backdrop-filter: blur(10px); /* Эффект размытия фона */
}

.site-title h1 {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  margin: 0;
  font-weight: 700;
}

.header nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex; /* Use flexbox for horizontal layout */
}

.header nav ul li {
  margin: 0 5px; /* Space between buttons */
}

.nav-button {
  display: block;
  background-color: #3c008b; /* Dark blue */
  color: white;
  padding: 12px 30px;
  text-decoration: none;
  font-size: 16px;
  border-radius: 30px; /* Oval shape */
  transition: background-color 0.3s ease; /* Smooth transition */
}

.nav-button i {
  margin-right: 8px; /* Отступ между иконкой и текстом */
  font-size: 16px; /* Размер иконки */
}

.nav-button:hover {
  background-color: #3d84ff; /* Slightly lighter dark blue on hover */
}

main {
  flex: 1;
  padding: 100px 20px 50px; /* Add top padding to account for fixed header */
  overflow-y: auto; /* Allow scroll for main content */
  min-height: calc(100vh - 120px); /* Ensure the main section takes remaining space */
}

.footer {
  background-color: rgba(60, 0, 139, 0.8); /* Темно-синий с прозрачностью 80% */
  color: white;
  padding: 10px 20px;
  text-align: center;
  margin-top: auto;
  font-size: 12px;
  position: relative;
  backdrop-filter: blur(10px); /* Эффект размытия фона */
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.social-links {
  margin: 10px 0;
}

.social-link {
  color: white;
  text-decoration: none;
  margin: 0 8px;
}

.social-link:hover {
  text-decoration: underline;
}

.cart-container {
  position: relative;
}

.cart-popup {
  position: absolute;
  top: 50px;
  right: 0;
  background: rgb(255, 255, 255);
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  width: 320px;
  z-index: 100;
  color: #2b045d;
}

.cart-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex; /* Используем flexbox */
  flex-direction: column; /* Элементы идут столбцом */
  gap: 10px; /* Расстояние между строками */
}

.cart-popup li {
  display: flex; /* Элементы внутри строки тоже flex */
  justify-content: space-between; /* Пространство между элементами */
  align-items: left; /* Выравнивание по центру вертикали */
  padding: 5px 0;
  border-bottom: 1px solid #9699de;
  color: #333;
}

.cart-popup li:last-child {
  border-bottom: 3px solid #9699de;
}

.cart-popup li::before {
  content: "•"; /* Декоративный маркер */
  font-size: 18px;
  color: #3c008b; /* Темно-синий */
  margin-right: 2px;
}

.cart-popup .cart-total {
  font-weight: bold;
  margin-top: 10px;
  text-align: right;
  color: #2b045d;
}

.cart-container:hover .cart-popup {
  display: block;
}

.cart-popup {
  display: none;
}
</style>
