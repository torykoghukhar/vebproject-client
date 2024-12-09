<template>
  <div class="account-page">
    <h1 class="account-title">Your Account</h1>

    <!-- Profile Info Section -->
    <div v-if="!isEditing" class="profile-info">
      <div class="profile-photo">
        <img :src="profilePictureUrl" alt="Profile Photo" class="photo" />
        <button class="edit-photo-button" @click="toggleEditPhoto">Change Photo</button>
      </div>
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <p><strong>Address:</strong> {{ address }}</p>
      <p><strong>Phone Number:</strong> {{ phone }}</p>
      <button class="edit-button" @click="toggleEdit">Edit Profile</button>
      <div class="actions">
        <button class="delete-button" @click="deleteProfile">Delete Profile</button>
        <button class="logout-button" @click="logout">Logout</button>
      </div>
    </div>

    <!-- Edit Photo Section -->
    <div v-if="isEditingPhoto" class="edit-photo">
      <input type="file" @change="handleFileUpload" accept="image/*" />
      <button class="cancel-photo-button" @click="toggleEditPhoto">Cancel</button>
    </div>

    <!-- Edit Form Section -->
    <form v-else-if="isEditing" class="edit-form" @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" v-model="address" id="address" required />
      </div>
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" v-model="phone" id="phone" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="save-button">Save Changes</button>
        <button type="button" class="cancel-button" @click="toggleEdit">Cancel</button>
      </div>
    </form>

    <!-- Order History Section -->
    <div class="order-history" v-if="!isAdmin">
      <h2>Order History</h2>
      <p v-if="ordersMassage !== ''">{{ ordersMassage }}</p>
      <ul>
        <li v-for="order in orders" :key="order.id" class="order-item">
          <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
          <p><strong>Amount:</strong> {{ order.amount }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import backendApi from '@/backendApi/backendApi';
import dayjs from 'dayjs';
import { jwtDecode } from "jwt-decode";

export default {
  name: 'AccountPage',
  data() {
    return {
      isEditing: false,
      isEditingPhoto: false,
      name: '',
      email: '',
      address: '',
      phone: '',
      profilePictureUrl: '',
      orders: [],
      ordersMassage: '',
      isAdmin: false,
    };
  },
  mounted() {
    this.historyOrders();
    this.profileData();
    this.checkIsAdmin();
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
      this.profileData();
    },
    async handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await backendApi.post(`/users/upload-photo/${this.name}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.profilePictureUrl = response.data; // обновляем URL
        alert("Photo uploaded successfully!");
        this.profileData();
      } catch (error) {
        console.error("Error uploading photo", error);
        alert("Failed to upload photo");
        }
    }
    },
    toggleEditPhoto() {
      this.isEditingPhoto = !this.isEditingPhoto;
    },
    checkIsAdmin(){
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    if (role && role.includes('ROLE_ADMIN')){
      this.isAdmin = true;
    }
    },
    formatDate(dateTime) {
      return dayjs(dateTime).format('DD MMMM YYYY, HH:mm');
    },
    async historyOrders() {
      try {
        const response = await backendApi.get('/allorders');
        if (response.data && response.data.length){
        this.orders = response.data;
        this.ordersMassage = '';
      }
        
      } catch (error) {
        if (error.status === 404){
        this.ordersMassage = 'You do not have orders yet!';
        }
        else{
        alert('Error fetching orders');}
      }
    },
    async profileData() {
      try {
        const response = await backendApi.get('/profiledata');
        this.name = response.data.name;
        this.email = response.data.email;
        this.address = response.data.address;
        this.phone = response.data.phone;
        this.profilePictureUrl = `http://localhost:8080${response.data.profilePictureUrl}`;
        console.log(this.profilePictureUrl);
      } catch (error) {
        alert('Error fetching data');
      }
    },
    async deleteProfile() {
      if (confirm('Are you sure you want to delete your profile?')) {
        try {
          const response = await backendApi.delete('/deleteprofile');
          if (response.status === 200) {
            alert('Profile deleted successfully!');
            // Redirect to home or login page
            this.$router.push('/login');
          } else {
            alert('Error deleting profile');
          }
        } catch (error) {
          alert('Error deleting profile');
          console.error(error);
        }
      }
    },
    async logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.account-page {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.account-title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.profile-info {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-photo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.profile-photo .photo {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.edit-photo-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #2d8b30;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-photo-button:hover {
  background-color: #2d8b30;
}

.edit-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #2d8b30;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.edit-button:hover {
  background-color: #2d8b30;
}

.edit-form {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.save-button {
  padding: 10px 20px;
  background-color: #2d8b30;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.save-button:hover {
  background-color: #2d8b30;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-button:hover {
  background-color: #e53935;
}

.order-history {
  margin-top: 40px;
}

.order-history h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.order-item {
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-item p {
  margin: 5px 0;
  font-size: 16px;
  color: #555;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px; /* Добавляет пространство между кнопками */
  margin-top: 20px;
}

.delete-button, .logout-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 150px; /* Задаем одинаковую ширину для обеих кнопок */
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #e53935;
}

.logout-button {
  background-color: #ff9800;
  color: white;
}

.logout-button:hover {
  background-color: #fb8c00;
}

.edit-photo {
  margin-top: 20px;
  text-align: center;
}

.edit-photo input[type="file"] {
  margin-bottom: 10px;
}

.cancel-photo-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.cancel-photo-button:hover {
  background-color: #e53935;
}

</style>

