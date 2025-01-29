<template>
    <div class="bg-gray-100 p-4 rounded-lg">
      <h2 class="text-lg font-bold text-blue-600">Cryptocurrency Prices</h2>
      <div class="p-3 bg-gray-200 rounded-md mt-2">
        <p v-if="prices">Bitcoin: ${{ prices.bitcoin }}</p>
        <p v-if="prices">Ethereum: ${{ prices.ethereum }}</p>
        <p v-if="prices">Litecoin: ${{ prices.litecoin }}</p>
        <p v-else>Loading...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        prices: null
      };
    },
    async mounted() {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd");
        this.prices = {
          bitcoin: res.data.bitcoin.usd,
          ethereum: res.data.ethereum.usd,
          litecoin: res.data.litecoin.usd
        };
      } catch (error) {
        console.error("❌ Fout bij ophalen crypto data:", error);
      }
    }
  };
  </script>
  