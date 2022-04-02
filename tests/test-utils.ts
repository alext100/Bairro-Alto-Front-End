import { ActionContext, Commit, Dispatch } from "vuex";
import { State } from "@/types/interfaces";
import mockedState from "./mockedState";

const configActionContext = (commit: Commit): ActionContext<State, State> => ({
  commit,
  dispatch: jest.fn(),
  getters: jest.fn(),
  rootState: {} as State,
  rootGetters: jest.fn(),
  state: mockedState,
});

const configActionContextDispatch = (dispatch: Dispatch): ActionContext<State, State> => ({
  commit: jest.fn(),
  dispatch,
  getters: jest.fn(),
  rootState: {} as State,
  rootGetters: jest.fn(),
  state: mockedState,
});

export { configActionContext, configActionContextDispatch };
