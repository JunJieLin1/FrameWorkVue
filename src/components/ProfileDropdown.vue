<template>
    <div class="relative">
      <!-- Profielknop -->
      <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
        <img :src="userImage" alt="User" class="h-10 w-10 rounded-full border shadow-md">
        <span class="text-gray-700 font-medium">Profile</span>
      </button>
  
      <!-- Dropdown menu -->
      <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border">
        <ul class="py-2">
          <li>
            <router-link to="/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Settings
            </router-link>
          </li>
          <li>
            <button @click="logout" class="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const router = useRouter();
      const dropdownOpen = ref(false);
      const userImage = ref("/src/assets/user.png"); // Zorg dat dit bestand bestaat
  
      const toggleDropdown = () => {
        dropdownOpen.value = !dropdownOpen.value;
      };
  
      const logout = () => {
        localStorage.removeItem("token");
        dropdownOpen.value = false;
        router.push("/login");
        location.reload(); // Zorgt ervoor dat de UI direct wordt bijgewerkt
      };
  
      return { dropdownOpen, toggleDropdown, logout, userImage };
    }
  };
  </script>
  