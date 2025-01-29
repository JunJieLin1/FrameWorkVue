<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold text-green-600">Dashboard</h1>
    <p class="text-gray-700 mt-4">Welkom op je dashboard!</p>
    
    <button @click="logout"
      class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
      Uitloggen
    </button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem("token"); // Verwijder de auth-token
      router.push("/login"); // Stuur gebruiker terug naar loginpagina
    };

    return { logout };
  }
};
</script>
