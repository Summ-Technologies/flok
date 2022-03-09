import {Action} from "redux"
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {RetreatAttendeesApiResponse} from "../../models/api"
import {RetreatAttendeeModel, RetreatModel} from "../../models/retreat"
import {ApiAction} from "../actions/api"
import {
  DELETE_RETREAT_ATTENDEES_SUCCESS,
  GET_RETREAT_ATTENDEES_SUCCESS,
  GET_RETREAT_BY_GUID_FAILURE,
  GET_RETREAT_BY_GUID_SUCCESS,
  GET_RETREAT_FAILURE,
  GET_RETREAT_SUCCESS,
  POST_RETREAT_ATTENDEES_SUCCESS,
  PUT_RETREAT_PREFERENCES_SUCCESS,
  PUT_RETREAT_TASK_SUCCESS,
} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [id: number]: RetreatModel | ResourceNotFoundType
  }
  retreatsByGuid: {
    [guid: string]: RetreatModel | ResourceNotFoundType
  }
  retreatAttendees: {[id: number]: RetreatAttendeeModel[] | undefined}
}

const initialState: RetreatState = {
  retreats: {},
  retreatsByGuid: {},
  retreatAttendees: {},
}

export default function retreatReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  var payload
  var newRetreatsState: {[guid: string]: RetreatModel | ResourceNotFoundType}
  var retreatId: number, retreat: RetreatModel
  switch (action.type) {
    case GET_RETREAT_BY_GUID_SUCCESS: // TODO, remove once dashboard release
    case GET_RETREAT_SUCCESS:
    case PUT_RETREAT_PREFERENCES_SUCCESS:
    case PUT_RETREAT_TASK_SUCCESS:
      retreat = ((action as ApiAction).payload as {retreat: RetreatModel})
        .retreat
      retreatId = retreat.id
      return {
        ...state,
        retreats: {...state.retreats, [retreatId]: retreat},
        retreatsByGuid: {...state.retreatsByGuid, [retreat.guid]: retreat}, // TODO, remove once dashboard release
      }
    case GET_RETREAT_FAILURE:
      // Probably should check for 404 here
      retreatId = (action as unknown as {meta: {retreatId: number}}).meta
        .retreatId
      newRetreatsState = {...state.retreats}
      newRetreatsState[retreatId] = ResourceNotFound
      return {...state, retreats: newRetreatsState}
    // TODO, remove once dashboard release
    case GET_RETREAT_BY_GUID_FAILURE:
      let retreatGuid = (action as unknown as {meta: {retreatGuid: string}})
        .meta.retreatGuid
      return {
        ...state,
        retreatsByGuid: {
          ...state.retreatsByGuid,
          [retreatGuid]: ResourceNotFound,
        },
      }
    case POST_RETREAT_ATTENDEES_SUCCESS:
    case DELETE_RETREAT_ATTENDEES_SUCCESS:
    case GET_RETREAT_ATTENDEES_SUCCESS:
      retreatId = (action as unknown as {meta: {retreatId: number}}).meta
        .retreatId
      payload = (action as ApiAction).payload as RetreatAttendeesApiResponse
      if (payload) {
        state.retreatAttendees = {
          ...state.retreatAttendees,
          [retreatId]: payload.attendees,
        }
      }
      return state
    default:
      return state
  }
}
