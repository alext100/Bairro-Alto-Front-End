import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import StudentBoard from "@/views/StudentBoard.vue";
import AdminBoard from "@/views/AdminBoard.vue";
import TeacherBoard from "@/views/TeacherBoard.vue";
import GroupPage from "../views/Group.vue";
import OnlineLesson from "../views/OnlineLesson.vue";
import { adminProtectedRoute, studentProtectedRoute, teacherProtectedRoute } from "./protectedRoute";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "AdminBoard",
    component: AdminBoard,
    beforeEnter: adminProtectedRoute,
  },
  {
    path: "/teacher",
    name: "TeacherBoard",
    component: TeacherBoard,
    beforeEnter: teacherProtectedRoute,
  },
  {
    path: "/student/:id",
    name: "StudentBoard",
    component: StudentBoard,
    beforeEnter: studentProtectedRoute,
  },
  {
    path: "/group/:id",
    name: "GroupPage",
    component: GroupPage,
    beforeEnter: teacherProtectedRoute,
  },
  {
    path: "/online-lesson/:id",
    name: "OnlineLesson",
    component: OnlineLesson,
    beforeEnter: teacherProtectedRoute,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
