import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import HelloWorld from "@/components/HelloWorld.vue";
const routes = [
  { path: "/", component: HomePage },
  { path: "/helloworld", component: HelloWorld }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
