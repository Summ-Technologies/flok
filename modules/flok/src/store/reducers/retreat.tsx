import {Action} from "redux"
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {
  AttendeeApiResponse,
  RetreatAttendeesApiResponse,
  TripApiResponse,
} from "../../models/api"
import {
  RetreatAttendeeModel,
  RetreatModel,
  RetreatTripModel,
} from "../../models/retreat"
import {ApiAction} from "../actions/api"
import {
  DELETE_RETREAT_ATTENDEES_SUCCESS,
  GET_ATTENDEE_SUCCESS,
  GET_RETREAT_ATTENDEES_SUCCESS,
  GET_RETREAT_BY_GUID_FAILURE,
  GET_RETREAT_BY_GUID_SUCCESS,
  GET_RETREAT_FAILURE,
  GET_RETREAT_SUCCESS,
  GET_TRIP_SUCCESS,
  INSTANTIATE_ATTENDEE_TRIPS_SUCCESS,
  PATCH_ATTENDEE_SUCCESS,
  PATCH_ATTENDEE_TRAVEL_SUCCESS,
  PATCH_TRIP_SUCCESS,
  POST_RETREAT_ATTENDEES_SUCCESS,
  PUT_RETREAT_PREFERENCES_SUCCESS,
  PUT_RETREAT_TASK_SUCCESS,
} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [id: number]: RetreatModel | ResourceNotFoundType
  }
  retreatsByGuid: {
    [guid: string]: RetreatModel | ResourceNotFoundType | undefined
  }
  retreatAttendees: {[id: number]: number[] | undefined}
  attendees: {
    [id: number]: RetreatAttendeeModel
  }
  trips: {
    [id: number]: RetreatTripModel
  }
}

const initialState: RetreatState = {
  retreats: {},
  retreatsByGuid: {},
  retreatAttendees: {},
  attendees: {},
  trips: {},
}

export default function retreatReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  var payload
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
      return {
        ...state,
        retreats: {...state.retreats, [retreatId]: ResourceNotFound},
      }
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
          [retreatId]: payload.attendees.map((attendee) => attendee.id),
        }
        state.attendees = payload.attendees.reduce(
          (last: any, curr: RetreatAttendeeModel) => {
            return {...last, [curr.id]: curr}
          },
          {}
        )
      }
      return state
    case GET_ATTENDEE_SUCCESS:
    case PATCH_ATTENDEE_SUCCESS:
    case PATCH_ATTENDEE_TRAVEL_SUCCESS:
      payload = (action as ApiAction).payload as AttendeeApiResponse
      if (payload) {
        state.attendees = {
          ...state.attendees,
          [payload.attendee.id]: payload.attendee,
        }
      }
      return state

    case PATCH_TRIP_SUCCESS:
    case GET_TRIP_SUCCESS:
      payload = (action as ApiAction).payload as TripApiResponse
      if (payload) {
        state.trips = {
          ...state.trips,
          [payload.trip.id]: payload.trip,
        }
      }
      return state
    case INSTANTIATE_ATTENDEE_TRIPS_SUCCESS:
      payload = (action as ApiAction).payload as AttendeeApiResponse
      if (payload) {
        state.attendees = {
          ...state.attendees,
          [payload.attendee.id]: payload.attendee,
        }
        if (
          payload &&
          payload.attendee.travel?.arr_trip?.id &&
          payload.attendee.travel?.dep_trip?.id
        ) {
          state.trips = {
            ...state.trips,
            [payload.attendee.travel.arr_trip.id]:
              payload.attendee.travel.arr_trip,
            [payload.attendee.travel.dep_trip.id]:
              payload.attendee.travel.dep_trip,
          }
        }
      }
      return state
    default:
      return state
  }
}
