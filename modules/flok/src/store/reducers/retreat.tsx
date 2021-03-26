import {Action} from "redux"
import {UserHomeResponse} from "../../models/api"
import {RetreatModel} from "../../models/retreat"
import {apiToModel} from "../../utils/apiUtils"
import {ApiAction} from "../actions/api"
import {
  GET_RETREAT_SUCCESS,
  POST_EMPLOYEE_LOCATION_V2_SUCCESS,
} from "../actions/retreat"
import {GET_USER_HOME_SUCCESS} from "../actions/user"

export type RetreatState = {
  retreats: {[key: number]: RetreatModel}
}

const initialState: RetreatState = {retreats: {}}

export default function userReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  var payload
  switch (action.type) {
    case GET_USER_HOME_SUCCESS:
    case POST_EMPLOYEE_LOCATION_V2_SUCCESS:
    case GET_RETREAT_SUCCESS:
      payload = (action as ApiAction).payload as UserHomeResponse
      return payload.retreat
        ? {
            ...state,
            retreats: {
              ...state.retreats,
              [payload.retreat.id]: apiToModel(payload.retreat),
            },
          }
        : {...state}
    default:
      return state
  }
}
