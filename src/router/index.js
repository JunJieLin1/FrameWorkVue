import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import Dashboard from "@/views/Dashboard.vue";
import Settings from "@/views/Settings.vue";
import Help from "@/views/Help.vue";
import HelloWorld from "@/views/HelloWorld.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/reset-password", component: ResetPassword },
  { path: "/dashboard", component: Dashboard },
  { path: "/settings", component: Settings },
  { path: "/help", component: Help },
  { path: "/helloworld", component: HelloWorld }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
