import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import AdminBoard from "@/views/AdminBoard.vue";
import { adminProtectedRoute, studentProtectedRoute, teacherProtectedRoute } from "./protectedRoute";

const TeacherBoard = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/TeacherBoard.vue");
const GroupPage = () => import(/* webpackChunkName: "teacher-board-chunk" */ "../views/Group.vue");
const OnlineLesson = () => import(/* webpackChunkName: "teacher-board-chunk" */ "../views/OnlineLesson.vue");
const StudentBoard = () => import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard.vue");

const CreateGroup = () => import("@/views/CreateGroup.vue");

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
  {
    path: "/create-group",
    name: "CreateGroup",
    component: CreateGroup,
    beforeEnter: teacherProtectedRoute,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
  routes,
});

export default router;
