<template>
    <div class="widget">
      <h3 class="title">Weather in Your Location</h3>
      <div class="content">
        <p v-if="loading">Loading...</p>
        <p v-else-if="error">{{ error }}</p>
        <p v-else>
          <strong>{{ location }}</strong><br />
          {{ temperature }}°C<br />
          {{ weatherDescription }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        location: "Unknown",
        temperature: null,
        weatherDescription: "",
        loading: true,
        error: null,
      };
    },
    async mounted() {
      try {
        const apiKey = "33a5fa5ead30d15eb3a2070a744ffa85";
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Amsterdam&units=metric&appid=${apiKey}`
        );
  
        this.location = data.name;
        this.temperature = data.main.temp;
        this.weatherDescription = data.weather[0].description;
      } catch (err) {
        console.error("❌ Weerdata ophalen mislukt:", err);
        this.error = "Kon geen weergegevens ophalen.";
      } finally {
        this.loading = false;
      }
    },
  };
  </script>
  
  <style scoped>
  .widget {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .title {
    font-weight: bold;
    color: #1e40af;
  }
  .content {
    background: #e5e7eb;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
  