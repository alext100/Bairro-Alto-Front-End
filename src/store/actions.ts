import { State, UserLoggedIn, UserLoginData } from "@/types/interfaces";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { ActionContext } from "vuex";

const actions = {
  async login({ dispatch }: ActionContext<State, State>, userData: UserLoginData): Promise<void> {
    const response = await axios.post(process.env.VUE_APP_LOGIN_URL, userData);
    const { token } = response.data;
    const user = jwtDecode(token);
    dispatch("userLogedFromApi", { user, token });
    localStorage.setItem("userData", JSON.stringify({ token }));
  },

  async userLogedFromApi({ commit }: ActionContext<State, State>, { user, token }: UserLoggedIn): Promise<void> {
    const { data } = await axios({
      method: "GET",
      url: `${process.env.VUE_APP_URL}/user/get-one-by-id/${user.id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    data.token = token;
    localStorage.setItem(
      "userData",
      JSON.stringify({
        username: data.username,
        password: data.password,
        token: data.token,
        firstname: data.firstname,
        adminAccess: data.adminAccess,
        professorAccess: data.professorAccess,
        studentAccess: data.studentAccess,
        groups: data.groups,
        studentErrors: data.studentErrors,
      })
    );
    commit("loginUser", data);
    commit("loadUser", data);
    if (data.adminAccess === true) {
      commit("userIsAdmin");
    } else if (data.teacherAccess) {
      commit("userIsTeacher");
    } else if (data.studentAccess) {
      commit("userIsStudent");
    }
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
};

export default actions;
