import {Action} from "redux"
import {ApiAction} from "../actions/api"
import {
  GET_USER_HOME_SUCCESS,
  SET_USER_LOGGED_IN,
  SET_USER_LOGGED_OUT,
} from "../actions/user"

export type UserState = {
  loginStatus: "UNKNOWN" | "LOGGED_IN" | "LOGGED_OUT"
  user?: {
    email: string
    id: number
    first_name?: string
    last_name?: string
  }
}

const initialState: UserState = {
  loginStatus: "UNKNOWN",
  user: undefined,
}

export default function userReducer(
  state: UserState = initialState,
  action: Action
): UserState {
  var payload
  switch (action.type) {
    case SET_USER_LOGGED_IN:
      return {...state, loginStatus: "LOGGED_IN"}
    case SET_USER_LOGGED_OUT:
      return {...state, loginStatus: "LOGGED_OUT"}
    case GET_USER_HOME_SUCCESS:
      payload = (action as ApiAction).payload
      return {...state, user: payload.user}
    default:
      return state
  }
}
