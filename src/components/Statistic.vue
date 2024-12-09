<template>
    <div class="statistics-page">
      <h1>Order Statistics</h1>
      <div class="date-picker">
        <label>
          Start Date:
          <input type="date" v-model="startDate" />
        </label>
        <label>
          End Date:
          <input type="date" v-model="endDate" />
        </label>
        <button @click="fetchOrders">Get Orders</button>
      </div>
      <div v-if="orders.length" class="orders-list">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount (USD)</th>
              <th>Customer</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ formatDate(order.date )}}</td>
              <td>{{ order.amount }}</td>
              <td>{{ order.username }}</td>
              <td>{{ order.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>No orders found for the selected date range.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from "vue";
  import backendApi from '@/backendApi/backendApi';
  import dayjs from 'dayjs';
  
  export default defineComponent({
    name: "Statistic",
    setup() {
      const startDate = ref('');
      const endDate = ref('');
      const orders = ref([]);
  
      const fetchOrders = async () => {
        if (!startDate.value || !endDate.value) {
          alert("Please select both start and end dates.");
          return;
        }
  
        try {
          const response = await backendApi.post("/orderstatistic", {
              startDate: startDate.value,
              endDate: endDate.value,
          });
          orders.value = response.data;
        } catch (error) {
          console.error("Error fetching orders:", error);
          alert("Failed to fetch orders. Please try again later.");
        }
      };

      const formatDate = (dateTime) => {
      return dayjs(dateTime).format('DD MMMM YYYY, HH:mm');
    };
  
      return {
        startDate,
        endDate,
        orders,
        fetchOrders,
        formatDate,
      };
    },
  });
  </script>
  
  <style scoped>
  .statistics-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background: #fdfdfd;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #120046;
    font-size: 28px;
    font-weight: bold;
  }
  
  .date-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fafafa;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .date-picker label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #555;
  }
  
  input[type="date"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: border 0.3s ease;
  }
  
  input[type="date"]:focus {
    border-color: #3d84ff;
    outline: none;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    background-color: #3d84ff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #1e88e5;
  }
  
  .orders-list {
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  thead th {
    text-align: left;
    background-color: #42a5f5;
    color: white;
    padding: 15px;
    font-weight: bold;
  }
  
  tbody td {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tbody tr:hover {
    background-color: #e3f2fd;
  }
  
  tbody td:last-child {
    color: #1e88e5;
    text-decoration: underline;
    cursor: pointer;
  }
  
  p {
    text-align: center;
    color: #777;
    font-size: 16px;
  }
  </style>
  
  