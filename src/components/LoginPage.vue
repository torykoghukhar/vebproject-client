<template>
  <div class="registration-container">
    <div class="registration-form">
      <h2>Login</h2>
      <form @submit.prevent="submitForm">
  <div class="form-group">
    <label for="name">Username</label>
    <input
      type="text"
      id="name"
      v-model="form.name"
      :class="{ 'is-invalid': errors.name }" required
    />
    <span v-if="errors.name" class="error">{{ errors.name }}</span>
  </div>

  <div class="form-group">
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      v-model="form.passwordHash"
      :class="{ 'is-invalid': errors.password }" required
    />
    <span v-if="errors.password" class="error">{{ errors.password }}</span>
  </div>

  <button type="submit" >Login</button>

  <div class="register-link">
          <p>
            Don't have an account? 
            <router-link to="/registration">Register here</router-link>
          </p>
        </div>
</form>
    </div>
  </div>
</template>

<script>
import backendApi from '@/backendApi/backendApi';

export default {
  data() {
    return {
      form: {
        username: "",
        passwordHash: "",
      },
      errors: {},
    };
  },
  methods: {
    async submitForm() {
    try {
      const response = await backendApi.post("/login", this.form);
      localStorage.setItem('token', response.data);
      alert("Login successful");
      this.form = {
        name: "",
        passwordHash: "",
      };
      this.$router.push('/')
    } catch (error) {
      this.errors.name = "Invalid data. Please try again.";
    } finally {
      this.isSubmitting = false;
    }
},
},
};
</script>

<style scoped>
body {
  background: linear-gradient(to right, #007BFF, #00C6FF);
  font-family: "Arial", sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.registration-form {
  background: #eefbff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.registration-form h2 {
  margin-bottom: 20px;
  color: #0c2744;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input.is-invalid {
  border-color: red;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

button {
  background: #007BFF;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:disabled {
  background: grey;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.register-link {
  margin-top: 20px;
}

.register-link a {
  color: #007BFF;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>