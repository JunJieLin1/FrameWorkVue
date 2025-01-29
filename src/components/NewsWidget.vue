<template>
    <div class="widget-card">
      <h2 class="widget-title">Laatste Nieuws</h2>
      <ul>
        <li v-for="article in news" :key="article.url">
          <a :href="article.url" target="_blank">{{ article.title }}</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return { news: [] };
    },
    async mounted() {
      const apiKey = "87c37d3089304398893b5f996052a841";
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=nl&apiKey=${apiKey}`);
      this.news = response.data.articles.slice(0, 5);
    }
  };
  </script>
  
  