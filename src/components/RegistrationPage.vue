<template>
  <div class="registration-container">
    <div class="registration-form">
      <h2>Registration</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Username</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            :class="{ 'is-invalid': errors.name }"
          />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            :class="{ 'is-invalid': errors.email }"
          />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.passwordHash"
            :class="{ 'is-invalid': errors.password }"
          />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            :class="{ 'is-invalid': errors.firstName }"
          />
          <span v-if="errors.firstName" class="error">{{ errors.firstName }}</span>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            :class="{ 'is-invalid': errors.lastName }"
          />
          <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            v-model="form.phone"
            :class="{ 'is-invalid': errors.phone }"
          />
          <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input
            type="text"
            id="address"
            v-model="form.address"
            :class="{ 'is-invalid': errors.address }"
          />
          <span v-if="errors.address" class="error">{{ errors.address }}</span>
        </div>

        <button type="submit" :disabled="isSubmitting">Register</button>
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
          name: "",
          email: "",
          passwordHash: "",
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
        },
        errors: {},
        isSubmitting: false,
      };
    },
    methods: {
      validateForm() {
  this.errors = {};
  let valid = true;

  // Username validation (minimum 8 characters)
  if (!this.form.name || this.form.name.length < 8) {
    this.errors.name = "Username must be at least 8 characters.";
    valid = false;
  }

  // Email validation (valid email format)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!this.form.email || !emailRegex.test(this.form.email)) {
    this.errors.email = "A valid email is required.";
    valid = false;
  }

  // Password validation (minimum 6 characters, at least one number)
  const passwordRegex = /^(?=.*\d)[a-zA-Z\d]{6,}$/;
  if (!this.form.passwordHash || !passwordRegex.test(this.form.passwordHash)) {
    this.errors.password = "Password must be at least 6 characters and contain at least one number.";
    valid = false;
  }

  // First name validation (minimum 3 characters)
  if (!this.form.firstName || this.form.firstName.length < 3) {
    this.errors.firstName = "First name must be at least 3 characters.";
    valid = false;
  }

  // Last name validation (minimum 3 characters)
  if (!this.form.lastName || this.form.lastName.length < 3) {
    this.errors.lastName = "Last name must be at least 3 characters.";
    valid = false;
  }

  // Phone number validation (Ukrainian format: +380...)
  const phoneRegex = /^\+380\d{9}$/;
  if (!this.form.phone || !phoneRegex.test(this.form.phone)) {
    this.errors.phone = "Phone number must follow the format: +380XXXXXXXXX.";
    valid = false;
  }

  if (!this.form.address) {
          this.errors.address = "Address is required.";
          valid = false;
        }

  return valid;
},

      async submitForm() {
        if (this.validateForm()) {
          this.isSubmitting = true;
  
          try {
            const response = await backendApi.post("/registration", this.form);
  
            alert("Registration successful");
            console.log("Form submitted:", response.data);
            this.$router.push('/login');

            // Optionally reset form after successful submission
            this.form = {
              name: "",
              email: "",
              passwordHash: "",
              firstName: "",
              lastName: "",
              phone: "",
              address: "",
            };
          } catch (error) {
            if (error.response && error.response.data) {
              // Set errors from backend response
              if (error.response.data.email){ 
                        this.errors.email = error.response.data.email;
                    }
                    if(error.response.data.username){
                        this.errors.name = error.response.data.name;
                    };
            } else {
              console.error("An error occurred:", error);
            }
          } finally {
            this.isSubmitting = false;
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
body {
  background: linear-gradient(to right, #007BFF, #00C6FF);
  font-family: 'Arial', sans-serif;
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
</style>
