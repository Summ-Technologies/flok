import {Action} from "redux"
import {
  POST_NEW_RETREAT_FAILURE,
  POST_NEW_RETREAT_REQUEST,
  POST_NEW_RETREAT_SUCCESS,
} from "../actions/retreat"

export type ApiState = {
  newRetreatFormLoading: boolean
  retreatPreferencesFormLoading: boolean

  getDestinationsLoading: boolean
  getDestinationLoading: {
    [guid: string]: boolean | undefined
  }
  getHotelsLoading: boolean
  getHotelLoading: {
    [guid: string]: boolean | undefined
  }
  getRetreatLoading: boolean
}

const initialState: ApiState = {
  newRetreatFormLoading: false,
  retreatPreferencesFormLoading: false,
  getDestinationsLoading: false,
  getDestinationLoading: {},
  getHotelsLoading: false,
  getHotelLoading: {},
  getRetreatLoading: false,
}

export default function userReducer(
  state: ApiState = initialState,
  action: Action
): ApiState {
  switch (action.type) {
    case POST_NEW_RETREAT_REQUEST:
      return {...state, newRetreatFormLoading: true}
    case POST_NEW_RETREAT_SUCCESS:
    case POST_NEW_RETREAT_FAILURE:
      return {...state, newRetreatFormLoading: false}
    default:
      return state
  }
}
