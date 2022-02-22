import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {RetreatProgressState, RetreatToTaskState} from "../../models/retreat"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {ApiAction, createApiAction} from "./api"

export const POST_NEW_RETREAT_REQUEST = "POST_NEW_RETREAT_REQUEST"
export const POST_NEW_RETREAT_SUCCESS = "POST_NEW_RETREAT_SUCCESS"
export const POST_NEW_RETREAT_FAILURE = "POST_NEW_RETREAT_FAILURE"

export function postNewRetreat(
  name: string,
  email: string,
  companyName: string,
  onSuccess: (guid: string) => void = () => undefined
) {
  let endpoint = "/v1.0/retreats"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let apiResponse = (await dispatch(
      createApiAction({
        endpoint,
        method: "POST",
        types: [
          POST_NEW_RETREAT_REQUEST,
          POST_NEW_RETREAT_SUCCESS,
          POST_NEW_RETREAT_FAILURE,
        ],
        body: JSON.stringify({
          name,
          email,
          company_name: companyName,
        }),
      })
    )) as unknown as ApiAction
    if (!apiResponse.error) {
      let guid = apiResponse.payload.retreat?.guid
      if (guid) {
        onSuccess(guid)
      }
    } else {
      dispatch(
        enqueueSnackbar(
          apiNotification(
            "An error occurred, try again.",
            (key) => dispatch(closeSnackbar(key)),
            true
          )
        )
      )
    }
  }
}

export const POST_ADVANCE_RETREAT_STATE_REQUEST =
  "POST_ADVANCE_RETREAT_STATE_REQUEST"
export const POST_ADVANCE_RETREAT_STATE_SUCCESS =
  "POST_ADVANCE_RETREAT_STATE_SUCCESS"
export const POST_ADVANCE_RETREAT_STATE_FAILURE =
  "POST_ADVANCE_RETREAT_STATE_FAILURE"

export function postAdvanceRetreatState(
  retreatIdx: number,
  currentState: RetreatProgressState
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/complete-state`
  return createApiAction({
    method: "POST",
    body: JSON.stringify({current_state: currentState}),
    endpoint,
    types: [
      POST_ADVANCE_RETREAT_STATE_REQUEST,
      {type: POST_ADVANCE_RETREAT_STATE_SUCCESS, meta: {retreatIdx}},
      POST_ADVANCE_RETREAT_STATE_FAILURE,
    ],
  })
}

export const GET_RETREAT_REQUEST = "GET_RETREAT_REQUEST"
export const GET_RETREAT_SUCCESS = "GET_RETREAT_SUCCESS"
export const GET_RETREAT_FAILURE = "GET_RETREAT_FAILURE"

export function getRetreat(retreatIdx: number) {
  let endpoint = `/v1.0/retreats/${retreatIdx}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_RETREAT_REQUEST,
      {type: GET_RETREAT_SUCCESS, meta: {retreatIdx}},
      {type: GET_RETREAT_FAILURE, meta: {retreatIdx}},
    ],
  })
}

export const PUT_RETREAT_PREFERENCES_REQUEST = "PUT_RETREAT_PREFERENCES_REQUEST"
export const PUT_RETREAT_PREFERENCES_SUCCESS = "PUT_RETREAT_PREFERENCES_SUCCESS"
export const PUT_RETREAT_PREFERENCES_FAILURE = "PUT_RETREAT_PREFERENCES_FAILURE"

export function updateRetreatPreferences(
  retreatIdx: number,
  isFlexDates: boolean,
  numAttendeesLower: number,
  numAttendeesUpper?: number,
  flexNumNights?: number,
  flexMonths: string[] = [],
  flexStartDow: string[] = [],
  exactStartDate?: Date,
  exactEndDate?: Date,
  onSuccess: () => void = () => undefined
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/preferences`
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let toDate = (dt?: Date) =>
      dt
        ? dt.toISOString().substring(0, dt.toISOString().indexOf("T"))
        : undefined
    let apiResponse = (await dispatch(
      createApiAction({
        endpoint,
        method: "PUT",
        types: [
          PUT_RETREAT_PREFERENCES_REQUEST,
          {type: PUT_RETREAT_PREFERENCES_SUCCESS, meta: {retreatIdx}},
          PUT_RETREAT_PREFERENCES_FAILURE,
        ],
        body: JSON.stringify({
          num_attendees_lower: numAttendeesLower,
          num_attendees_upper: numAttendeesUpper,
          is_flexible_dates: isFlexDates,
          flexible_num_nights: flexNumNights,
          flexible_months: flexMonths,
          flexible_start_dow: flexStartDow,
          exact_start_date: toDate(exactStartDate),
          exact_end_date: toDate(exactEndDate),
        }),
      })
    )) as unknown as ApiAction
    if (!apiResponse.error) {
      onSuccess()
    } else {
      dispatch(
        enqueueSnackbar(
          apiNotification(
            "An error occurred, try again.",
            (key) => dispatch(closeSnackbar(key)),
            true
          )
        )
      )
    }
  }
}

export const POST_SELECTED_RETREAT_DESTINATION_REQUEST =
  "POST_SELECTED_RETREAT_DESTINATION_REQUEST"
export const POST_SELECTED_RETREAT_DESTINATION_SUCCESS =
  "POST_SELECTED_RETREAT_DESTINATION_SUCCESS"
export const POST_SELECTED_RETREAT_DESTINATION_FAILURE =
  "POST_SELECTED_RETREAT_DESTINATION_FAILURE"

export function postSelectedRetreatDestination(
  retreatIdx: number,
  destinationId: number
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/destinations/${destinationId}`
  return createApiAction({
    method: "POST",
    endpoint,
    types: [
      {
        type: POST_SELECTED_RETREAT_DESTINATION_REQUEST,
        meta: {retreatIdx, destinationId},
      },
      POST_SELECTED_RETREAT_DESTINATION_SUCCESS,
      {
        type: POST_SELECTED_RETREAT_DESTINATION_FAILURE,
        meta: {retreatIdx, destinationId},
      },
    ],
  })
}

export const DELETE_SELECTED_RETREAT_DESTINATION_REQUEST =
  "DELETE_SELECTED_RETREAT_DESTINATION_REQUEST"
export const DELETE_SELECTED_RETREAT_DESTINATION_SUCCESS =
  "DELETE_SELECTED_RETREAT_DESTINATION_SUCCESS"
export const DELETE_SELECTED_RETREAT_DESTINATION_FAILURE =
  "DELETE_SELECTED_RETREAT_DESTINATION_FAILURE"

export function deleteSelectedRetreatDestination(
  retreatIdx: number,
  destinationId: number
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/destinations/${destinationId}`
  return createApiAction({
    method: "DELETE",
    endpoint,
    types: [
      {
        type: DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
        meta: {retreatIdx, destinationId},
      },
      DELETE_SELECTED_RETREAT_DESTINATION_SUCCESS,
      {
        type: DELETE_SELECTED_RETREAT_DESTINATION_FAILURE,
        meta: {retreatIdx, destinationId},
      },
    ],
  })
}

export const POST_SELECTED_RETREAT_HOTEL_REQUEST =
  "POST_SELECTED_RETREAT_HOTEL_REQUEST"
export const POST_SELECTED_RETREAT_HOTEL_SUCCESS =
  "POST_SELECTED_RETREAT_HOTEL_SUCCESS"
export const POST_SELECTED_RETREAT_HOTEL_FAILURE =
  "POST_SELECTED_RETREAT_HOTEL_FAILURE"

export function postSelectedRetreatHotel(retreatIdx: number, hotelId: number) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/hotels/${hotelId}`
  return createApiAction({
    method: "POST",
    endpoint,
    types: [
      {type: POST_SELECTED_RETREAT_HOTEL_REQUEST, meta: {retreatIdx, hotelId}},
      POST_SELECTED_RETREAT_HOTEL_SUCCESS,
      {type: POST_SELECTED_RETREAT_HOTEL_FAILURE, meta: {retreatIdx, hotelId}},
    ],
  })
}

export const DELETE_SELECTED_RETREAT_HOTEL_REQUEST =
  "DELETE_SELECTED_RETREAT_HOTEL_REQUEST"
export const DELETE_SELECTED_RETREAT_HOTEL_SUCCESS =
  "DELETE_SELECTED_RETREAT_HOTEL_SUCCESS"
export const DELETE_SELECTED_RETREAT_HOTEL_FAILURE =
  "DELETE_SELECTED_RETREAT_HOTEL_FAILURE"

export function deleteSelectedRetreatHotel(
  retreatIdx: number,
  hotelId: number
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/hotels/${hotelId}`
  return createApiAction({
    method: "DELETE",
    endpoint,
    types: [
      {
        type: DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
        meta: {retreatIdx, hotelId},
      },
      DELETE_SELECTED_RETREAT_HOTEL_SUCCESS,
      {
        type: DELETE_SELECTED_RETREAT_HOTEL_FAILURE,
        meta: {retreatIdx, hotelId},
      },
    ],
  })
}

export const GET_RETREAT_FILTERS_REQUEST = "GET_RETREAT_FILTERS_REQUEST"
export const GET_RETREAT_FILTERS_SUCCESS = "GET_RETREAT_FILTERS_SUCCESS"
export const GET_RETREAT_FILTERS_FAILURE = "GET_RETREAT_FILTERS_FAILURE"
export function getRetreatFilters(retreatIdx: number) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/filters`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      {
        type: GET_RETREAT_FILTERS_REQUEST,
        meta: {retreatIdx},
      },
      {
        type: GET_RETREAT_FILTERS_SUCCESS,
        meta: {retreatIdx},
      },
      {
        type: GET_RETREAT_FILTERS_FAILURE,
        meta: {retreatIdx},
      },
    ],
  })
}

export const PUT_RETREAT_FILTERS_REQUEST = "PUT_RETREAT_FILTERS_REQUEST"
export const PUT_RETREAT_FILTERS_SUCCESS = "PUT_RETREAT_FILTERS_SUCCESS"
export const PUT_RETREAT_FILTERS_FAILURE = "PUT_RETREAT_FILTERS_FAILURE"
export function putRetreatFilters(
  retreatIdx: number,
  selectedAnswerIds: number[]
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/filters`
  return createApiAction({
    method: "PUT",
    body: JSON.stringify({filter_responses_ids: selectedAnswerIds}),
    endpoint,
    types: [
      {
        type: PUT_RETREAT_FILTERS_REQUEST,
        meta: {retreatIdx},
      },
      {
        type: PUT_RETREAT_FILTERS_SUCCESS,
        meta: {retreatIdx},
      },
      {
        type: PUT_RETREAT_FILTERS_FAILURE,
        meta: {retreatIdx},
      },
    ],
  })
}

export const GET_RETREAT_ATTENDEES_REQUEST = "GET_RETREAT_ATTENDEES_REQUEST"
export const GET_RETREAT_ATTENDEES_SUCCESS = "GET_RETREAT_ATTENDEES_SUCCESS"
export const GET_RETREAT_ATTENDEES_FAILURE = "GET_RETREAT_ATTENDEES_FAILURE"

export function getRetreatAttendees(retreatIdx: number) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/attendees`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      {type: GET_RETREAT_ATTENDEES_REQUEST},
      {type: GET_RETREAT_ATTENDEES_SUCCESS, meta: {retreatIdx}},
      {type: GET_RETREAT_ATTENDEES_FAILURE, meta: {retreatIdx}},
    ],
  })
}

export const POST_RETREAT_ATTENDEES_REQUEST = "POST_RETREAT_ATTENDEES_REQUEST"
export const POST_RETREAT_ATTENDEES_SUCCESS = "POST_RETREAT_ATTENDEES_SUCCESS"
export const POST_RETREAT_ATTENDEES_FAILURE = "POST_RETREAT_ATTENDEES_FAILURE"
export function postRetreatAttendees(
  guid: string,
  name: string,
  email_address: string
) {
  let endpoint = `/v1.0/retreats/${guid}/attendees`
  return createApiAction({
    method: "POST",
    endpoint,
    body: JSON.stringify({name, email_address}),
    types: [
      {
        type: POST_RETREAT_ATTENDEES_REQUEST,
      },
      {
        type: POST_RETREAT_ATTENDEES_SUCCESS,
        meta: {guid},
      },
      {
        type: POST_RETREAT_ATTENDEES_FAILURE,
        meta: {guid},
      },
    ],
  })
}

export const DELETE_RETREAT_ATTENDEES_REQUEST =
  "DELETE_RETREAT_ATTENDEES_REQUEST"
export const DELETE_RETREAT_ATTENDEES_SUCCESS =
  "DELETE_RETREAT_ATTENDEES_SUCCESS"
export const DELETE_RETREAT_ATTENDEES_FAILURE =
  "DELETE_RETREAT_ATTENDEES_FAILURE"
export function deleteRetreatAttendees(guid: string, id: number) {
  let endpoint = `/v1.0/retreats/${guid}/attendees`
  return createApiAction({
    method: "DELETE",
    endpoint,
    body: JSON.stringify({id}),
    types: [
      {
        type: DELETE_RETREAT_ATTENDEES_REQUEST,
      },
      {
        type: DELETE_RETREAT_ATTENDEES_SUCCESS,
        meta: {guid},
      },
      {
        type: DELETE_RETREAT_ATTENDEES_FAILURE,
        meta: {guid},
      },
    ],
  })
}

export const PUT_RETREAT_TASK_REQUEST = "POST_RETREAT_TASK_REQUEST"
export const PUT_RETREAT_TASK_SUCCESS = "POST_RETREAT_TASK_SUCCESS"
export const PUT_RETREAT_TASK_FAILURE = "POST_RETREAT_TASK_FAILURE"
export function putRetreatTask(
  task_id: number,
  retreatIdx: number,
  new_state: RetreatToTaskState
) {
  let endpoint = `/v1.0/retreats/${retreatIdx}/tasks`
  return createApiAction({
    method: "PUT",
    endpoint,
    body: JSON.stringify({task_id, new_state}),
    types: [
      {
        type: PUT_RETREAT_TASK_REQUEST,
        meta: {retreatIdx},
      },
      {
        type: PUT_RETREAT_TASK_SUCCESS,
        meta: {retreatIdx},
      },
      {
        type: PUT_RETREAT_TASK_FAILURE,
        meta: {retreatIdx},
      },
    ],
  })
}
