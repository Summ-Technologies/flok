import {Action} from "redux"
import {
  POST_LODGING_REQUEST_FORM_FAILURE,
  POST_LODGING_REQUEST_FORM_REQUEST,
  POST_LODGING_REQUEST_FORM_SUCCESS,
} from "../actions/lodging"

export type ApiRequestState = {
  loading: boolean
  loaded?: boolean
  error?: string
}

const initialRequestState = {
  loading: false,
}

export type ApiState = {
  postRfpForm: ApiRequestState
}

const initialState: ApiState = {
  postRfpForm: initialRequestState,
}

export default function userReducer(
  state: ApiState = initialState,
  action: Action
): ApiState {
  switch (action.type) {
    case POST_LODGING_REQUEST_FORM_REQUEST:
      return {
        ...state,
        postRfpForm: {
          loading: true,
        },
      }
    case POST_LODGING_REQUEST_FORM_SUCCESS:
    case POST_LODGING_REQUEST_FORM_FAILURE:
      return {
        ...state,
        postRfpForm: {
          loading: false,
        },
      }
    default:
      return state
  }
}
