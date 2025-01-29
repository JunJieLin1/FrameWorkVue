<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">📊 Mijn Dashboard</h1>

    <!-- Draggable Grid voor Widgets -->
    <draggable v-model="widgets" item-key="id" class="dashboard-grid" @end="saveWidgets">
      <template #item="{ element }">
        <div v-if="element.visible" class="widget">
          <div class="widget-header">
            <h3>{{ element.name }}</h3>
            <div>
              <button @click="hideWidget(element.id)" class="widget-btn close-btn">
                <i class="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <component :is="element.component"></component>
        </div>
      </template>
    </draggable>

    <!-- Verborgen widgets opnieuw tonen met plus (+) knoppen -->
    <div v-if="hiddenWidgets.length > 0" class="hidden-widgets">
      <h3>📦 Verborgen Widgets</h3>
      <div class="hidden-buttons">
        <button
          v-for="widget in hiddenWidgets"
          :key="widget.id"
          @click="restoreWidget(widget.id)"
          class="widget-btn restore-btn"
        >
          <i class="fas fa-plus"></i> {{ widget.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, markRaw, watch, onMounted } from "vue";
import draggable from "vuedraggable";
import WeatherWidget from "@/components/WeatherWidget.vue";
import CryptoWidget from "@/components/CryptoWidget.vue";
import NewsWidget from "@/components/NewsWidget.vue";
import FactWidget from "@/components/FactWidget.vue";
import IssueTracker from "@/components/IssueTracker.vue";

export default {
  components: { draggable },
  setup() {
    const defaultWidgets = [
      { id: 1, name: "Weer 🌦️", component: markRaw(WeatherWidget), visible: true },
      { id: 2, name: "Crypto 💰", component: markRaw(CryptoWidget), visible: true },
      { id: 3, name: "Nieuws 📰", component: markRaw(NewsWidget), visible: true },
      { id: 4, name: "Random Feit 🤔", component: markRaw(FactWidget), visible: true },  
      { id: 5, name: "Issue Tracker 🚨", component: markRaw(IssueTracker), visible: true }
    ];

    const widgets = ref([]);
    const hiddenWidgets = ref([]);

    const loadWidgets = () => {
      const savedWidgets = JSON.parse(localStorage.getItem("dashboardWidgets"));
      const savedHidden = JSON.parse(localStorage.getItem("hiddenWidgets"));

      if (savedWidgets) {
        widgets.value = savedWidgets.map((w) => ({
          ...w,
          component: markRaw(getComponent(w.id))
        }));
      } else {
        widgets.value = [...defaultWidgets];
      }

      if (savedHidden) {
        hiddenWidgets.value = savedHidden.map((w) => ({
          ...w,
          component: markRaw(getComponent(w.id))
        }));
      }
    };

    const getComponent = (id) => {
      switch (id) {
        case 1: return WeatherWidget;
        case 2: return CryptoWidget;
        case 3: return NewsWidget;
        case 4: return FactWidget;
        case 5: return IssueTracker;
        default: return null;
      }
    };

    const hideWidget = (id) => {
      const widgetIndex = widgets.value.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        const removedWidget = widgets.value.splice(widgetIndex, 1)[0];
        removedWidget.visible = false;
        hiddenWidgets.value.push(removedWidget);
        saveWidgets();
      }
    };

    const restoreWidget = (id) => {
      const widgetIndex = hiddenWidgets.value.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        const restoredWidget = hiddenWidgets.value.splice(widgetIndex, 1)[0];
        restoredWidget.visible = true;
        widgets.value.push(restoredWidget);
        saveWidgets();
      }
    };

    const saveWidgets = () => {
      localStorage.setItem("dashboardWidgets", JSON.stringify(widgets.value));
      localStorage.setItem("hiddenWidgets", JSON.stringify(hiddenWidgets.value));
    };

    watch(widgets, saveWidgets, { deep: true });
    watch(hiddenWidgets, saveWidgets, { deep: true });

    onMounted(loadWidgets);

    return { widgets, hiddenWidgets, hideWidget, restoreWidget };
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
}

/* Widget Header met Acties */
.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Min (Verberg) en Plus (Herstel) Knoppen */
.widget-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
}

.close-btn {
  color: red;
  font-size: 16px;
  background-color: rgba(255, 0, 0, 0.1);
  padding: 5px 10px;
  border-radius: 5px;
  transition: 0.3s;
}

.close-btn:hover {
  background-color: rgba(255, 0, 0, 0.3);
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

/* Plus (Herstel) Knop */
.restore-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  font-size: 14px;
}

.restore-btn:hover {
  background-color: #45a049;
}
</style>
