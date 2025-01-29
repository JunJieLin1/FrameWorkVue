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

    <!-- Login / Register of Profiel -->
    <div class="flex space-x-4">
      <router-link v-if="!isAuthenticated" to="/login" class="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
        <i class="fas fa-user"></i>
        <span>Login</span>
      </router-link>
      <router-link v-if="!isAuthenticated" to="/register" class="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
        <i class="fas fa-user-plus"></i>
        <span>Register</span>
      </router-link>

      <!-- Profiel dropdown alleen tonen als ingelogd -->
      <ProfileDropdown v-if="isAuthenticated" />
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import ProfileDropdown from "@/components/ProfileDropdown.vue";

export default {
  components: { ProfileDropdown },
  setup() {
    const isAuthenticated = ref(false);

    // ✅ Check direct of gebruiker is ingelogd bij het laden
    const checkAuth = () => {
      isAuthenticated.value = !!localStorage.getItem("token");
    };

    onMounted(checkAuth);
    watchEffect(checkAuth); // ✅ Zorgt ervoor dat navbar meteen update bij login/logout

    return { isAuthenticated };
  }
};
</script>
