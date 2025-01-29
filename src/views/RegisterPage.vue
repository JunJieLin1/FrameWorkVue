<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-6">Register</h2>

      <form @submit.prevent="register" enctype="multipart/form-data">
        <!-- First Name -->
        <div class="mb-4">
          <label class="block text-gray-700">First Name</label>
          <input type="text" v-model="first_name" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label class="block text-gray-700">Last Name</label>
          <input type="text" v-model="last_name" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input type="email" v-model="email" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input type="password" v-model="password" required minlength="6"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Phone -->
        <div class="mb-4">
          <label class="block text-gray-700">Phone Number</label>
          <input type="text" v-model="phone" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Address -->
        <div class="mb-4">
          <label class="block text-gray-700">Address</label>
          <input type="text" v-model="address" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Date of Birth -->
        <div class="mb-4">
          <label class="block text-gray-700">Date of Birth</label>
          <input type="date" v-model="dob" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Profile Image -->
        <div class="mb-4">
          <label class="block text-gray-700">Profile Image</label>
          <input type="file" @change="handleFileUpload" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600">
        </div>

        <!-- Register Button -->
        <button type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Register</button>
      </form>

      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      dob: "",
      profile_image: null,
      errorMessage: ""
    };
  },
  methods: {
    handleFileUpload(event) {
      this.profile_image = event.target.files[0];
    },
    async register() {
  try {
    let formData = new FormData();
    formData.append("first_name", this.first_name);
    formData.append("last_name", this.last_name);
    formData.append("email", this.email);
    formData.append("password", this.password);
    formData.append("phone", this.phone);
    formData.append("address", this.address);
    formData.append("dob", this.dob);
    formData.append("profile_image", this.profile_image);

    const response = await axios.post("http://localhost:5000/register", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    console.log("Registratie succesvol", response.data);
    this.$router.push("/login");

  } catch (error) {
    console.error("❌ Fout bij registratie:", error.response.data);
    
    // ✅ Toon een foutmelding als de e-mail al bestaat
    if (error.response && error.response.status === 400) {
      this.errorMessage = error.response.data.message;
    } else {
      this.errorMessage = "Er ging iets mis!";
    }
  }
}

  }
};
</script>
