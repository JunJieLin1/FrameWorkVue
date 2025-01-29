<template>
  <div class="relative">
    <!-- Profielknop -->
    <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
      <img :src="user.profile_image || '/src/assets/default-avatar.png'" alt="User" class="h-10 w-10 rounded-full border shadow-md">
      <span class="text-gray-700 font-medium">Profile</span>
    </button>

    <!-- Dropdown menu -->
    <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border">
      <ul class="py-2">
        <li v-if="isAuthenticated">
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const dropdownOpen = ref(false);
    const user = ref({});
    const isAuthenticated = ref(false);

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const response = await axios.get(`http://localhost:5000/user/${payload.email}`);
        user.value = response.data;
        isAuthenticated.value = true;
      } catch (error) {
        console.error("❌ Kan gebruikersgegevens niet ophalen:", error);
      }
    };

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const logout = () => {
      localStorage.removeItem("token");
      dropdownOpen.value = false;
      router.push("/login");
      location.reload();
    };

    onMounted(checkAuth);

    return { dropdownOpen, toggleDropdown, logout, user, isAuthenticated };
  }
};
</script>
