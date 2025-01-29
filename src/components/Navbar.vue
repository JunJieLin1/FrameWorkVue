<template>
  <nav class="bg-white shadow-md px-6 py-3 flex items-center justify-between">
    <!-- Logo & Naam met link naar homepage -->
    <router-link to="/" class="flex items-center space-x-2">
      <img src="@/assets/panda-logo.png" alt="Logo" class="h-10 w-10 rounded-full shadow-md">
      <span class="text-green-600 font-bold text-lg">Jun Jie</span>
    </router-link>

    <!-- Navigatie Links -->
    <div class="flex space-x-6 text-gray-700 font-medium">
      <router-link to="/" class="hover:text-blue-500">Home</router-link>
      <router-link to="/dashboard" class="hover:text-blue-500">Dashboard</router-link>
      <router-link to="/helloworld" class="hover:text-blue-500">HelloWorld</router-link>
      <router-link to="/help" class="hover:text-blue-500">Help</router-link>
    </div>

    <!-- Login / Register -->
    <div class="flex space-x-4">
      <router-link v-if="!isAuthenticated" to="/login" class="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
        <i class="fas fa-user"></i>
        <span>Login</span>
      </router-link>
      <router-link v-if="!isAuthenticated" to="/register" class="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
        <i class="fas fa-user-plus"></i>
        <span>Register</span>
      </router-link>
    </div>
  </nav>
</template>
<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
  }
};
</script>
