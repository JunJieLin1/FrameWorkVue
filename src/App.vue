<template>
  <div :class="{ 'dark': darkMode }">
    <!-- ✅ Navbar blijft op elke pagina -->
    <Navbar />

    <!-- ✅ Router View waar pagina's worden ingeladen -->
    <router-view />

    <!-- ✅ Zwevende issue-knop -->
    <button 
      class="fixed bottom-6 right-6 bg-red-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
      @click="showIssueModal = true"
    >
      🚨 Meld Issue
    </button>

    <!-- ✅ Modal voor issue melden -->
    <div v-if="showIssueModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-center">Meld een Probleem</h2>
        <form @submit.prevent="submitIssue" class="space-y-3">
          <input v-model="title" type="text" placeholder="Titel van het probleem"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-red-300 outline-none" required />

          <textarea v-model="description" placeholder="Beschrijf het probleem"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-red-300 outline-none" required></textarea>

          <input v-model="created_by" type="email" placeholder="Jouw e-mail"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-red-300 outline-none" required />

          <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            Verstuur Issue
          </button>
          <button type="button" class="w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
            @click="showIssueModal = false">
            Annuleren
          </button>
        </form>
      </div>
    </div>

    <!-- ✅ Toggle Thema -->
    <button @click="toggleTheme"
      class="fixed bottom-6 left-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
      {{ darkMode ? "🌙 Donker" : "☀️ Licht" }}
    </button>

    <!-- ✅ Footer (optioneel) -->
    <footer class="text-center py-4 mt-6 bg-gray-100 dark:bg-gray-900 dark:text-white">
      &copy; {{ new Date().getFullYear() }} - Mijn Dashboard | <a href="/contact" class="text-blue-500">Contact</a>
    </footer>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

export default {
  components: {
    Navbar
  },
  data() {
    return {
      showIssueModal: false,
      title: "",
      description: "",
      created_by: "",
      darkMode: localStorage.getItem("theme") === "dark"
    };
  },
  methods: {
    async submitIssue() {
      try {
        await axios.post("http://localhost:5000/issues", {
          title: this.title,
          description: this.description,
          created_by: this.created_by
        });
        alert("Issue succesvol gemeld!");
        this.showIssueModal = false;
        this.title = "";
        this.description = "";
        this.created_by = "";
      } catch (error) {
        console.error("❌ Kan issue niet melden:", error);
      }
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem("theme", this.darkMode ? "dark" : "light");
      document.documentElement.classList.toggle("dark", this.darkMode);
    }
  },
  mounted() {
    if (this.darkMode) {
      document.documentElement.classList.add("dark");
    }
  }
};
</script>

