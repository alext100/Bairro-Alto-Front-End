import actions from "@/store/actions";
import {
  Group,
  GroupError,
  Lesson,
  Post,
  UserLoginData,
  UserModel,
  UserPaymentData,
  WebContent,
} from "@/types/interfaces";
import axios from "axios";
import { Commit, Dispatch } from "vuex";
import { cleanup } from "@testing-library/vue";
import { enableAutoUnmount } from "@vue/test-utils";
import { configActionContext, configActionContextDispatch } from "../test-utils";

jest.mock("axios");
jest.mock("jwt-decode", () => () => ({}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
const commit = jest.fn() as jest.MockedFunction<Commit>;
const dispatch = jest.fn() as jest.MockedFunction<Dispatch>;
afterEach(() => cleanup());
enableAutoUnmount(afterEach);

describe("Given an actions from state", () => {
  describe("When the action login is invoked with userData", () => {
    const userData: UserLoginData = {
      password: "12345",
      email: "asdf@mail.com",
    };
    const response = {
      data: {
        token: "eyJhsdfOiJIUzIsgInR5cCI4MmNmssf1OGZkZWVhMGMjQ5eHAgh9.jMdhR_uMO9-Fu62lWzqM",
      },
    };
    const { token } = response.data;
    const user = {};
    test("Then it should call dispatch with 'userLoggedFromApi' and { user, token }", async () => {
      mockedAxios.post.mockResolvedValue(response);
      await actions.login(configActionContextDispatch(dispatch), userData);

      expect(dispatch).toHaveBeenCalledWith("userLoggedFromApi", { user, token });
    });
    test("Then it should call localStorage.setItem with 'userData' and JSON.stringify({ token })", async () => {
      jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem");

      mockedAxios.post.mockResolvedValue(response);
      await actions.login(configActionContextDispatch(dispatch), userData);

      expect(localStorage.setItem).toHaveBeenCalledWith("userData", JSON.stringify({ token }));
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.post.mockResolvedValue(response);
      await actions.login(configActionContext(commit), userData);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action verifyUser is invoked with code", () => {
    test("Then it should return response.data", async () => {
      const code = "1234567890";
      const response = { data: {} };

      mockedAxios.get.mockResolvedValue(response);
      await actions.verifyUser(configActionContext(commit), code);

      expect(axios.get).toHaveBeenCalledWith(`${process.env.VUE_APP_URL}/user/confirm/${code}`);
    });
  });

  describe("When the action sendConfirmEmailOneMoreTime is invoked with email", () => {
    test("Then it should return response.data", async () => {
      const email = "alex@mail.com";
      const response = { data: {} };

      mockedAxios.get.mockResolvedValue(response);
      await actions.sendConfirmEmailOneMoreTime(configActionContext(commit), email);

      expect(axios.get).toHaveBeenCalledWith(`${process.env.VUE_APP_URL}/user/confirm/repeat-email/${email}`);
    });
  });

  describe("When the action registerUser is invoked", () => {
    const userData: UserLoginData = {
      password: "12345",
      email: "asdf@mail.com",
    };
    describe("And response.status === 201", () => {
      test("Then it should call commit with 'isRegistered' and userData", async () => {
        const response = { status: 201 };

        mockedAxios.post.mockResolvedValue(response);
        await actions.registerUser(configActionContext(commit), userData);

        expect(commit).toHaveBeenCalledWith("isRegistered", userData);
      });
    });
    describe("And response.status will be other", () => {
      test("Then it should call commit with 'notRegistered'", async () => {
        const response = { status: 500 };

        mockedAxios.post.mockResolvedValue(response);
        await actions.registerUser(configActionContext(commit), userData);

        expect(commit).toHaveBeenCalledWith("notRegistered");
      });
    });
  });

  describe("When the action deleteDataFromLocalStorage is invoked", () => {
    test("Then it should call localStorage.removeItem with 'userData'", () => {
      jest.spyOn(Object.getPrototypeOf(window.localStorage), "removeItem");

      actions.deleteDataFromLocalStorage(configActionContext(commit));

      expect(localStorage.removeItem).toHaveBeenCalledWith("userData");
    });

    test("Then it should call localStorage.removeItem with 'currentGroupId'", () => {
      jest.spyOn(Object.getPrototypeOf(window.localStorage), "removeItem");

      actions.deleteDataFromLocalStorage(configActionContext(commit));

      expect(localStorage.removeItem).toHaveBeenCalledWith("currentGroupId");
    });

    test("Then it should call localStorage.removeItem with 'token'", () => {
      jest.spyOn(Object.getPrototypeOf(window.localStorage), "removeItem");

      actions.deleteDataFromLocalStorage(configActionContext(commit));

      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    });

    test("Then it should call localStorage.removeItem with 'token'", () => {
      jest.spyOn(Object.getPrototypeOf(window.sessionStorage), "clear");

      actions.deleteDataFromLocalStorage(configActionContext(commit));

      expect(sessionStorage.clear).toHaveBeenCalled();
    });

    test("Then it should call commit with 'logoutUser' and loggedOutUser", () => {
      const loggedOutUser = { token: "", refreshToken: "" };

      actions.deleteDataFromLocalStorage(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("logoutUser", loggedOutUser);
    });
  });

  describe("When the action getGroupById is invoked", () => {
    const data = {
      members: ["64016c92709d41ccaf5c1948"],
      groupName: "A1. Вторник / Четверг 19:00-20:30",
      groupErrors: ["61f805d94a80fbcfb7y33d98"],
      homeworkToDo: [
        {
          title: "ghjk",
          message: "<p>&nbsp;</p>",
          time: "2022-02-15T17:56:39.791Z",
          audios: ["https://storage.googleapis.com/bairro-alto.appspot.com/APPLAUSE-1644947827589.mp3"],
        },
      ],
      teachers: ["61f07cf00e2b45ec345efee8"],
      info: [],
      lessons: ["620121900b6b1e9d99ea1c92", "620bd58941f515215b27768a"],
      id: "61e4a8945a0d6cd627f65232",
    };
    test("Then it should invoke commit with 'loadOneGroup' and received data", async () => {
      mockedAxios.get.mockResolvedValue({ data });

      await actions.getGroupById(configActionContext(commit), data.id);

      expect(commit).toHaveBeenCalledWith("loadOneGroup", data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });

    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getGroupById(configActionContext(commit), data.id);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action getGroupsFromApi is invoked", () => {
    test("Then it should invoke commit with 'loadGroups' and data", async () => {
      const data: Array<Group> = [
        {
          members: ["64016c92709d41ccaf5c1948"],
          groupName: "A1. Вторник / Четверг 19:00-20:30",
          groupErrors: ["61f805d94a80fbcfb7y33d98"],
          homeworkToDo: [
            {
              title: "ghjk",
              message: "<p>&nbsp;</p>",
              time: "2022-02-15T17:56:39.791Z",
              audios: ["https://storage.googleapis.com/bairro-alto.appspot.com/APPLAUSE-1644947827589.mp3"],
            },
          ],
          teachers: ["61f07cf00e2b45ec345efee8"],
          lessons: ["620121900b6b1e9d99ea1c92", "620bd58941f515215b27768a"],
          id: "61e4a8945a0d6cd627f65232",
        },
      ];
      const response = { data };

      mockedAxios.get.mockResolvedValue(response);
      await actions.getGroupsFromApi(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("loadGroups", response.data);
    });
  });

  describe("When the action getUserGroupsFromApi is invoked", () => {
    test("Then it should invoke commit with 'loadUserGroups' and data", async () => {
      const data = {
        teacherGroups: [
          {
            members: ["62076c93706d41ccaf4c1748"],
            groupName: "A1. Вторник / Четверг 19:00-20:30",
            groupErrors: ["61f805d84a80fbcfb7f33d38"],
            homeworkToDo: [
              {
                title: "ghjk",
                message: "<p>&nbsp;</p>",
                time: "2022-02-15T17:56:39.791Z",
                audios: ["https://storage.googleapis.com/bairro-alto.appspot.com/APPLAUSE-1644947827589.mp3"],
              },
            ],
            teachers: ["61f07cf00e2b45ec821efee7", "61df3972ab6a9fda28a9022a"],
            info: [],
            lessons: ["620121900b6b1e9d34ea1c65", "620bd58941f515215b23458a"],
            id: "61e4a8945a0d6cd627f65232",
          },
        ],
        id: "61df3923ab6a9fda28a2398a",
      };
      const response = { data };

      mockedAxios.get.mockResolvedValue(response);
      await actions.getUserGroupsFromApi(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("loadUserGroups", data.teacherGroups);
    });
  });

  describe("When the action addGroupToTeacher is invoked with groupId", () => {
    test("Then it should call dispatch with 'getUserGroupsFromApi'", async () => {
      const groupId = "12435wt4veg5w2342sdf";

      mockedAxios.patch.mockResolvedValue("");
      await actions.addGroupToTeacher(configActionContextDispatch(dispatch), groupId);

      expect(dispatch).toHaveBeenCalledWith("getUserGroupsFromApi");
    });
  });

  describe("When the action deleteUserGroup is invoked with groupId", () => {
    test("Then it should call dispatch with 'getUserGroupsFromApi'", async () => {
      const groupId = "1243sg3eaw3df42sdf";

      mockedAxios.patch.mockResolvedValue("");
      await actions.deleteUserGroup(configActionContextDispatch(dispatch), groupId);

      expect(dispatch).toHaveBeenCalledWith("getUserGroupsFromApi");
    });
  });

  describe("When the action getGroupById is invoked", () => {
    const groupId = "61df3923ab6a9fda28a2398a";

    test("Then it should invoke commit with 'loadOneGroup' and data", async () => {
      const data = {
        members: ["62076c93706d41ccaf4c1748"],
        groupName: "A1. Вторник / Четверг 19:00-20:30",
        groupErrors: ["61f805d84a80fbcfb7f33d38"],
        homeworkToDo: [
          {
            title: "ghjk",
            message: "<p>&nbsp;</p>",
            time: "2022-02-15T17:56:39.791Z",
            audios: ["https://storage.googleapis.com/bairro-alto.appspot.com/APPLAUSE-1644947827589.mp3"],
          },
        ],
        teachers: ["61f07cf00e2b45ec821efee7", "61df3972ab6a9fda28a9022a"],
        info: [],
        lessons: ["620121900b6b1e9d34ea1c65", "620bd58941f515215b23458a"],
        id: "61e4a8945a0d6cd627f65232",
      };
      const response = { data };

      mockedAxios.get.mockResolvedValue(response);
      await actions.getGroupById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("loadOneGroup", data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getGroupById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action getUserById is invoked", () => {
    const groupId = "61df3923ab6a9fda28a2398a";
    test("Then it should invoke commit with 'loadOneGroup' and data", async () => {
      const data = {
        members: ["62076c93706d41ccaf4c1748"],
        groupName: "A1. Вторник / Четверг 19:00-20:30",
        groupErrors: ["61f805d84a80fbcfb7f33d38"],
        homeworkToDo: [
          {
            title: "ghjk",
            message: "<p>&nbsp;</p>",
            time: "2022-02-15T17:56:39.791Z",
            audios: ["https://storage.googleapis.com/bairro-alto.appspot.com/APPLAUSE-1644947827589.mp3"],
          },
        ],
        teachers: ["61f07cf00e2b45ec821efee7", "61df3972ab6a9fda28a9022a"],
        info: [],
        lessons: ["620121900b6b1e9d34ea1c65", "620bd58941f515215b23458a"],
        id: "61e4a8945a0d6cd627f65232",
      };
      const response = { data };

      mockedAxios.get.mockResolvedValue(response);
      await actions.getUserById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("loadedUsersFromGroup", { ...data });
      expect(commit).toHaveBeenCalledWith("loadLastUser", { ...data });
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getUserById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action deleteLoadedUser invoked", () => {
    test("Then it should invoke commit with 'deleteLoadedUsersFromGroup'", async () => {
      await actions.deleteLoadedUsers(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("deleteLoadedUsersFromGroup");
    });
  });

  describe("When the action updateGroup invoked with groupToUpdate", () => {
    const groupToUpdate = {
      members: ["62076c93706d41ccaf4c1748"],
      groupName: "A1. Вторник / Четверг 19:00-20:30",
      groupErrors: ["61f805d84a80fbcfb7f33d38"],
      homeworkToDo: [
        {
          title: "ghjk",
          message: "<p>&nbsp;</p>",
          time: "2022-02-15T17:56:39.791Z",
          audios: ["https://storage.googleapis.com/bairro-alto.appspot.com/APPLAUSE-1644947827589.mp3"],
        },
      ],
      teachers: ["61f07cf00e2b45ec821efee7", "61df3972ab6a9fda28a9022a"],
      info: [],
      lessons: ["620121900b6b1e9d34ea1c65", "620bd58941f515215b23458a"],
      id: "61e4a8945a0d6cd627f65232",
    };
    test("Then it should invoke dispatch with 'getGroupById'", async () => {
      await actions.updateGroup(configActionContextDispatch(dispatch), groupToUpdate);

      expect(dispatch).toHaveBeenCalledWith("getGroupById", groupToUpdate.id);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.updateGroup(configActionContext(commit), groupToUpdate);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action addMemberToGroup invoked with { userId, groupId }", () => {
    const userId = "lqasdjlhro28734uqtrfhq3";
    const groupId = "lq234asdro28734uqtrfhq3";

    test("Then it should invoke dispatch with 'getUserById' and userId", async () => {
      await actions.addMemberToGroup(configActionContextDispatch(dispatch), { userId, groupId });

      expect(dispatch).toHaveBeenCalledWith("getUserById", userId);
    });

    test("Then it should invoke dispatch with 'getGroupById' and groupId", async () => {
      await actions.addMemberToGroup(configActionContextDispatch(dispatch), { userId, groupId });

      expect(dispatch).toHaveBeenCalledWith("getGroupById", groupId);
    });

    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });

    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.addMemberToGroup(configActionContext(commit), { userId, groupId });

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action deleteMemberFromGroup invoked with { userId, groupId }", () => {
    const userId = "lqa2sd2l2ro28734uq2rf2q3";
    const groupId = "lq234asd2o28734uwe2rfh23";

    test("Then it should invoke dispatch", async () => {
      mockedAxios.patch.mockResolvedValue("");

      await actions.deleteMemberFromGroup(configActionContextDispatch(dispatch), { userId, groupId });

      expect(dispatch).toHaveBeenCalled();
    });
  });

  describe("When the action getAllUsersFromApi is invoked", () => {
    test("Then it should invoke commit with 'loadAllUsers' and data", async () => {
      const data = {};
      const response = { data };

      mockedAxios.get.mockResolvedValue(response);
      await actions.getAllUsersFromApi(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("loadAllUsers", data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getAllUsersFromApi(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action addErrorToGroup is invoked with groupId and groupError", () => {
    const groupId = "61df3923ab6a9fda28a2398a";
    const groupError: GroupError = { errorType: "", errorMessage: "", errorComment: "" };

    test("Then it should invoke dispatch with 'getGroupById' and groupId", async () => {
      await actions.addErrorToGroup(configActionContextDispatch(dispatch), { groupId, groupError });

      expect(dispatch).toHaveBeenCalledWith("getGroupById", groupId);
    });
    test("Then it should invoke dispatch with 'getGroupErrorsById' and groupId", async () => {
      await actions.addErrorToGroup(configActionContextDispatch(dispatch), { groupId, groupError });

      expect(dispatch).toHaveBeenCalledWith("getGroupErrorsById", groupId);
    });
  });

  describe("When the action getGroupErrorsById is invoked with groupId", () => {
    const groupId = "61df3923ab6a9fda28a2398a";

    test("Then it should invoke commit with 'addGroupError' and data.groupErrors", async () => {
      const data = {
        groupErrors: [],
        id: "",
      };

      mockedAxios.get.mockResolvedValue({ data });
      await actions.getGroupErrorsById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("addGroupError", data.groupErrors);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getGroupErrorsById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action updateGroupErrorsById is invoked with groupError", () => {
    test("Then it should invoke axios.put", async () => {
      const groupError: GroupError = { errorType: "", errorMessage: "", errorComment: "" };

      await actions.updateGroupErrorsById(configActionContextDispatch(dispatch), groupError);

      expect(axios.put).toHaveBeenCalled();
    });
  });

  describe("When the action deleteGroupError is invoked with groupId and errorId", () => {
    test("Then it should invoke axios.patch", async () => {
      const groupId = "61df3923ab6a9fda28a2398a";
      const errorId = "61df3923ab6a9fda28a2398a";

      mockedAxios.patch.mockResolvedValue("");
      await actions.deleteGroupError(configActionContext(commit), { groupId, errorId });

      expect(axios.patch).toHaveBeenCalled();
    });
  });

  describe("When the action createGroup is invoked with groupData", () => {
    test("Then it should invoke dispatch with 'getGroupsFromApi'", async () => {
      const groupData: Group = {
        id: "",
        groupName: "",
        members: [],
        homeworkToDo: [],
        lessons: [],
        groupErrors: [],
        teachers: [],
      };

      mockedAxios.post.mockResolvedValue("");
      await actions.createGroup(configActionContextDispatch(dispatch), groupData);

      expect(dispatch).toHaveBeenCalledWith("getGroupsFromApi");
    });
  });

  describe("When the action createLesson is invoked with lesson", () => {
    const lesson: Lesson = { author: "", title: "", level: "", body: "" };
    test("Then it should invoke commit with 'pushNewLessonToLessons' and newLesson.data", async () => {
      const newLesson = { data: { author: "", title: "", level: "", body: "" } };

      mockedAxios.post.mockResolvedValue(newLesson);
      await actions.createLesson(configActionContext(commit), lesson);

      expect(commit).toHaveBeenCalledWith("pushNewLessonToLessons", newLesson.data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.createLesson(configActionContext(commit), lesson);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action getLessonsFromApi is invoked with lesson", () => {
    test("Then it should invoke commit with 'loadLessons' and received data", async () => {
      const data: Array<Lesson> = [];

      mockedAxios.get.mockResolvedValue({ data });
      await actions.getLessonsFromApi(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("loadLessons", data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getLessonsFromApi(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action getAllCourseNames is invoked", () => {
    test("Then it should invoke commit with 'loadCourseNames' and data", async () => {
      const data = [{ courseName: "", id: "" }];

      mockedAxios.get.mockResolvedValue({ data });
      await actions.getAllCourseNames(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("loadCourseNames", data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.getAllCourseNames(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action deleteLessonById is invoked", () => {
    const lessonId = "61df3923ab6a9fda28a2398a";
    test("Then it should invoke commit with 'deleteOneLessonFromLessons' and lessonId", async () => {
      mockedAxios.delete.mockResolvedValue("");

      await actions.deleteLessonById(configActionContext(commit), lessonId);

      expect(commit).toHaveBeenCalledWith("deleteOneLessonFromLessons", lessonId);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.delete.mockResolvedValue("");

      await actions.deleteLessonById(configActionContext(commit), lessonId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action updateLessonById is invoked with lessonId and lesson", () => {
    const lessonId = "620121900b6b1e9d34ea1c65";
    const lesson: Lesson = { author: "", title: "", level: "", body: "" };

    test("Then it should invoke dispatch with 'getLessonsFromApi'", async () => {
      mockedAxios.put.mockResolvedValue("");

      await actions.updateLessonById(configActionContextDispatch(dispatch), { lessonId, lesson });

      expect(dispatch).toHaveBeenCalledWith("getLessonsFromApi");
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.put.mockResolvedValue("");

      await actions.updateLessonById(configActionContext(commit), { lessonId, lesson });

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action toggleLessonInGroup is invoked with lessonId and groupId", () => {
    const lessonId = "620121900b6b1e9d34ea1c65";
    const groupId = "620121900b6b1e9d34ea1c65";
    const updatedLesson = { data: { author: "", title: "", level: "", body: "" } };

    test("Then it should invoke commit with 'updateGroupLessons' and updatedLesson.data", async () => {
      mockedAxios.patch.mockResolvedValue(updatedLesson);

      await actions.toggleLessonInGroup(configActionContext(commit), { groupId, lessonId });

      expect(commit).toHaveBeenCalledWith("updateGroupLessons", updatedLesson.data);
    });
  });

  describe("When the action getGroupLessonsById is invoked with groupId", () => {
    const groupId = "61df3923ab6a9fda28a2398a";
    const data = { lessons: [], id: "" };

    test("Then it should invoke commit with 'setGroupLessons' and data.lessons", async () => {
      mockedAxios.get.mockResolvedValue({ data });
      await actions.getGroupLessonsById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("setGroupLessons", data.lessons);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.get.mockResolvedValue({ data });

      await actions.getGroupLessonsById(configActionContext(commit), groupId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action getWebContent is invoked", () => {
    const response = {
      data: [
        {
          categories: [{ title: "", slug: "" }],
          posts: [{ title: "", body: "", category: "" }],
          id: "123456789",
        },
      ],
    };
    test("Then it should invoke commit with 'setWebContent' and data[0]", async () => {
      mockedAxios.get.mockResolvedValue(response);

      await actions.getWebContent(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("setWebContent", response.data[0]);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.get.mockResolvedValue(response);

      await actions.getWebContent(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action updateWebContent is invoked", () => {
    const webContent: WebContent = { posts: [], categories: [] };
    const updated = { data: { posts: [], categories: [] } };
    test("Then it should call commit with 'setWebContent' and updated.data", async () => {
      mockedAxios.put.mockResolvedValue(updated);

      await actions.updateWebContent(configActionContext(commit), webContent);

      expect(commit).toHaveBeenCalledWith("setWebContent", updated.data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.put.mockResolvedValue(updated);

      await actions.updateWebContent(configActionContext(commit), webContent);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action updatePostById is invoked with post", () => {
    const post: Post = { title: "", body: "", category: "", id: "61df3923ab6a9fda28a2398a" };

    test("Then it should invoke dispatch with 'getWebContent'", async () => {
      mockedAxios.put.mockResolvedValue("");

      await actions.updatePostById(configActionContextDispatch(dispatch), post);

      expect(dispatch).toHaveBeenCalledWith("getWebContent");
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.put.mockResolvedValue("");

      await actions.updatePostById(configActionContext(commit), post);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action deleteWebPost is invoked with postId", () => {
    const postId = "61df3923ab6a9fda28a2398a";
    test("Then it should invoke commit with 'deleteOnePostFromPosts' and postId", async () => {
      mockedAxios.delete.mockResolvedValue("");

      await actions.deleteWebPost(configActionContext(commit), postId);

      expect(commit).toHaveBeenCalledWith("deleteOnePostFromPosts", postId);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.delete.mockResolvedValue("");

      await actions.deleteWebPost(configActionContext(commit), postId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action deleteWebCategory is invoked with categoryId", () => {
    const categoryId = "61df3923ab6a9fda28a2398a";
    test("Then it should invoke commit with 'deleteOneCategory' and categoryId", async () => {
      mockedAxios.delete.mockResolvedValue("");

      await actions.deleteWebCategory(configActionContext(commit), categoryId);

      expect(commit).toHaveBeenCalledWith("deleteOneCategory", categoryId);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.delete.mockResolvedValue("");

      await actions.deleteWebCategory(configActionContext(commit), categoryId);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action payment is invoked with userData", () => {
    const userData: UserPaymentData = {
      courseName: "",
      firstName: "",
      lastName: "",
      email: "",
      price: 1000,
      date: 344356356,
    };
    const paymentResponse = {};
    test("Then it should call commit with 'paymentResponse' and paymentResponse", async () => {
      mockedAxios.post.mockResolvedValue(paymentResponse);
      await actions.payment(configActionContext(commit), userData);

      expect(commit).toHaveBeenCalledWith("paymentResponse", paymentResponse);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      mockedAxios.post.mockResolvedValue(paymentResponse);

      await actions.payment(configActionContext(commit), userData);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action updateUser invoked with user", () => {
    const user: UserModel = {
      id: "",
      password: "",
      email: "asdf@mail.com",
      firstName: "Ivan",
      lastName: "Ivanov",
      image: "",
      adminAccess: false,
      teacherAccess: false,
      studentAccess: true,
      groups: [],
      teacherGroups: [],
      studentGroups: ["61e4a8945a0d6cd627f65232"],
      homeworkToCheck: [],
      info: [],
      status: "Active",
      confirmationCode: "",
    };
    test("Then it should invoke dispatch with 'getAllUsersFromApi'", async () => {
      await actions.updateUser(configActionContextDispatch(dispatch), user);

      expect(dispatch).toHaveBeenCalledWith("getAllUsersFromApi");
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.updateUser(configActionContext(commit), user);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action changePassword invoked with user", () => {
    const user: UserModel = {
      id: "",
      password: "",
      email: "asdf@mail.com",
      firstName: "Ivan",
      lastName: "Ivanov",
      image: "",
      adminAccess: false,
      teacherAccess: false,
      studentAccess: true,
      groups: [],
      teacherGroups: [],
      studentGroups: ["61e4a8945a0d6cd627f65232"],
      homeworkToCheck: [],
      info: [],
      status: "Active",
      confirmationCode: "",
    };
    const updatedUser: UserModel = {
      id: "",
      password: "",
      email: "asdf@mail.com",
      firstName: "Ivan",
      lastName: "Ivanov",
      image: "",
      adminAccess: false,
      teacherAccess: false,
      studentAccess: true,
      groups: [],
      teacherGroups: [],
      studentGroups: ["61e4a8945a0d6cd627f65232"],
      homeworkToCheck: [],
      info: [],
      status: "Active",
      confirmationCode: "",
    };
    describe("And the updatedUser !== undefind", () => {
      test("Then it should invoke commit with 'loadUser' and updatedUser", async () => {
        mockedAxios.put.mockResolvedValue(updatedUser);

        await actions.changePassword(configActionContext(commit), user);

        expect(commit).toHaveBeenCalledWith("loadUser", updatedUser);
        expect(commit).toHaveBeenCalledWith("isRegistered", updatedUser);
      });
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });
    test("Then it should invoke commit with 'stopLoading'", async () => {
      await actions.changePassword(configActionContext(commit), user);

      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });
});
