import {Action} from "redux"
import {RetreatResponse} from "../../models/api"
import {RetreatModel} from "../../models/retreat"
import {apiToModel} from "../../utils/apiUtils"
import {ApiAction} from "../actions/api"
import {
  DELETE_SELECTED_PROPOSAL_REQUEST,
  GET_RETREAT_SUCCESS,
  POST_EMPLOYEE_LOCATION_V2_SUCCESS,
  POST_SELECTED_PROPOSAL_REQUEST,
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
  var meta
  switch (action.type) {
    case GET_USER_HOME_SUCCESS:
    case POST_EMPLOYEE_LOCATION_V2_SUCCESS:
    case GET_RETREAT_SUCCESS:
      payload = apiToModel((action as ApiAction).payload) as RetreatResponse
      return payload.retreat
        ? {
            ...state,
            retreats: {
              ...state.retreats,
              [payload.retreat.id]: payload.retreat,
            },
          }
        : {...state}
    case POST_SELECTED_PROPOSAL_REQUEST:
      meta = ((action as unknown) as {
        meta: {retreatId: number; proposalId: number}
      }).meta
      return {
        ...state,
        retreats: {
          ...state.retreats,
          [meta.retreatId]: {
            ...state.retreats[meta.retreatId],
            selectedProposalId: meta.proposalId,
          },
        },
      }
    case DELETE_SELECTED_PROPOSAL_REQUEST:
      meta = ((action as unknown) as {
        meta: {retreatId: number}
      }).meta
      return {
        ...state,
        retreats: {
          ...state.retreats,
          [meta.retreatId]: {
            ...state.retreats[meta.retreatId],
            selectedProposalId: undefined,
          },
        },
      }
    default:
      return state
  }
}
