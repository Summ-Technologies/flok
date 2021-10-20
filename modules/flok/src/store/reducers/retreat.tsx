import {Action} from "redux"
import {Constants} from "../../config"
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {RetreatModel, RetreatPreferencesModel} from "../../models/retreat"
import {ApiAction} from "../actions/api"
import {
  DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
  DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
  GET_RETREAT_FAILURE,
  GET_RETREAT_SUCCESS,
  POST_ADVANCE_RETREAT_STATE_SUCCESS,
  POST_SELECTED_RETREAT_DESTINATION_FAILURE,
  POST_SELECTED_RETREAT_DESTINATION_REQUEST,
  POST_SELECTED_RETREAT_HOTEL_FAILURE,
  POST_SELECTED_RETREAT_HOTEL_REQUEST,
  UPDATE_RETREAT_PREFERENCES,
} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [guid: string]: RetreatModel | ResourceNotFoundType
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
  var newRetreatsState: {[guid: string]: RetreatModel | ResourceNotFoundType}
  var retreatGuid: string, hotelId: number, destinationId: number, retreat
  switch (action.type) {
    case GET_RETREAT_SUCCESS:
    case POST_ADVANCE_RETREAT_STATE_SUCCESS:
      payload = (action as ApiAction).payload as RetreatModel
      newRetreatsState = {...state.retreats}
      newRetreatsState[payload.guid] = payload
      if (
        localStorage.getItem(Constants.localStorageRetreatGuidKey) !==
        payload.guid
      ) {
        localStorage.setItem(Constants.localStorageRetreatGuidKey, payload.guid)
      }
      return {...state, retreats: newRetreatsState}
    case GET_RETREAT_FAILURE:
      retreatGuid = (action as unknown as {meta: {guid: string}}).meta.guid
      newRetreatsState = {...state.retreats}
      newRetreatsState[retreatGuid] = ResourceNotFound
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
      if (retreat && retreat !== ResourceNotFound) {
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
      if (retreat && retreat !== ResourceNotFound) {
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
      if (retreat && retreat !== ResourceNotFound) {
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
      if (retreat && retreat !== ResourceNotFound) {
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
    case UPDATE_RETREAT_PREFERENCES:
      retreatGuid = (
        action as unknown as {
          retreatGuid: string
          retreatPreferences: RetreatPreferencesModel
        }
      ).retreatGuid
      let retreatPreferences = (
        action as unknown as {
          retreatGuid: string
          retreatPreferences: RetreatPreferencesModel
        }
      ).retreatPreferences
      retreat = state.retreats[retreatGuid]

      if (retreat && retreat !== ResourceNotFound) {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatGuid]: {
              ...retreat,
              retreat_preferences: retreatPreferences,
            },
          },
        }
      }
      return state

    default:
      return state
  }
}
