import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import MainPage from "@/pages/Main.vue";
import News from "@/pages/News.vue";
import Methodic from "@/pages/Methodic.vue";
import Atmosphere from "@/pages/Atmosphere.vue";
import CreateLesson from "@/views/TeacherBoard/CreateLesson.vue";
import { adminProtectedRoute, studentProtectedRoute, teacherProtectedRoute } from "./protectedRoute";

const AdminBoard = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/AdminBoard.vue");
const CMS = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/CMS.vue");
const AdminAllGroups = () =>
  import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/AdminAllGroups.vue");

const TeacherBoard = () =>
  import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/TeacherBoard/TeacherBoard.vue");
const GroupPage = () => import(/* webpackChunkName: "teacher-board-chunk" */ "../views/TeacherBoard/Group.vue");
const OnlineLesson = () =>
  import(/* webpackChunkName: "teacher-board-chunk" */ "../views/TeacherBoard/OnlineLesson.vue");
const CreateGroup = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/TeacherBoard/CreateGroup.vue");
const TeacherChat = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/TeacherBoard/TeacherChat.vue");
// const CreateLesson = () => import(/* webpackChunkName: "teacher-board-chunk" */ "@/views/CreateLesson.vue"); provoke error on deploy

const StudentBoard = () =>
  import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard/StudentBoard.vue");
const StudentErrors = () =>
  import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard/StudentErrors.vue");
const StudentLessons = () =>
  import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard/StudentLessons.vue");
const StudentChat = () => import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard/StudentChat.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "MainPage",
    component: MainPage,
  },
  {
    path: "/methodic",
    name: "Methodic",
    component: Methodic,
  },
  {
    path: "/atmosphere",
    name: "Atmosphere",
    component: Atmosphere,
  },
  {
    path: "/news",
    name: "News",
    component: News,
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
    path: "/cms",
    name: "CMS",
    component: CMS,
    beforeEnter: adminProtectedRoute,
  },
  {
    path: "/teacher",
    name: "TeacherBoard",
    component: TeacherBoard,
    beforeEnter: teacherProtectedRoute,
  },
  {
    path: "/teacher/chat",
    name: "TeacherChat",
    component: TeacherChat,
    beforeEnter: teacherProtectedRoute,
  },
  {
    path: "/student/:id",
    name: "StudentBoard",
    component: StudentBoard,
    beforeEnter: studentProtectedRoute,
  },
  {
    path: "/student/errors/:id",
    name: "StudentErrors",
    component: StudentErrors,
    beforeEnter: studentProtectedRoute,
  },
  {
    path: "/student/lessons/:id",
    name: "StudentLessons",
    component: StudentLessons,
    beforeEnter: studentProtectedRoute,
  },
  {
    path: "/student/chat/:id",
    name: "StudentChat",
    component: StudentChat,
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
