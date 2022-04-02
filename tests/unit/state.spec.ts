import state from "@/store/state";

describe("Given a state", () => {
  describe("When the real state is imported", () => {
    test("It should be equal to the state to test", () => {
      const stateToTest = {
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
        lessons: [],
        groupLessons: [],
        webContent: sessionStorage.getItem("webContent")
          ? JSON.parse(sessionStorage.getItem("webContent") || "")
          : {
              posts: [],
              categories: [],
            },
        courseNames: sessionStorage.getItem("courseNames")
          ? JSON.parse(sessionStorage.getItem("courseNames") || "")
          : {
              courseNames: [],
            },
      };

      expect(stateToTest).toStrictEqual(state);
    });
  });
});
