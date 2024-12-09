import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../components/HomePage.vue';
import CatalogPage from '../components/CatalogPage.vue';
import MyBooksPage from '../components/MyBooksPage.vue';
import CartPage from '../components/CartPage.vue';
import AccountPage from '../components/AccountPage.vue';
import BookClub from '../components/BookClub.vue';
import PaymentPage from '../components/PaymentPage.vue';
import BookDetailsPage from '../components/BookDetailsPage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegistrationPage from '../components/RegistrationPage.vue';
import Statistic from '@/components/Statistic.vue';
import Users from '@/components/Users.vue';
import backendApi from '@/backendApi/backendApi';
import { jwtDecode } from "jwt-decode";

const requireAuth = async (to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token) {
      next('/login');
      return;
  }
  try {
      const response = await backendApi.post('/valid-token', { token });
      if (response.data.isValid) {
          next();
      } else {
          localStorage.removeItem('token');
          next('/login');
      }
  } catch (error) {
      localStorage.removeItem('token');
      next('/login');
  }
};

const requireAutorization = async (to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token) {
      next('/login');
      return;
  }
  try {
      const response = await backendApi.post('/valid-token', { token });
      if (response.data.isValid) {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.role;
          if(role && role.includes('ROLE_ADMIN')){
            next();
          }
          next('/login');
      } else {
          localStorage.removeItem('token');
          next('/login');
      }
  } catch (error) {
      localStorage.removeItem('token');
      next('/login');
  }
};

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/catalog', name: 'Catalog', component: CatalogPage },
  { path: '/my-books', name: 'MyBooks', component: MyBooksPage, beforeEnter: requireAuth },
  { path: '/cart', name: 'Cart', component: CartPage, beforeEnter: requireAuth },
  { path: '/account', name: 'Account', component: AccountPage, beforeEnter: requireAuth },
  { path: '/book-club', name: 'BookClub', component: BookClub },
  { path: '/payment', name: 'Payment', component: PaymentPage, beforeEnter: requireAuth },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/registration', name: 'Registration', component: RegistrationPage },
  {path: '/statistics', name: 'Statistic', component: Statistic, beforeEnter: requireAutorization},
  {path: '/users', name: 'Users', component: Users, beforeEnter: requireAutorization},
  { path: '/book-details/:bookId', name: 'BookDetails', component: BookDetailsPage, beforeEnter: requireAuth, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

