import state from "@/store/state";
import axios from "axios";
import { NavigationGuard } from "vue-router";

const checkToken = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await axios.get(`${process.env.VUE_APP_URL}/user/check-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      sessionStorage.clear();
    }
  }
};

const adminProtectedRoute: NavigationGuard = async (to, from, next) => {
  await checkToken();
  if (state.currentUser.adminAccess === true) {
    next();
  } else {
    next("/login");
  }
};

const teacherProtectedRoute: NavigationGuard = async (to, from, next) => {
  await checkToken();
  if (state.currentUser.teacherAccess === true) {
    next();
  } else {
    next("/login");
  }
};

const studentProtectedRoute: NavigationGuard = async (to, from, next) => {
  await checkToken();
  if (state.currentUser.studentAccess === true) {
    next();
  } else {
    next("/login");
  }
};

export { adminProtectedRoute, teacherProtectedRoute, studentProtectedRoute };
