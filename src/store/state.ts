import { State } from "@/types/interfaces";

const state = {
  currentUser: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") || "") : "",
  // eslint-disable-next-line no-unneeded-ternary
  isUserAuthenticated: localStorage.getItem("userData") ? true : false,
  groups: [],
  userGroups: [],
  currentGroup: {},
  loadedUsersFromGroup: [],
  currentStudentErrors: [],
  allUsers: [],
  isRegistered: false,
  isWrongEmailOnRegister: false,
  isLoading: false,
  userId: "",
  token: "",
  refreshToken: "",
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
};

export default state as unknown as State;
