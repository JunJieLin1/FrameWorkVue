<template>
  <div class="flex flex-col items-center w-full max-w-md mx-auto mt-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Chatbot</h2>

    <!-- Chatbox -->
    <div ref="chatBox" class="chat-box w-full h-80 overflow-y-auto bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
      <div v-for="(msg, index) in messages" :key="index" 
           class="my-2 p-2 rounded-lg text-sm w-fit max-w-xs break-words"
           :class="msg.sender === 'user' ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 self-start'">
        {{ msg.text }}
      </div>
    </div>

    <!-- Input en Verstuurknop -->
    <div class="w-full flex items-center mt-4 space-x-2">
      <input 
        v-model="userInput"
        placeholder="Stel een vraag..."
        class="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
        @keyup.enter="sendMessage"
      />
      <button 
        @click="sendMessage"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
        Verstuur
      </button>
    </div>

    <!-- Laad-indicator -->
    <p v-if="loading" class="mt-2 text-gray-600 dark:text-gray-300">De chatbot denkt na...</p>

    <!-- Error melding -->
    <p v-if="error" class="mt-2 text-red-500">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, watch } from "vue";

export default {
  setup() {
    const userInput = ref("");
    const messages = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const chatBox = ref(null);
    const MAX_MESSAGES = 20; // Limiet van berichten in de geschiedenis

    // ✅ Laad geschiedenis uit localStorage
    const loadChatHistory = () => {
      const storedMessages = localStorage.getItem("chatHistory");
      if (storedMessages) {
        messages.value = JSON.parse(storedMessages);
      } else {
        // Voeg een welkomsbericht toe als er nog geen berichten zijn
        messages.value.push({ text: "Hallo! Waarmee kan ik je helpen?", sender: "bot" });
      }
    };

    // ✅ Sla geschiedenis op in localStorage
    const saveChatHistory = () => {
      if (messages.value.length > MAX_MESSAGES) {
        messages.value = messages.value.slice(-MAX_MESSAGES); // Houd de laatste berichten bij
      }
      localStorage.setItem("chatHistory", JSON.stringify(messages.value));
    };

    // ✅ Verzenden van bericht
    const sendMessage = async () => {
      if (!userInput.value.trim()) return;

      messages.value.push({ text: userInput.value, sender: "user" });
      loading.value = true;
      userInput.value = "";

      try {
        const response = await axios.post("http://localhost:5000/api/chatbot", {
          message: messages.value[messages.value.length - 1].text,
        });

        messages.value.push({ text: response.data.response, sender: "bot" });
      } catch (error) {
        messages.value.push({ text: "Er is een fout opgetreden. Probeer later opnieuw.", sender: "bot" });
        console.error("❌ Fout bij ophalen van AI-reactie:", error.response ? error.response.data : error.message);
      } finally {
        loading.value = false;
        saveChatHistory(); // ✅ Geschiedenis opslaan na elk bericht
      }
    };

    // ✅ Laad de chatgeschiedenis bij het openen van de pagina
    onMounted(() => {
      loadChatHistory();
    });

    // ✅ Bewaak berichten en sla ze automatisch op
    watch(messages, saveChatHistory, { deep: true });

    return { userInput, messages, sendMessage, loading, error, chatBox };
  }
};
</script>

<style scoped>
/* Scrollbar styling */
.chat-box::-webkit-scrollbar {
  width: 8px;
}

.chat-box::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.chat-box::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
