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
  DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
  DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
  GET_RETREAT_ATTENDEES_SUCCESS,
  GET_RETREAT_FAILURE,
  GET_RETREAT_FILTERS_SUCCESS,
  GET_RETREAT_SUCCESS,
  POST_ADVANCE_RETREAT_STATE_SUCCESS,
  POST_SELECTED_RETREAT_DESTINATION_FAILURE,
  POST_SELECTED_RETREAT_DESTINATION_REQUEST,
  POST_SELECTED_RETREAT_HOTEL_FAILURE,
  POST_SELECTED_RETREAT_HOTEL_REQUEST,
  PUT_RETREAT_FILTERS_SUCCESS,
  PUT_RETREAT_PREFERENCES_SUCCESS,
} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [guid: string]: RetreatModel | ResourceNotFoundType
  }
  retreatFilterQuestions: {[guid: string]: FilterQuestionModel[] | undefined}
  retreatFilterResponses: {[guid: string]: FilterResponseModel[] | undefined}
  retreatAttendees: {[guid: string]: RetreatAttendeeModel[] | undefined}
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
  var retreatGuid: string, hotelId: number, destinationId: number, retreat
  var newState: RetreatState
  switch (action.type) {
    case GET_RETREAT_SUCCESS:
    case POST_ADVANCE_RETREAT_STATE_SUCCESS:
    case PUT_RETREAT_PREFERENCES_SUCCESS:
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
    case GET_RETREAT_FILTERS_SUCCESS:
    case PUT_RETREAT_FILTERS_SUCCESS:
      meta = (action as unknown as {meta: {retreatGuid: string}}).meta
      payload = (action as ApiAction).payload as RetreatFiltersApiResponse
      let filterQuestions = payload.retreat_filter_questions
      let filterResponses = payload.retreat_filter_responses
      newState = {...state}
      if (filterQuestions) {
        newState = {
          ...newState,
          retreatFilterQuestions: {
            ...newState.retreatFilterQuestions,
            [meta.retreatGuid]: filterQuestions,
          },
        }
      }
      if (filterResponses) {
        newState = {
          ...newState,
          retreatFilterResponses: {
            ...state.retreatFilterResponses,
            [meta.retreatGuid]: filterResponses,
          },
        }
      }
      return newState
    case GET_RETREAT_ATTENDEES_SUCCESS:
      console.log("Nowhere")
      meta = (action as unknown as {meta: {guid: string}}).meta
      console.log(meta)
      payload = (action as ApiAction).payload as RetreatAttendeesApiResponse
      console.log(payload)
      if (payload.message.toLowerCase() !== "success") {
        return state
      }
      newState = {...state}
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
        console.log(attendees)
        newState.retreatAttendees = {
          ...newState.retreatAttendees,
          [meta.guid]: attendees,
        }
      }
      return newState
    default:
      return state
  }
}
