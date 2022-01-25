import { State, UserLoggedIn, UserRegisterData } from "@/types/interfaces";

const mutations = {
  loginUser(state: State, payload: UserLoggedIn) {
    state.isUserAuthenticated = true;
    state.currentUser = payload;
  },

  loadUser(state: State, payload: UserLoggedIn) {
    state.currentUser = payload;
  },

  userIsAdmin(state: State) {
    state.isAdmin = true;
  },

  userIsTeacher(state: State) {
    state.isProfessor = true;
  },

  userIsStudent(state: State) {
    state.isStudent = true;
  },

  isRegistered(state: State, payload: UserRegisterData) {
    state.isRegistered = true;
    state.user.email = payload.email;
  },

  notRegistered(state: State) {
    state.isWrongEmailOnRegister = true;
  },
};

export default mutations;
