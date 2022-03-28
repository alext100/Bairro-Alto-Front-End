import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Register from "@/views/Register.vue";
import Login from "@/views/Login.vue";
import MainPage from "@/pages/Main.vue";
import News from "@/pages/News.vue";
import Methodic from "@/pages/Methodic.vue";
import Atmosphere from "@/pages/Atmosphere.vue";
import Events from "@/pages/Events.vue";
import Materials from "@/pages/Materials.vue";
import SpecialCourses from "@/pages/SpecialCourses.vue";
import SpecialCourse from "@/pages/SpecialCourse.vue";
import CreateLesson from "@/views/TeacherBoard/CreateLesson.vue";
import MaterialsPost from "@/pages/MaterialsPost.vue";
import CoursesNewSchool from "@/pages/CoursesNewSchool.vue";
import CoursesNewOnline from "@/pages/CoursesNewOnline.vue";
import CoursesContSchool from "@/pages/CoursesContSchool.vue";
import Courses from "@/pages/Courses.vue";
import CoursesContOnline from "@/pages/CoursesContOnline.vue";
import Payment from "@/pages/Payment.vue";
import PaymentReturn from "@/pages/PaymentReturn.vue";
import WelcomePage from "@/pages/Welcome.vue";
import CheckConfirmationEmail from "@/pages/CheckConfirmationEmail.vue";
import { adminProtectedRoute, studentProtectedRoute, teacherProtectedRoute } from "./protectedRoute";

const AdminBoard = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/AdminBoard.vue");
const CMS = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/CMS.vue");
const AdminAllGroups = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/AllGroups.vue");
const AdminAllUsers = () => import(/* webpackChunkName: "admin-board-chunk" */ "@/views/AdminBoard/AllUsers.vue");

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
const StudentHomework = () =>
  import(/* webpackChunkName: "student-board-chunk" */ "@/views/StudentBoard/StudentHomework.vue");

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
    path: "/events",
    name: "Events",
    component: Events,
  },
  {
    path: "/materials",
    name: "Materials",
    component: Materials,
  },
  {
    path: "/materials/:id",
    name: "MaterialsPost",
    component: MaterialsPost,
  },
  {
    path: "/special-courses",
    name: "SpecialCourses",
    component: SpecialCourses,
  },
  {
    path: "/special-course/:id",
    name: "SpecialCourse",
    component: SpecialCourse,
  },
  {
    path: "/courses/new-school",
    name: "CoursesNewSchool",
    component: CoursesNewSchool,
  },
  {
    path: "/courses/new-online",
    name: "CoursesNewOnline",
    component: CoursesNewOnline,
  },
  {
    path: "/courses/cont-school",
    name: "CoursesContSchool",
    component: CoursesContSchool,
  },
  {
    path: "/courses/cont-online",
    name: "CoursesContOnline",
    component: CoursesContOnline,
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
  },
  {
    path: "/payment",
    name: "Payment",
    component: Payment,
  },
  {
    path: "/payment/return-url",
    name: "PaymentReturn",
    component: PaymentReturn,
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
    path: "/confirm/:confirmationCode",
    name: "WelcomePage",
    component: WelcomePage,
  },
  {
    path: "/check-email/:email",
    name: "CheckConfirmationEmail",
    component: CheckConfirmationEmail,
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
    path: "/student/homework",
    name: "StudentHomework",
    component: StudentHomework,
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
  {
    path: "/admin/all-users",
    name: "AdminAllUsers",
    component: AdminAllUsers,
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
