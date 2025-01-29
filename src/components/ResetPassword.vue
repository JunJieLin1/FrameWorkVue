<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h2 class="text-3xl font-bold mb-6 text-yellow-600">Reset Wachtwoord</h2>

    <form @submit.prevent="resetPassword" class="bg-white p-6 rounded shadow-md w-80">
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input type="email" v-model="email" required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600">
      </div>

      <button type="submit"
        class="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition">
        Stuur reset-link
      </button>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-yellow-500 hover:underline">Terug naar login</router-link>
      </div>
    </form>

    <p v-if="message" class="text-green-500 mt-4">{{ message }}</p>
    <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";  // Gebruik nu je eigen backend

export default {
  data() {
    return {
      email: "",
      message: "",
      errorMessage: ""
    };
  },
  methods: {
    async resetPassword() {
      try {
        const response = await axios.post("http://localhost:5000/reset-password", {
          email: this.email
        });
        this.message = response.data.message;
      } catch (error) {
        this.errorMessage = "Fout bij verzenden!";
      }
    }
  }
};
</script>
