import actions from "@/store/actions";
import { Group } from "@/types/interfaces";
import axios from "axios";
import { Commit, Dispatch } from "vuex";
import mockedState from "../mockedState";
import { configActionContext, configActionContextDispatch } from "../test-utils";

jest.mock("axios");
jest.mock("jwt-decode", () => () => ({}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
const commit = jest.fn() as jest.MockedFunction<Commit>;
const dispatch = jest.fn() as jest.MockedFunction<Dispatch>;

describe("Given a actions from state", () => {
  describe("When the action getGroupById is invoked", () => {
    test("Then it should invoke commit with 'loadOneGroup' and received data", async () => {
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
      mockedAxios.get.mockResolvedValue({ data });

      await actions.getGroupById(configActionContext(commit), data.id);

      expect(commit).toHaveBeenCalledWith("loadOneGroup", data);
    });
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("startLoading");
    });

    test("Then it should invoke commit with 'startLoading'", () => {
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

  describe("When the action getGroupById is invoked", () => {
    test("Then it should invoke commit with 'loadOneGroup' and data", async () => {
      const groupId = "61df3923ab6a9fda28a2398a";
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
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action getUserById is invoked", () => {
    test("Then it should invoke commit with 'loadOneGroup' and data", async () => {
      const groupId = "61df3923ab6a9fda28a2398a";
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
    test("Then it should invoke commit with 'startLoading'", () => {
      expect(commit).toHaveBeenCalledWith("stopLoading");
    });
  });

  describe("When the action deleteLoadedUser invoked", () => {
    test("Then it should invoke commit with 'deleteLoadedUsersFromGroup'", async () => {
      await actions.deleteLoadedUsers(configActionContext(commit));

      expect(commit).toHaveBeenCalledWith("deleteLoadedUsersFromGroup");
    });
  });
});
