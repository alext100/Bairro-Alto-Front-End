interface InfoModel {
  templateInfo: Array<string>;
}
interface UserModel {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  adminAccess: boolean;
  teacherAccess: boolean;
  studentAccess: boolean;
  groups: Array<string>;
  image: string;
  homeworkToCheck: Array<string>;
  teacherGroups: Array<string>;
  studentGroups: Array<string>;
  info?: Array<InfoModel>;
}

interface UserLoggedIn {
  user: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    adminAccess: boolean;
    teacherAccess: boolean;
    studentAccess: boolean;
    groups: Array<string>;
    image: string;
    homeworkToCheck: Array<string>;
  };
  token: string;
  refreshToken: string;
  adminAccess: boolean;
  teacherAccess: boolean;
  studentAccess: boolean;
  id: string;
  firstName: string;
  lastName: string;
}

interface UserLoginData {
  email: string;
  password: string;
}
interface UserRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface Group {
  id: string;
  groupName: string;
  members: Array<string>;
  homeworkToDo: string;
  lessons: Array<string>;
  groupErrors: Array<string>;
  teachers: Array<string>;
  info?: Array<InfoModel>;
}

interface HomeworkToCheck {
  id: string;
  text: string;
  audio?: Array<string>;
  video?: Array<string>;
  image?: Array<string>;
  date?: string;
  info?: Array<string>;
}

interface Lesson {
  author: string;
  lessonName: string;
  lessonDescription?: string;
  level: string;
  lessonImage?: string;
  videos?: Array<string>;
  audios?: Array<string>;
  text: string;
  date?: string;
  info?: Array<InfoModel>;
}

interface GroupError {
  errorType: string;
  errorMessage: string;
  errorComment: string;
  date?: string;
  id?: string;
  info?: Array<InfoModel>;
}

interface State {
  user: UserModel;
  userId: string;
  token: string;
  refreshToken: string;
  currentUser: UserLoggedIn;
  isUserAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  teachers: Array<UserModel>;
  groups: Array<Group>;
  userGroups: Array<Group>;
  currentGroup: Group;
  loadedUsersFromGroup: Array<UserModel>;
  groupErrors: Array<GroupError>;
  loadedOneUserById: UserModel;
  allUsers: Array<UserModel>;
  isRegistered: boolean;
  isWrongEmailOnRegister: boolean;
  isLoading: boolean;
  lastLoadedUser: UserModel;
}

export {
  UserModel,
  UserRegisterData,
  UserLoggedIn,
  UserLoginData,
  State,
  GroupError,
  Lesson,
  HomeworkToCheck,
  Group,
  InfoModel,
};
