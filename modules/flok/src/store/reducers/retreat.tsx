import {Action} from "redux"
import {Constants} from "../../config"
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {
  RetreatAttendeesApiResponse,
  RetreatFiltersApiResponse,
} from "../../models/api"
import {
  FilterQuestionModel,
  FilterResponseModel,
  RetreatAttendeeModel,
  RetreatModel,
} from "../../models/retreat"
import {ApiAction} from "../actions/api"
import {
  DELETE_RETREAT_ATTENDEES_SUCCESS,
  DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
  DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
  GET_RETREAT_ATTENDEES_SUCCESS,
  GET_RETREAT_FAILURE,
  GET_RETREAT_FILTERS_SUCCESS,
  GET_RETREAT_SUCCESS,
  POST_ADVANCE_RETREAT_STATE_SUCCESS,
  POST_RETREAT_ATTENDEES_SUCCESS,
  POST_SELECTED_RETREAT_DESTINATION_FAILURE,
  POST_SELECTED_RETREAT_DESTINATION_REQUEST,
  POST_SELECTED_RETREAT_HOTEL_FAILURE,
  POST_SELECTED_RETREAT_HOTEL_REQUEST,
  PUT_RETREAT_FILTERS_SUCCESS,
  PUT_RETREAT_PREFERENCES_SUCCESS,
  PUT_RETREAT_TASK_SUCCESS,
} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [idx: number]: RetreatModel | ResourceNotFoundType
  }
  retreatFilterQuestions: {[idx: number]: FilterQuestionModel[] | undefined}
  retreatFilterResponses: {[idx: number]: FilterResponseModel[] | undefined}
  retreatAttendees: {[idx: number]: RetreatAttendeeModel[] | undefined}
}

const initialState: RetreatState = {
  retreats: {},
  retreatFilterQuestions: {},
  retreatFilterResponses: {},
  retreatAttendees: {},
}

export default function retreatReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  var payload
  var meta
  var newRetreatsState: {[guid: string]: RetreatModel | ResourceNotFoundType}
  var retreatIdx: number, hotelId: number, destinationId: number, retreat
  var newState: RetreatState
  switch (action.type) {
    case GET_RETREAT_SUCCESS:
    case POST_ADVANCE_RETREAT_STATE_SUCCESS:
    case PUT_RETREAT_PREFERENCES_SUCCESS:
    case PUT_RETREAT_TASK_SUCCESS:
      if (
        [
          PUT_RETREAT_PREFERENCES_SUCCESS,
          POST_ADVANCE_RETREAT_STATE_SUCCESS,
        ].includes(action.type)
      ) {
        payload = ((action as ApiAction).payload as {retreat: RetreatModel})
          .retreat
      } else {
        payload = (action as ApiAction).payload as RetreatModel
      }

      retreatIdx = (action as unknown as {meta: {retreatIdx: number}}).meta
        .retreatIdx

      newRetreatsState = {...state.retreats}
      newRetreatsState[retreatIdx] = payload
      if (
        localStorage.getItem(Constants.localStorageRetreatIdxKey) !==
        retreatIdx.toString()
      ) {
        localStorage.setItem(
          Constants.localStorageRetreatIdxKey,
          retreatIdx.toString()
        )
      }
      return {...state, retreats: newRetreatsState}
    case GET_RETREAT_FAILURE:
      retreatIdx = (action as unknown as {meta: {retreatIdx: number}}).meta
        .retreatIdx
      newRetreatsState = {...state.retreats}
      newRetreatsState[retreatIdx] = ResourceNotFound
      return {...state, retreats: newRetreatsState}
    case POST_SELECTED_RETREAT_DESTINATION_REQUEST:
      meta = (
        action as unknown as {
          meta: {retreatIdx: number; destinationId: number}
        }
      ).meta
      retreatIdx = meta.retreatIdx
      destinationId = meta.destinationId
      retreat = state.retreats[retreatIdx]
      if (retreat && retreat !== ResourceNotFound) {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatIdx]: {
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
          meta: {retreatIdx: number; destinationId: number}
        }
      ).meta
      retreatIdx = meta.retreatIdx
      destinationId = meta.destinationId
      retreat = state.retreats[retreatIdx]
      if (retreat && retreat !== ResourceNotFound) {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatIdx]: {
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
        action as unknown as {meta: {retreatIdx: number; hotelId: number}}
      ).meta
      retreatIdx = meta.retreatIdx
      hotelId = meta.hotelId
      retreat = state.retreats[retreatIdx]
      if (retreat && retreat !== ResourceNotFound) {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatIdx]: {
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
          meta: {retreatIdx: number; hotelId: number}
        }
      ).meta
      retreatIdx = meta.retreatIdx
      hotelId = meta.hotelId
      retreat = state.retreats[retreatIdx]
      if (retreat && retreat !== ResourceNotFound) {
        return {
          ...state,
          retreats: {
            ...state.retreats,
            [retreatIdx]: {
              ...retreat,
              selected_hotels_ids: [
                ...retreat.selected_hotels_ids.filter((id) => id !== hotelId),
              ],
            },
          },
        }
      }
      return state
    case GET_RETREAT_FILTERS_SUCCESS:
    case PUT_RETREAT_FILTERS_SUCCESS:
      meta = (action as unknown as {meta: {retreatIdx: number}}).meta
      payload = (action as ApiAction).payload as RetreatFiltersApiResponse
      let filterQuestions = payload.retreat_filter_questions
      let filterResponses = payload.retreat_filter_responses
      newState = {...state}
      if (filterQuestions) {
        newState = {
          ...newState,
          retreatFilterQuestions: {
            ...newState.retreatFilterQuestions,
            [meta.retreatIdx]: filterQuestions,
          },
        }
      }
      if (filterResponses) {
        newState = {
          ...newState,
          retreatFilterResponses: {
            ...state.retreatFilterResponses,
            [meta.retreatIdx]: filterResponses,
          },
        }
      }
      return newState
    case POST_RETREAT_ATTENDEES_SUCCESS:
    case DELETE_RETREAT_ATTENDEES_SUCCESS:
    case GET_RETREAT_ATTENDEES_SUCCESS:
      meta = (action as unknown as {meta: {retreatIdx: number}}).meta
      payload = (action as ApiAction).payload as RetreatAttendeesApiResponse
      if (payload.message.toLowerCase() !== "success") {
        return state
      }
      if (payload) {
        let attendees = payload.attendees.map((a) => {
          if (a.travel && a.travel.arr_trip) {
            a.travel.arr_trip.arr_datetime = new Date(
              a.travel.arr_trip.arr_datetime
            )
            a.travel.arr_trip.dep_datetime = new Date(
              a.travel.arr_trip.dep_datetime
            )
          }
          if (a.travel && a.travel.dep_trip) {
            a.travel.dep_trip.arr_datetime = new Date(
              a.travel.dep_trip.arr_datetime
            )
            a.travel.dep_trip.dep_datetime = new Date(
              a.travel.dep_trip.dep_datetime
            )
          }
          return a
        }) as RetreatAttendeeModel[]
        newState.retreatAttendees = {
          ...newState.retreatAttendees,
        }
      }
      return state
    default:
      return state
  }
}
