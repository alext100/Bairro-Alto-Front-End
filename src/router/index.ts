import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import CreateLesson from "@/views/CreateLesson.vue";
import { adminProtectedRoute, studentProtectedRoute, teacherProtectedRoute } from "./protectedRoute";

const AdminBoard = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard.vue");
const AdminAllGroups = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminAllGroups.vue");

const TeacherBoard = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/TeacherBoard.vue");
const GroupPage = () => import(/* webpackChunkName: "teacher-board-chunk" */ "../views/Group.vue");
const OnlineLesson = () => import(/* webpackChunkName: "teacher-board-chunk" */ "../views/OnlineLesson.vue");
const CreateGroup = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/CreateGroup.vue");
// const CreateLesson = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/CreateLesson.vue"); provoke error on deploy

const StudentBoard = () => import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard.vue");

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
    path: "/teacher/create-group",
    name: "CreateGroup",
    component: CreateGroup,
    beforeEnter: teacherProtectedRoute,
  },
  {
    path: "/teacher/create-lesson",
    name: "CreateLesson",
    component: CreateLesson,
    beforeEnter: teacherProtectedRoute,
  },
  {
    path: "/admin/all-groups",
    name: "AdminAllGroups",
    component: AdminAllGroups,
    beforeEnter: adminProtectedRoute,
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
