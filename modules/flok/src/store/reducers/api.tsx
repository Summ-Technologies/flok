import {Action} from "redux"
import {ApiAction} from "../actions/api"
import {
  GET_USER_RESET_FAILURE,
  POST_USER_SIGNIN_FAILURE,
  POST_USER_SIGNUP_FAILURE,
} from "../actions/user"

export type RequestState = {
  success: boolean
  loading: boolean
  error: boolean
  errorText: string
}

export type ApiState = {
  auth: {
    signup?: RequestState
    signin?: RequestState
    resetTokens: {
      [key: string]: RequestState
    }
  }
  user: {
    home?: RequestState
  }
}

const initialState: ApiState = {
  auth: {
    resetTokens: {},
  },
  user: {},
}

export default function userReducer(
  state: ApiState = initialState,
  action: Action
): ApiState {
  var payload
  var errorText
  var loginToken
  switch (action.type) {
    case POST_USER_SIGNIN_FAILURE:
      payload = (action as ApiAction).payload
      errorText = payload.response.message
        ? payload.response.message
        : "There was an issue signing in"
      return {
        ...state,
        auth: {
          ...state.auth,
          signin: {
            success: false,
            loading: false,
            error: true,
            errorText,
          },
        },
      }
    case POST_USER_SIGNUP_FAILURE:
      payload = (action as ApiAction).payload
      errorText = payload.response.message
        ? payload.response.message
        : "There was an issue signing up"
      return {
        ...state,
        auth: {
          ...state.auth,
          signup: {
            success: false,
            loading: false,
            error: true,
            errorText,
          },
        },
      }
    case GET_USER_RESET_FAILURE:
      loginToken = ((action as unknown) as {meta: {loginToken: string}}).meta
        .loginToken
      payload = (action as ApiAction).payload
      errorText = payload.response.message
        ? payload.response.message
        : "There was an issue with the login_token"
      return {
        ...state,
        auth: {
          ...state.auth,
          resetTokens: {
            ...state.auth.resetTokens,
            [loginToken]: {
              success: false,
              loading: false,
              error: true,
              errorText,
            },
          },
        },
      }
    default:
      return state
  }
}
