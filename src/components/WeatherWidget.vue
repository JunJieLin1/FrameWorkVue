<template>
    <div class="widget-card">
      <h2 class="widget-title">🌤 Weer</h2>
      <div v-if="weather">
        <p><strong>{{ weather.name }}</strong></p>
        <p>{{ weather.temp }}°C</p>
        <p>{{ weather.description }}</p>
      </div>
      <p v-else>Loading...</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return { weather: null };
    },
    async mounted() {
      const apiKey = "33a5fa5ead30d15eb3a2070a744ffa85";
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Amsterdam&units=metric&appid=${apiKey}`);
      this.weather = {
        name: response.data.name,
        temp: response.data.main.temp,
        description: response.data.weather[0].description
      };
    }
  };
  </script>
  