/* eslint-disable @typescript-eslint/no-unused-vars */
import * as firestoreService from "@/database/firestore";
import {
  Group,
  GroupError,
  Lesson,
  State,
  UserLoggedIn,
  UserLoginData,
  UserModel,
  WebContent,
} from "@/types/interfaces";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { ActionContext } from "vuex";
import { getAuth, signInAnonymously } from "firebase/auth";
import state from "./state";

const auth = getAuth();

const actions = {
  async login({ dispatch, commit }: ActionContext<State, State>, userData: UserLoginData): Promise<void> {
    commit("startLoading");
    const response = await axios.post(<string>process.env.VUE_APP_LOGIN_URL, userData);
    const { token } = response.data;
    const user = jwtDecode(token);
    dispatch("userLogedFromApi", { user, token });
    localStorage.setItem("userData", JSON.stringify({ token }));

    signInAnonymously(auth)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then(() => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    commit("stopLoading");
  },

  async userLogedFromApi(
    { commit }: ActionContext<State, State>,
    { user, token, refreshToken }: UserLoggedIn
  ): Promise<void> {
    commit("startLoading");
    const { data } = await axios({
      method: "GET",
      url: `${process.env.VUE_APP_URL}/user/get-one-by-id/${user.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    data.token = token;
    data.refreshToken = refreshToken;
    localStorage.setItem("token", token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: data.id,
        password: data.password,
        token: data.token,
        firstName: data.firstName,
        adminAccess: data.adminAccess,
        teacherAccess: data.teacherAccess,
        studentAccess: data.studentAccess,
        teacherGroups: data.teacherGroups,
        studentGroups: data.studentGroups,
        homeworkToCheck: data.homeworkToCheck,
      })
    );
    commit("loginUser", data);
    commit("loadUser", data);
    commit("stopLoading");
    await firestoreService.addIdentifiedUser(data.id, {
      _id: data.id,
      username: `${data?.firstName} ${data?.lastName.charAt(0)}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
  },

  async registerUser({ commit }: ActionContext<State, State>, userData: UserLoginData): Promise<void> {
    await axios
      .post(`${process.env.VUE_APP_URL}/user/register`, userData)
      .then((response) => {
        if (response.status === 201) {
          commit("isRegistered", userData);
        }
      })
      .catch((error) => {
        commit("notRegistered");
        throw error;
      });
  },

  async deleteDataFromLocalStorage({ commit }: ActionContext<State, State>): Promise<void> {
    localStorage.removeItem("userData");
    localStorage.removeItem("currentGroupId");
    localStorage.removeItem("token");
    sessionStorage.clear();
    const logedOutUser = { token: "", refreshToken: "" };
    commit("logoutUser", logedOutUser);
  },

  async getGroupsFromApi({ commit }: ActionContext<State, State>): Promise<void> {
    const { data } = await axios.get(`${process.env.VUE_APP_URL}/group/get-all`);
    commit("loadGroups", data);
  },

  async getUserGroupsFromApi({ commit }: ActionContext<State, State>): Promise<void> {
    const { data } = await axios({
      method: "GET",
      url: `${process.env.VUE_APP_URL}/user/get-all-user-groups`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
    });
    commit("loadUserGroups", data.teacherGroups);
  },

  async addGroupToTeacher({ dispatch }: ActionContext<State, State>, groupId: string): Promise<void> {
    const idOfGroup = (group: Group) => group.id === groupId;
    if (state.userGroups.find(idOfGroup) === undefined) {
      await axios({
        method: "PATCH",
        url: `${process.env.VUE_APP_URL}/user/add-group-to-user/${groupId}`,
        headers: { Authorization: `Bearer ${state.currentUser.token}` },
      });
      dispatch("getUserGroupsFromApi");
    }
  },

  async deleteUserGroup({ dispatch }: ActionContext<State, State>, groupId: string): Promise<void> {
    const idOfGroup = (group: Group) => group.id === groupId;
    if (state.userGroups.find(idOfGroup) !== undefined) {
      await axios({
        method: "PATCH",
        url: `${process.env.VUE_APP_URL}/user/delete-group-from-user/${groupId}`,
        headers: { Authorization: `Bearer ${state.currentUser.token}` },
      });
      dispatch("getUserGroupsFromApi");
    }
  },

  async getGroupById({ commit }: ActionContext<State, State>, groupId: string): Promise<void> {
    commit("startLoading");
    const { data } = await axios.get(`${process.env.VUE_APP_URL}/group/get-one-by-id/${groupId}`);
    localStorage.setItem(
      "currentGroupId",
      JSON.stringify({
        id: data.id,
        groupErrors: data.groupErrors,
        groupName: data.groupName,
        homeworkToDo: data.homeworkToDo,
      })
    );
    commit("loadOneGroup", data);
    commit("stopLoading");
  },

  async getUserById({ commit }: ActionContext<State, State>, userId: string): Promise<void> {
    commit("startLoading");
    const { data } = await axios.get(`${process.env.VUE_APP_URL}/user/get-one-by-id/${userId}`);
    commit("loadedUsersFromGroup", { ...data });
    commit("loadLastUser", { ...data });
    commit("stopLoading");
  },

  async deleteLoadedUsers({ commit }: ActionContext<State, State>): Promise<void> {
    commit("deleteLoadedUsersFromGroup");
  },

  async updateGroup({ dispatch, commit }: ActionContext<State, State>, groupToUpdate: Group): Promise<void> {
    commit("startLoading");
    await axios.put(`${process.env.VUE_APP_URL}/group/update-group-by-id/${groupToUpdate.id}`, groupToUpdate);
    dispatch("getGroupById", groupToUpdate.id);
    commit("stopLoading");
  },

  async addMemberToGroup(
    { dispatch, commit }: ActionContext<State, State>,
    { userId, groupId }: { userId: string; groupId: string }
  ): Promise<void> {
    commit("startLoading");
    const idOfUser = (user: UserModel) => user.id === userId;
    if (state.loadedUsersFromGroup.find(idOfUser) === undefined) {
      await axios.patch(`${process.env.VUE_APP_URL}/group/add-group-to-any-user/${userId}`, { id: groupId });
      dispatch("getUserById", userId);
      dispatch("getGroupById", groupId);
    }
    commit("stopLoading");
  },

  async getAllUsersFromApi({ commit }: ActionContext<State, State>): Promise<void> {
    commit("startLoading");
    const { data } = await axios.get(`${process.env.VUE_APP_URL}/user/get-all`);
    commit("loadAllUsers", data);
    commit("stopLoading");
  },

  async deleteMemberFromGroup(
    { dispatch }: ActionContext<State, State>,
    { userId, groupId }: { userId: string; groupId: string }
  ): Promise<void> {
    const idOfUser = (user: UserModel) => user.id === userId;
    if (state.loadedUsersFromGroup.find(idOfUser) !== undefined) {
      await axios.patch(`${process.env.VUE_APP_URL}/group/delete-group-member/${userId}`, { id: groupId });
      dispatch("getGroupById", groupId);
    }
  },

  async addErrorToGroup(
    { dispatch }: ActionContext<State, State>,
    { groupId, groupError }: { groupId: string; groupError: GroupError }
  ): Promise<void> {
    await axios.patch(`${process.env.VUE_APP_URL}/error/add-error-to-group/${groupId}`, { ...groupError });
    dispatch("getGroupById", groupId);
    dispatch("getGroupErrorsById", groupId);
  },

  async getGroupErrorsById({ commit }: ActionContext<State, State>, groupId: string): Promise<void> {
    commit("startLoading");
    const { data } = await axios.get(`${process.env.VUE_APP_URL}/error/get-all-group-errors/${groupId}`);
    commit("addGroupError", data.groupErrors);
    commit("stopLoading");
  },

  async updateGroupErrorsById({ dispatch }: ActionContext<State, State>, groupError: GroupError): Promise<void> {
    await axios.put(`${process.env.VUE_APP_URL}/error/update-group-error/${groupError.id}`, groupError);
  },

  async deleteGroupError(
    { commit }: ActionContext<State, State>,
    { groupId, errorId }: { groupId: string; errorId: string }
  ): Promise<void> {
    await axios.patch(`${process.env.VUE_APP_URL}/error/delete-error-from-group/${groupId}`, {
      id: errorId,
    });
  },

  async createGroup({ dispatch }: ActionContext<State, State>, groupData: Group): Promise<void> {
    await axios.post(`${process.env.VUE_APP_URL}/group/add`, groupData);
    dispatch("getGroupsFromApi");
  },

  async createLesson({ commit }: ActionContext<State, State>, lesson: Lesson): Promise<void> {
    commit("startLoading");
    const newLesson = await axios({
      method: "POST",
      url: `${process.env.VUE_APP_URL}/lesson/add`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
      data: lesson,
    });
    commit("pushNewLessonToLessons", newLesson.data);
    commit("stopLoading");
  },

  async getLessonsFromApi({ commit }: ActionContext<State, State>): Promise<void> {
    commit("startLoading");
    const { data } = await axios({
      method: "GET",
      url: `${process.env.VUE_APP_URL}/lesson/get-all`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
    });
    commit("loadLessons", data);
    commit("stopLoading");
  },

  async deleteLessonById({ commit }: ActionContext<State, State>, lessonId: string): Promise<void> {
    commit("startLoading");
    await axios({
      method: "DELETE",
      url: `${process.env.VUE_APP_URL}/lesson/delete/${lessonId}`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
    });
    commit("deleteOneLessonFromLessons", lessonId);
    commit("stopLoading");
  },

  async updateLessonById(
    { dispatch, commit }: ActionContext<State, State>,
    { lessonId, lesson }: { lessonId: string; lesson: Lesson }
  ): Promise<void> {
    commit("startLoading");
    await axios({
      method: "PUT",
      url: `${process.env.VUE_APP_URL}/lesson/update/${lessonId}`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
      data: lesson,
    });
    dispatch("getLessonsFromApi");
    commit("stopLoading");
  },

  async uploadAudio({ commit }: ActionContext<State, State>, file: Array<File>): Promise<void> {
    commit("startLoading");
    const formData = new FormData();
    formData.append("audio", file[0], file[0].name);
    const audio = await axios({
      method: "POST",
      url: process.env.VUE_APP_AUDIO_UPLOAD_URL,
      data: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).catch((error) => error);
    commit("stopLoading");
    return audio;
  },

  async toggleLessonInGroup(
    { commit }: ActionContext<State, State>,
    { groupId, lessonId }: { groupId: string; lessonId: string }
  ) {
    const updatedLesson = await axios({
      method: "PATCH",
      url: `${process.env.VUE_APP_URL}/group/add-group-lesson/${groupId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      data: { id: lessonId },
    }).catch((error) => error);
    commit("updateGroupLessons", updatedLesson.data);
  },

  async getGroupLessonsById({ commit }: ActionContext<State, State>, groupId: string): Promise<void> {
    commit("startLoading");
    const { data } = await axios({
      method: "GET",
      url: `${process.env.VUE_APP_URL}/lesson/get-group-lessons/${groupId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    commit("setGroupLessons", data.lessons);
    commit("stopLoading");
  },

  async getWebContent({ commit }: ActionContext<State, State>): Promise<void> {
    commit("startLoading");
    const { data } = await axios({
      method: "GET",
      url: `${process.env.VUE_APP_URL}/web-content/get-web-content/`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    commit("setWebContent", data[0]);
    commit("stopLoading");
  },

  async updateWebContent({ dispatch, commit }: ActionContext<State, State>, webContent: WebContent): Promise<void> {
    commit("startLoading");
    const collectionId = process.env.VUE_APP_WEB_COLLECTION_ID;
    const updated = await axios({
      method: "PUT",
      url: `${process.env.VUE_APP_URL}/web-content/update-web-content/${collectionId}`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
      data: webContent,
    });
    dispatch("getWebContent");
    commit("stopLoading");
  },

  async deleteWebPost({ commit }: ActionContext<State, State>, postId: string): Promise<void> {
    commit("startLoading");
    const collectionId = process.env.VUE_APP_WEB_COLLECTION_ID;
    await axios({
      method: "DELETE",
      url: `${process.env.VUE_APP_URL}/web-content/delete-post/${postId}`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
      data: { collectionId },
    });
    commit("deleteOnePostFromPosts", postId);
    commit("stopLoading");
  },

  async deleteWebCategory({ commit }: ActionContext<State, State>, categoryId: string): Promise<void> {
    commit("startLoading");
    const collectionId = process.env.VUE_APP_WEB_COLLECTION_ID;
    await axios({
      method: "DELETE",
      url: `${process.env.VUE_APP_URL}/web-content/delete-category/${categoryId}`,
      headers: { Authorization: `Bearer ${state.currentUser.token}` },
      data: { collectionId },
    });
    commit("deleteOneCategory", categoryId);
    commit("stopLoading");
  },
};

export default actions;
