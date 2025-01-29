<template>
  <div class="widget">
    <h3 class="font-bold">🚨 Issue Tracker</h3>

    <form v-if="role === 'user'" @submit.prevent="submitIssue" class="space-y-2">
      <input v-model="title" type="text" placeholder="Titel" class="input" required />
      <textarea v-model="description" placeholder="Beschrijving" class="input h-16" required></textarea>
      <button type="submit" class="btn">Meld Issue</button>
    </form>

    <ul v-if="issues.length" class="mt-4 space-y-2">
      <li v-for="issue in issues" :key="issue.id" class="issue-item">
        <strong>{{ issue.title }}</strong>
        <p>{{ issue.description }}</p>
        <p>Status: <span :class="getStatusClass(issue.status)">{{ issue.status }}</span></p>

        <div v-if="role === 'admin'">
          <label>Wijs toe aan:</label>
          <select v-model="selectedExpert" class="input">
            <option v-for="expert in experts" :key="expert.id" :value="expert.id">
              {{ expert.name }}
            </option>
          </select>
          <button @click="assignIssue(issue.id)" class="btn btn-assign">Toewijzen</button>
        </div>

        <div v-if="role === 'expert' && issue.status !== 'Closed'">
          <button v-if="issue.status === 'Open'" @click="startIssue(issue.id)" class="btn btn-start">Start</button>
          <button v-if="issue.status === 'In Progress'" @click="closeIssue(issue.id)" class="btn btn-close">Sluiten</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  props: ["role", "userId"],
  setup(props) {
    const title = ref("");
    const description = ref("");
    const issues = ref([]);
    const experts = ref([]);
    const selectedExpert = ref("");

    const fetchIssues = async () => {
      try {
        const response = await axios.get("http://localhost:5000/issues", {
          params: { role: props.role, userId: props.userId }
        });
        issues.value = response.data;
      } catch (error) {
        console.error("❌ Fout bij ophalen issues:", error);
      }
    };

    const fetchExperts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        experts.value = response.data.filter(user => user.role === "expert");
      } catch (error) {
        console.error("❌ Kan experts niet ophalen:", error);
      }
    };

    const assignIssue = async (id) => {
      await axios.put(`http://localhost:5000/issues/${id}/assign`, { assigned_to: selectedExpert.value });
      fetchIssues();
    };

    onMounted(() => {
      fetchIssues();
      fetchExperts();
    });

    return { title, description, issues, experts, selectedExpert, assignIssue };
  }
};
</script>
