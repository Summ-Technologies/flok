import {Action} from "redux"
import {RetreatModel} from "../../models/retreat"
import {ApiAction} from "../actions/api"
import {
  DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
  DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
  GET_RETREAT_FAILURE,
  GET_RETREAT_SUCCESS,
  POST_SELECTED_RETREAT_DESTINATION_FAILURE,
  POST_SELECTED_RETREAT_DESTINATION_REQUEST,
  POST_SELECTED_RETREAT_HOTEL_FAILURE,
  POST_SELECTED_RETREAT_HOTEL_REQUEST,
} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [guid: string]: RetreatModel | "NOT_FOUND"
  }
}

const initialState: RetreatState = {
  retreats: {},
}

export default function retreatReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  var payload
  var meta
  var newRetreatsState: {[guid: string]: RetreatModel | "NOT_FOUND"}
  var retreatGuid: string, hotelId: number, destinationId: number, retreat
  switch (action.type) {
    case GET_RETREAT_SUCCESS:
      payload = (action as ApiAction).payload as RetreatModel
      newRetreatsState = {...state.retreats}
      newRetreatsState[payload.guid] = payload
      return {...state, retreats: newRetreatsState}
    case GET_RETREAT_FAILURE:
      retreatGuid = (action as unknown as {meta: {guid: string}}).meta.guid
      newRetreatsState = {...state.retreats}
      newRetreatsState[retreatGuid] = "NOT_FOUND"
      return {...state, retreats: newRetreatsState}
    case POST_SELECTED_RETREAT_DESTINATION_REQUEST:
      meta = (
        action as unknown as {
          meta: {retreatGuid: string; destinationId: number}
        }
      ).meta
      retreatGuid = meta.retreatGuid
      destinationId = meta.destinationId
      retreat = state.retreats[retreatGuid]
      if (retreat && retreat !== "NOT_FOUND") {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatGuid]: {
              ...retreat,
              selected_destinations_ids: [
                ...retreat.selected_destinations_ids,
                destinationId,
              ],
            },
          },
        }
      }
      return state
    case POST_SELECTED_RETREAT_DESTINATION_FAILURE:
    case DELETE_SELECTED_RETREAT_DESTINATION_REQUEST:
      meta = (
        action as unknown as {
          meta: {retreatGuid: string; destinationId: number}
        }
      ).meta
      retreatGuid = meta.retreatGuid
      destinationId = meta.destinationId
      retreat = state.retreats[retreatGuid]
      if (retreat && retreat !== "NOT_FOUND") {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatGuid]: {
              ...retreat,
              selected_destinations_ids: [
                ...retreat.selected_destinations_ids.filter(
                  (id) => id !== destinationId
                ),
              ],
            },
          },
        }
      }
      return state
    case POST_SELECTED_RETREAT_HOTEL_REQUEST:
      meta = (
        action as unknown as {meta: {retreatGuid: string; hotelId: number}}
      ).meta
      retreatGuid = meta.retreatGuid
      hotelId = meta.hotelId
      retreat = state.retreats[retreatGuid]
      if (retreat && retreat !== "NOT_FOUND") {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatGuid]: {
              ...retreat,
              selected_hotels_ids: [...retreat.selected_hotels_ids, hotelId],
            },
          },
        }
      }
      return state
    case POST_SELECTED_RETREAT_HOTEL_FAILURE:
    case DELETE_SELECTED_RETREAT_HOTEL_REQUEST:
      meta = (
        action as unknown as {
          meta: {retreatGuid: string; hotelId: number}
        }
      ).meta
      retreatGuid = meta.retreatGuid
      hotelId = meta.hotelId
      retreat = state.retreats[retreatGuid]
      if (retreat && retreat !== "NOT_FOUND") {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatGuid]: {
              ...retreat,
              selected_hotels_ids: [
                ...retreat.selected_hotels_ids.filter((id) => id !== hotelId),
              ],
            },
          },
        }
      }
      return state
    default:
      return state
  }
}
