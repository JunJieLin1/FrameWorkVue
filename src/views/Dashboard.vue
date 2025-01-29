<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-center mb-6">Dashboard</h1>

    <!-- Draggable Widgets -->
    <draggable v-model="widgets" item-key="id" class="dashboard-grid">
      <template #item="{ element }">
        <div v-if="element.visible" class="widget">
          <button @click="toggleWidget(element.id)" class="close-btn">
            <i class="fas fa-minus"></i>
          </button>
          <component :is="element.component"></component>
        </div>
      </template>
    </draggable>

    <!-- Verborgen widgets opnieuw tonen -->
    <div v-if="hiddenWidgets.length > 0" class="mt-4">
      <h3 class="text-lg font-bold mb-2">Verborgen Widgets</h3>
      <button
        v-for="widget in hiddenWidgets"
        :key="widget.id"
        @click="restoreWidget(widget.id)"
        class="restore-btn"
      >
        Herstel {{ widget.name }}
      </button>
    </div>

  </div>
</template>

<script>
import { ref } from "vue";
import draggable from "vuedraggable";
import WeatherWidget from "@/components/WeatherWidget.vue";
import CryptoWidget from "@/components/CryptoWidget.vue";

export default {
  components: { draggable },
  setup() {
    const widgets = ref([
      { id: 1, name: "Weer", component: WeatherWidget, visible: true },
      { id: 2, name: "Crypto", component: CryptoWidget, visible: true }
    ]);

    const hiddenWidgets = ref([]);

    const toggleWidget = (id) => {
      const widgetIndex = widgets.value.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        widgets.value[widgetIndex].visible = false;
        hiddenWidgets.value.push(widgets.value[widgetIndex]); // Voeg toe aan verborgen lijst
      }
    };

    const restoreWidget = (id) => {
      const widgetIndex = hiddenWidgets.value.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        hiddenWidgets.value[widgetIndex].visible = true;
        widgets.value.push(hiddenWidgets.value[widgetIndex]); // Voeg terug toe aan widgets
        hiddenWidgets.value.splice(widgetIndex, 1); // Verwijder uit verborgen lijst
      }
    };

    return { widgets, hiddenWidgets, toggleWidget, restoreWidget };
  }
};
</script>

<style scoped>
/* Responsieve grid voor widgets */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
}

.widget {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: red;
  font-size: 1.2em;
  cursor: pointer;
}

/* Stijl voor herstelknoppen */
.restore-btn {
  margin: 5px;
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.restore-btn:hover {
  background-color: #45a049;
}
</style>
