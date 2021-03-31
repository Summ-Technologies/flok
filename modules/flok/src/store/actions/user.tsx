import querystring from "querystring"
import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {modelToApi} from "../../utils/apiUtils"
import {ApiAction, ApiUtils, createApiAction} from "./api"

// Authentication
export const POST_USER_SIGNUP_REQUEST = "POST_USER_SIGNUP_REQUEST"
export const POST_USER_SIGNUP_SUCCESS = "POST_USER_SIGNUP_SUCCESS"
export const POST_USER_SIGNUP_FAILURE = "POST_USER_SIGNUP_FAILURE"

export function postUserSignup(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  let endpoint = "/v1.0/auth/signup"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let signupResponse = ((await dispatch(
      createApiAction({
        endpoint,
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          loginProvider: "FLOK",
        }),
        types: [
          POST_USER_SIGNUP_REQUEST,
          POST_USER_SIGNUP_SUCCESS,
          POST_USER_SIGNUP_FAILURE,
        ],
      })
    )) as unknown) as ApiAction
    if (!signupResponse.error) {
      dispatch(setUserLoggedIn())
    }
  }
}

export const POST_USER_SIGNIN_REQUEST = "POST_USER_SIGNIN_REQUEST"
export const POST_USER_SIGNIN_SUCCESS = "POST_USER_SIGNIN_SUCCESS"
export const POST_USER_SIGNIN_FAILURE = "POST_USER_SIGNIN_FAILURE"

export function postUserSignin(email: string, password: string) {
  let endpoint = "/v1.0/auth/signin"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let signupResponse = ((await dispatch(
      createApiAction({
        endpoint,
        method: "POST",
        body: JSON.stringify({email, password, loginProvider: "FLOK"}),
        types: [
          POST_USER_SIGNIN_REQUEST,
          POST_USER_SIGNIN_SUCCESS,
          POST_USER_SIGNIN_FAILURE,
        ],
      })
    )) as unknown) as ApiAction
    if (!signupResponse.error) {
      dispatch(setUserLoggedIn())
    }
  }
}

export const GET_USER_RESET_REQUEST = "GET_USER_RESET_REQUEST"
export const GET_USER_RESET_SUCCESS = "GET_USER_RESET_SUCCESS"
export const GET_USER_RESET_FAILURE = "GET_USER_RESET_FAILURE"

export function getUserResetToken(loginToken: string) {
  let endpoint = `/v1.0/auth/reset?${querystring.stringify(
    modelToApi({loginToken})
  )}`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      ApiUtils.typeWithMeta(GET_USER_RESET_REQUEST, {loginToken}),
      ApiUtils.typeWithMeta(GET_USER_RESET_SUCCESS, {loginToken}),
      ApiUtils.typeWithMeta(GET_USER_RESET_FAILURE, {loginToken}),
    ],
  })
}

export const POST_USER_RESET_REQUEST = "POST_USER_RESET_REQUEST"
export const POST_USER_RESET_SUCCESS = "POST_USER_RESET_SUCCESS"
export const POST_USER_RESET_FAILURE = "POST_USER_RESET_FAILURE"

export function postUserReset(loginToken: string, password: string) {
  let endpoint = "/v1.0/auth/reset"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let signupResponse = ((await dispatch(
      createApiAction({
        endpoint,
        body: JSON.stringify(modelToApi({loginToken, password})),
        method: "POST",
        types: [
          ApiUtils.typeWithMeta(POST_USER_RESET_REQUEST, {loginToken}),
          ApiUtils.typeWithMeta(POST_USER_RESET_SUCCESS, {loginToken}),
          ApiUtils.typeWithMeta(POST_USER_RESET_FAILURE, {loginToken}),
        ],
      })
    )) as unknown) as ApiAction
    if (!signupResponse.error) {
      dispatch(setUserLoggedIn())
    }
  }
}

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
