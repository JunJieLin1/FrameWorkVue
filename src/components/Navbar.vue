<template>
  <nav class="bg-white shadow-md px-6 py-3 flex items-center justify-between">
    <!-- Logo & Naam met link naar homepage -->
    <router-link to="/" class="flex items-center space-x-2">
      <img src="@/assets/panda-logo.png" alt="Logo" class="h-10 w-10 rounded-full shadow-md">
      <span class="text-green-600 font-bold text-lg">Jun Jie</span>
    </router-link>

    <div class="flex space-x-6 text-gray-700 font-medium">
      <router-link to="/helloworld" class="hover:text-blue-500">HelloWorld</router-link>
    </div>
