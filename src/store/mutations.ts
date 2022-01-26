import { State, UserLoggedIn, UserRegisterData } from "@/types/interfaces";

const mutations = {
  loginUser(state: State, payload: UserLoggedIn) {
    state.isUserAuthenticated = true;
    state.currentUser = payload;
  },

  loadUser(state: State, payload: UserLoggedIn) {
    state.currentUser = payload;
  },

  isRegistered(state: State, payload: UserRegisterData) {
    state.isRegistered = true;
    state.user.email = payload.email;
  },

  notRegistered(state: State) {
    state.isWrongEmailOnRegister = true;
  },

  startLoading(state: State) {
    state.isLoading = true;
  },

  stopLoading(state: State) {
    state.isLoading = false;
  },

  logoutUser(state: State, payload: UserLoggedIn) {
    state.currentUser.token = payload.token;
    state.currentUser.refreshToken = payload.refreshToken;
    state.isUserAuthenticated = false;
    state.currentUser = {
      user: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        adminAccess: false,
        teacherAccess: false,
        studentAccess: false,
        groups: [],
        image: "",
        homeworkToCheck: [],
      },
      token: "",
      refreshToken: "",
      adminAccess: false,
      teacherAccess: false,
      studentAccess: false,
      id: "",
    };
  },
};

export default mutations;
