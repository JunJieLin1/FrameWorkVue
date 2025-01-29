<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-6">Log in</h2>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email Address</label>
          <input type="email" v-model="email" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input type="password" v-model="password" required minlength="6"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>

        <div class="text-right text-blue-500 text-sm mb-4">
          <router-link to="/reset-password" class="hover:underline">Forgot Password?</router-link>
        </div>

        <button type="submit"
          class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
          Log In
        </button>

        <p class="text-center text-gray-600 mt-4">
          Don’t have an account?
          <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
        </p>
      </form>

      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const login = async () => {
      try {
        const response = await axios.post("http://localhost:5000/login", {
          email: email.value,
          password: password.value
        });

        // ✅ Token opslaan in localStorage en gebruiker ophalen
        localStorage.setItem("token", response.data.token);

        // ✅ Decode de JWT en haal gebruikersgegevens op
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));
        const userResponse = await axios.get(`http://localhost:5000/user/${payload.email}`);

        // ✅ Sla de gebruikersinformatie op in localStorage
        localStorage.setItem("user", JSON.stringify(userResponse.data));

        // ✅ Router stuurt naar dashboard en herlaadt pagina
        router.push("/dashboard");
        setTimeout(() => {
          window.location.reload(); // Zorgt ervoor dat Navbar direct update
        }, 100);
      } catch (error) {
        errorMessage.value = "Ongeldige login gegevens!";
      }
    };

    return { email, password, errorMessage, login };
  }
};
</script>
