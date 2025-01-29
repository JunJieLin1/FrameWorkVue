<template>
  <div class="min-h-screen flex flex-col items-center p-6" :class="{ 'bg-gray-900 text-white': darkMode, 'bg-gray-100 text-gray-800': !darkMode }">
    <h2 class="text-2xl font-bold mb-6">Account Instellingen</h2>

    <!-- Profielfoto update -->
    <div class="mb-6 text-center">
      <img :src="user.profile_image || '/src/assets/default-avatar.png'" alt="Profielfoto" class="h-24 w-24 rounded-full shadow-md">
      <input type="file" @change="handleFileUpload" class="mt-3 block">
      <button @click="updateProfilePicture" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Profielfoto</button>
    </div>

    <!-- Gebruikersgegevens bewerken -->
    <form @submit.prevent="updateUser">
      <div class="mb-4">
        <label class="block text-sm font-medium">E-mail</label>
        <input type="email" v-model="user.email" class="w-80 px-4 py-2 border rounded-md focus:ring-blue-600">
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Nieuw Wachtwoord</label>
        <input type="password" v-model="newPassword" class="w-80 px-4 py-2 border rounded-md focus:ring-blue-600">
      </div>

      <button type="submit" class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Update Gegevens</button>
    </form>

    <!-- Thema wisselaar -->
    <div class="mt-6">
      <label class="block text-sm font-medium">Thema</label>
      <select v-model="darkMode" @change="toggleTheme" class="w-40 px-4 py-2 border rounded-md">
        <option :value="false">Light Mode</option>
        <option :value="true">Dark Mode</option>
      </select>
    </div>

    <!-- Account verwijderen -->
    <div class="mt-6">
      <button @click="confirmDelete = true" class="text-red-500 hover:underline">Account verwijderen</button>
      <div v-if="confirmDelete" class="mt-4 bg-red-100 p-4 rounded-md">
        <p>Weet je zeker dat je jouw account wilt verwijderen?</p>
        <input type="password" v-model="deletePassword" placeholder="Voer je wachtwoord in" class="w-80 px-4 py-2 border rounded-md mt-2">
        <button @click="deleteAccount" class="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Ja, verwijder</button>
        <button @click="confirmDelete = false" class="ml-2 px-4 py-2 bg-gray-300 rounded-md">Annuleren</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const user = ref({});
    const newPassword = ref("");
    const profileImage = ref(null);
    const confirmDelete = ref(false);
    const deletePassword = ref("");
    const darkMode = ref(localStorage.getItem("theme") === "dark");

    // ✅ Controleer of gebruiker ingelogd is
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const response = await axios.get(`http://localhost:5000/user/${payload.email}`);
        user.value = response.data;

        // ✅ Controleer of een thema is ingesteld en pas het toe
        if (response.data.theme) {
          darkMode.value = response.data.theme === "dark";
          document.documentElement.classList.remove("dark", "light");
          document.documentElement.classList.add(darkMode.value ? "dark" : "light");
          localStorage.setItem("theme", darkMode.value ? "dark" : "light");
        }
      } catch (error) {
        console.error("❌ Kan gebruikersgegevens niet ophalen:", error);
        router.push("/login");
      }
    };

    // ✅ Profielfoto verwerken
    const handleFileUpload = (event) => {
      profileImage.value = event.target.files[0];
    };

    const updateProfilePicture = async () => {
      if (!profileImage.value) return alert("Selecteer een afbeelding!");

      const formData = new FormData();
      formData.append("profile_image", profileImage.value);
      formData.append("email", user.value.email);

      try {
        const response = await axios.post(`http://localhost:5000/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        user.value.profile_image = response.data.filePath;
        alert("Profielfoto geüpdatet!");
        window.location.reload();
      } catch (error) {
        console.error("❌ Kan profielfoto niet updaten:", error);
      }
    };

    // ✅ Gebruikersgegevens bijwerken
    const updateUser = async () => {
      try {
        const response = await axios.put(`http://localhost:5000/user/update`, {
          email: user.value.email,
          password: newPassword.value || undefined,
          theme: darkMode.value ? "dark" : "light"
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        alert("Gegevens succesvol bijgewerkt!");
        window.location.reload();
      } catch (error) {
        console.error("❌ Kan gegevens niet bijwerken:", error);
      }
    };

    // ✅ Thema wisselen en direct opslaan
    const toggleTheme = async () => {
      darkMode.value = !darkMode.value;
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(darkMode.value ? "dark" : "light");
      localStorage.setItem("theme", darkMode.value ? "dark" : "light");

      try {
        await axios.put("http://localhost:5000/user/update", {
          email: user.value.email,
          theme: darkMode.value ? "dark" : "light"
        });

        alert("Thema succesvol bijgewerkt!");
      } catch (error) {
        console.error("❌ Kan thema niet opslaan:", error);
      }
    };

    // ✅ Account verwijderen
    const deleteAccount = async () => {
      if (!deletePassword.value) {
        alert("Voer je wachtwoord in om te verwijderen!");
        return;
      }

      try {
        const response = await axios.delete(`http://localhost:5000/user/delete`, {
          data: { email: user.value.email, password: deletePassword.value }
        });

        alert(response.data.message);
        localStorage.removeItem("token");
        router.push("/");
        window.location.reload();
      } catch (error) {
        console.error("❌ Kan account niet verwijderen:", error);
        alert(error.response.data.message);
      }
    };

    onMounted(checkAuth);

    return { 
      user, 
      newPassword, 
      profileImage, 
      confirmDelete, 
      deletePassword, 
      darkMode, 
      handleFileUpload, 
      updateProfilePicture, 
      updateUser, 
      toggleTheme, 
      deleteAccount 
    };
  }
};
</script>
