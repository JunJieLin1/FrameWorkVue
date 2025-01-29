<template>
    <div class="widget-card">
      <h2 class="widget-title">Willekeurig Feit</h2>
      <p>{{ fact }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return { fact: "Loading..." };
    },
    async mounted() {
      const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      this.fact = response.data.text;
    }
  };
  </script>
  