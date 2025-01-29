<template>
    <div class="widget-card">
      <h2 class="widget-title">💰 Crypto Prijzen</h2>
      <p>Bitcoin: ${{ crypto.bitcoin }}</p>
      <p>Ethereum: ${{ crypto.ethereum }}</p>
      <p>Litecoin: ${{ crypto.litecoin }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return { crypto: {} };
    },
    async mounted() {
      const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd");
      this.crypto = {
        bitcoin: response.data.bitcoin.usd,
        ethereum: response.data.ethereum.usd,
        litecoin: response.data.litecoin.usd
      };
    }
  };
  </script>
  