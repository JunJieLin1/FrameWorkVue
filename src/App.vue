<template>
  <div>
    <Navbar />  <!-- Voeg de navigatie toe -->
    <router-view />  <!-- Hier worden de pagina’s geladen -->
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar
  }
};
</script>
