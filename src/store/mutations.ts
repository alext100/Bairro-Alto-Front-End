import { State, UserLoggedIn, UserRegisterData, Group, UserModel, GroupError, Lesson } from "@/types/interfaces";

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
        studentGroups: [],
        teacherGroups: [],
      },
      firstName: "",
      lastName: "",
      token: "",
      refreshToken: "",
      adminAccess: false,
      teacherAccess: false,
      studentAccess: false,
      studentGroups: [],
      teacherGroups: [],
      id: "",
    };
  },

  loadGroups(state: State, payload: Array<Group>) {
    state.groups = payload;
  },

  loadUserGroups(state: State, payload: Array<Group>) {
    state.userGroups = payload;
  },

  loadOneGroup(state: State, payload: Group) {
    state.currentGroup = payload;
  },

  loadedUsersFromGroup(state: State, payload: UserModel) {
    state.loadedUsersFromGroup.push(payload);
  },

  lastLoadedUser(state: State, payload: UserModel) {
    state.lastLoadedUser = payload;
  },

  deleteLoadedUsersFromGroup(state: State) {
    state.loadedUsersFromGroup = [];
  },

  loadAllUsers(state: State, payload: Array<UserModel>) {
    state.allUsers = payload;
  },

  addGroupError(state: State, payload: Array<GroupError>) {
    state.groupErrors = payload;
  },

  loadLessons(state: State, payload: Array<Lesson>) {
    state.lessons = payload;
  },

  pushNewLessonToLessons(state: State, payload: Lesson) {
    state.lessons.push(payload);
  },

  deleteOneLessonFromLessons(state: State, payload: string) {
    state.lessons = state.lessons.filter((lesson) => lesson.id !== payload);
  },

  updateGroupLessons(state: State, payload: Array<string>) {
    state.currentGroup.lessons = payload;
  },
};

export default mutations;
