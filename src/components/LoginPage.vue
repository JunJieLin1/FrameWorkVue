<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 class="text-3xl font-bold mb-6 text-blue-600">Login</h2>
  
      <form @submit.prevent="login" class="bg-white p-6 rounded shadow-md w-80">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input type="email" v-model="email" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>
  
        <div class="mb-4">
          <label class="block text-gray-700">Wachtwoord</label>
          <input type="password" v-model="password" required minlength="6"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>
  
        <button type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Login</button>
  
        <div class="text-center mt-4">
          <router-link to="/register" class="text-blue-500 hover:underline">Geen account? Registreer hier</router-link>
        </div>
      </form>
  
      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        errorMessage: ""
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post("http://localhost:5000/login", {
            email: this.email,
            password: this.password
          });
  
          localStorage.setItem("token", response.data.token);
          this.$router.push("/dashboard");
        } catch (error) {
          this.errorMessage = "Ongeldige login gegevens!";
        }
      }
    }
  };
  </script>
  