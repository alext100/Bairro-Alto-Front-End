import { State } from "@/types/interfaces";

const state = {
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
  userId: "",
  token: "",
  currentUser: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") || "") : "",
  // eslint-disable-next-line no-unneeded-ternary
  isUserAuthenticated: localStorage.getItem("userData") ? true : false,
  groups: [],
  userGroups: [],
  currentGroup: {},
  loadedUsersFromGroup: [],
  currentStudentErrors: [],
  allUsers: [],
  isAdmin: false,
  isProfessor: false,
  isStudent: false,
  isRegistered: false,
  isWrongEmailOnRegister: false,
};

export default state as unknown as State;
