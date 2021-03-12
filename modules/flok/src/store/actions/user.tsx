import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {ApiAction, createApiAction} from "./api"

// Authentication
export const SET_USER_LOGGED_IN = "SET_USER_LOGGED_IN"
export const SET_USER_LOGGED_OUT = "SET_USER_LOGGED_OUT"

export function setUserLoggedIn() {
  return {type: SET_USER_LOGGED_IN}
}
export function setUserLoggedOut() {
  return {type: SET_USER_LOGGED_OUT}
}

// User home
export const GET_USER_HOME_REQUEST = "GET_USER_HOME_REQUEST"
export const GET_USER_HOME_SUCCESS = "GET_USER_HOME_SUCCESS"
export const GET_USER_HOME_FAILURE = "GET_USER_HOME_FAILURE"

export function getUserHome() {
  let endpoint = "/v1.0/user/home"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let userResponse = ((await dispatch(
      createApiAction({
        endpoint,
        method: "GET",
        types: [
          GET_USER_HOME_REQUEST,
          GET_USER_HOME_SUCCESS,
          GET_USER_HOME_FAILURE,
        ],
      })
    )) as unknown) as ApiAction
    if (!userResponse.error) {
      if (getState().user.loginStatus !== "LOGGED_IN") {
        dispatch(setUserLoggedIn())
      }
      return userResponse
    }
  }
}
