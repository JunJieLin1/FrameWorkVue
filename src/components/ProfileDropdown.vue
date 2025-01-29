<template>
  <div class="relative">
    <!-- Profielknop -->
    <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
      <img :src="user.profile_image || '/src/assets/default-avatar.png'" alt="User"
        class="h-10 w-10 rounded-full border shadow-md">
      <span class="text-gray-700 font-medium">{{ user.first_name || 'Profile' }}</span>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const dropdownOpen = ref(false);
    const user = ref({});

    // 🔹 Haal de gebruikersgegevens op
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
          const response = await axios.get(`http://localhost:5000/user/${payload.email}`);
          
          // ✅ Fix: Zorg ervoor dat de profielfoto volledig wordt weergegeven
          if (response.data.profile_image) {
            response.data.profile_image = `http://localhost:5000${response.data.profile_image}`;
          }

          user.value = response.data;
        } catch (error) {
          console.error("❌ Gebruikersgegevens ophalen mislukt:", error);
          logout();
        }
      }
    };

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const logout = () => {
      localStorage.removeItem("token");
      user.value = {};
      router.push("/login");
      location.reload(); // Zorgt ervoor dat de UI direct wordt bijgewerkt
    };

    onMounted(fetchUserData);

    return { dropdownOpen, toggleDropdown, logout, user };
  }
};
</script>
