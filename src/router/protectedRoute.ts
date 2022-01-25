import { NavigationGuard } from "vue-router";
import state from "@/store/state";

const adminProtectedRoute: NavigationGuard = (to, from, next) => {
  if (state.currentUser.adminAccess === true) {
    next();
  } else {
    next("/login");
  }
};

const teacherProtectedRoute: NavigationGuard = (to, from, next) => {
  if (state.currentUser.teacherAccess === true) {
    next();
  } else {
    next("/login");
  }
};

const studentProtectedRoute: NavigationGuard = (to, from, next) => {
  if (state.currentUser.studentAccess === true) {
    next();
  } else {
    next("/login");
  }
};

export { adminProtectedRoute, teacherProtectedRoute, studentProtectedRoute };
