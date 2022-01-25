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
}

interface UserLoggedIn {
  user: {
    id: string;
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
  adminAccess: boolean;
  teacherAccess: boolean;
  studentAccess: boolean;
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
}

interface HomeworkToCheck {
  id: string;
  text: string;
  audio?: Array<string>;
  video?: Array<string>;
  image?: Array<string>;
  date?: string;
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
}

interface StudentError {
  errorType: string;
  errorMessage: string;
  errorComment: string;
  date?: string;
}

interface State {
  user: UserModel;
  userId: string;
  token: string;
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
  currentStudentErrors: Array<StudentError>;
  loadedOneUserById: UserModel;
  allUsers: Array<UserModel>;
  isRegistered: boolean;
  isWrongEmailOnRegister: boolean;
  isLoading: boolean;
}

export { UserModel, UserRegisterData, UserLoggedIn, UserLoginData, State, StudentError, Lesson, HomeworkToCheck };
