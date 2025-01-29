import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import ResetPassword from "@/components/ResetPassword.vue";
import Dashboard from "@/components/Dashboard.vue";
import Settings from "@/components/Settings.vue";
import Help from "@/components/Help.vue";
import HelloWorld from "@/components/HelloWorld.vue";

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
