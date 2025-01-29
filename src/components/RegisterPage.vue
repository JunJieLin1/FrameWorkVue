<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h2 class="text-3xl font-bold mb-6 text-green-600">Registreer</h2>

    <form @submit.prevent="register" class="bg-white p-6 rounded shadow-md w-80">
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input type="email" v-model="email" required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
      </div>

      <div class="mb-4">
        <label class="block text-gray-700">Wachtwoord</label>
        <input type="password" v-model="password" required minlength="6"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
      </div>

      <button type="submit"
        class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Account aanmaken</button>
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
    async register() {
      try {
        await axios.post("http://localhost:5000/register", {
          email: this.email,
          password: this.password
        });

        this.$router.push("/login");
      } catch (error) {
        this.errorMessage = "Gebruiker bestaat al!";
      }
    }
  }
};
</script>
