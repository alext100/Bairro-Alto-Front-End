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
});
