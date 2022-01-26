import { Group, State, UserLoggedIn, UserLoginData } from "@/types/interfaces";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { ActionContext } from "vuex";
import state from "./state";

const actions = {
  async login({ dispatch }: ActionContext<State, State>, userData: UserLoginData): Promise<void> {
    const response = await axios.post(process.env.VUE_APP_LOGIN_URL, userData);
    const { token } = response.data;
    const user = jwtDecode(token);
    dispatch("userLogedFromApi", { user, token });
    localStorage.setItem("userData", JSON.stringify({ token }));
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
        groups: data.groups,
        studentErrors: data.studentErrors,
        homeworkToCheck: data.homeworkToCheck,
      })
    );
    commit("loginUser", data);
    commit("loadUser", data);
    commit("stopLoading");
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
    commit("loadUserGroups", data.groups);
  },
};

export default actions;
