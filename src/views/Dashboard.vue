<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">📊 Mijn Dashboard</h1>

    <!-- Draggable Grid voor Widgets -->
    <draggable v-model="widgets" item-key="id" class="dashboard-grid" @end="saveWidgets">
      <template #item="{ element }">
        <div v-if="element.visible" class="widget" :class="{ minimized: element.minimized }">
          <div class="widget-header">
            <h3>{{ element.name }}</h3>
            <div class="widget-actions">
              <button @click="toggleSize(element)" class="size-btn">
                <i :class="element.minimized ? 'fas fa-expand' : 'fas fa-compress'"></i>
              </button>
              <button @click="hideWidget(element.id)" class="close-btn">
                <i class="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <component :is="element.component"></component>
        </div>
      </template>
    </draggable>

    <!-- Verborgen widgets opnieuw tonen -->
    <div v-if="hiddenWidgets.length > 0" class="hidden-widgets">
      <h3>Verborgen Widgets</h3>
      <div class="hidden-buttons">
        <button
          v-for="widget in hiddenWidgets"
          :key="widget.id"
          @click="restoreWidget(widget.id)"
          class="restore-btn"
        >
          <i class="fas fa-plus"></i> Herstel {{ widget.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, markRaw, watch } from "vue";
import draggable from "vuedraggable";
import WeatherWidget from "@/components/WeatherWidget.vue";
import CryptoWidget from "@/components/CryptoWidget.vue";
import NewsWidget from "@/components/NewsWidget.vue";
import FactWidget from "@/components/FactWidget.vue";

export default {
  components: { draggable },
  setup() {
    const widgets = ref([
      { id: 1, name: "Weer", component: markRaw(WeatherWidget), visible: true, minimized: false },
      { id: 2, name: "Crypto", component: markRaw(CryptoWidget), visible: true, minimized: false },
      { id: 3, name: "Nieuws", component: markRaw(NewsWidget), visible: true, minimized: false },
      { id: 4, name: "Random Feit", component: markRaw(FactWidget), visible: true, minimized: false }
    ]);

    const hiddenWidgets = ref([]);

    const hideWidget = (id) => {
      const widgetIndex = widgets.value.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        const removedWidget = widgets.value.splice(widgetIndex, 1)[0];
        removedWidget.visible = false;
        hiddenWidgets.value.push(removedWidget);
      }
    };

    const restoreWidget = (id) => {
      const widgetIndex = hiddenWidgets.value.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        const restoredWidget = hiddenWidgets.value.splice(widgetIndex, 1)[0];
        restoredWidget.visible = true;
        widgets.value.push(restoredWidget);
      }
    };

    const toggleSize = (widget) => {
      widget.minimized = !widget.minimized;
    };

    // Optioneel: Sla widget posities op als je wilt dat deze behouden blijven
    const saveWidgets = () => {
      localStorage.setItem("dashboardWidgets", JSON.stringify(widgets.value));
      localStorage.setItem("hiddenWidgets", JSON.stringify(hiddenWidgets.value));
    };

    watch(widgets, saveWidgets, { deep: true });
    watch(hiddenWidgets, saveWidgets, { deep: true });

    return { widgets, hiddenWidgets, hideWidget, restoreWidget, toggleSize };
  }
};
</script>

<style scoped>
/* Algemene Dashboard Layout */
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.dashboard-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-content: center;
}

/* Widget Styling */
.widget {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

/* Verkleinen/Vergroten */
.minimized {
  height: 60px;
  overflow: hidden;
  padding: 10px;
}

/* Widget Header met Acties */
.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Knoppen */
.widget-actions {
  display: flex;
  gap: 10px;
}

.size-btn,
.close-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
}

.size-btn {
  color: blue;
}

.close-btn {
  color: red;
}

/* Verborgen Widgets */
.hidden-widgets {
  margin-top: 20px;
  text-align: center;
}

.hidden-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.restore-btn {
  display: flex;
  align-items: center;
  gap: 5px;
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
