import { State } from "@/types/interfaces";

const state = {
  currentUser: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") || "") : "",
  // eslint-disable-next-line no-unneeded-ternary
  isUserAuthenticated: localStorage.getItem("userData") ? true : false,
  groups: [],
  userGroups: [],
  currentGroup: {},
  loadedUsersFromGroup: [],
  groupErrors: [],
  allUsers: [],
  isRegistered: false,
  isWrongEmailOnRegister: false,
  isLoading: false,
  userId: "",
  token: "",
  refreshToken: "",
  firstName: "",
  lastName: "",
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
    teacherGroups: [],
    studentGroups: [],
    info: [],
  },
  lastLoadedUser: {},
};

export default state as unknown as State;
