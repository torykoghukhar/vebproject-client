<template>
    <div class="users">
      <h1 class="users-title">User Management</h1>
      <div class="filter-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search users..." 
          class="search-input" 
          @input="filterUsers"
        />
      </div>
  
      <div class="user-grid">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="user-card"
        >
          <div class="user-details">
            <h3 class="user-name">{{ user.username }}</h3>
            <p class="user-email">{{ user.email }}</p>
          </div>
          <div class="user-actions">
            <button @click="banUser(user.id)" class="ban-button">Ban</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import backendApi from '@/backendApi/backendApi';
  
  export default {
    name: 'UsersPage',
    data() {
      return {
        users: [],
        filteredUsers: [],
        searchQuery: '',
      };
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        backendApi
          .get('/users')
          .then(response => {
            this.users = response.data;
            this.filteredUsers = this.users;
            console.log(this.users);
            console.log(this.filteredUsers);
          })
          .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users.');
          });
      },
  
      filterUsers() {
        this.filteredUsers = this.users.filter(user => {
          return user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                 user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      },
  
      banUser(userId) {
        console.log(userId);
        backendApi
          .post(`/ban/${userId}`)
          .then(() => {
            this.fetchUsers();
            alert(`User with ID ${userId} has been banned!`);
          })
          .catch(error => {
            console.error('Error banning user:', error);
            alert('Failed to ban the user.');
          });
      },
    },
  };
  </script>
  
  <style scoped>
  .users {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .users-title {
    text-align: center;
    font-size: 32px;
    color: #120046;
    margin-bottom: 20px;
  }
  
  .filter-bar {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 300px;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #3c008b;
    border-radius: 5px;
  }
  
  /* User grid */
  .user-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .user-card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    padding: 15px;
    text-align: left;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  
  .user-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    border-color: #3c008b;
  }
  
  .user-details {
    margin-bottom: 10px;
  }
  
  .user-name {
    font-size: 18px;
    font-weight: bold;
    color: #3c008b;
  }
  
  .user-email {
    color: #333;
  }
  
  .user-role {
    font-style: italic;
    color: #666;
  }
  
  .user-actions {
    display: flex;
    justify-content: center;
  }
  
  .ban-button {
    background-color: #ff7875;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .ban-button:hover {
    background-color: #ff7875;
  }
  </style>