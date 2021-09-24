import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
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
    }
  }
}

export const GET_RETREAT_REQUEST = "GET_RETREAT_REQUEST"
export const GET_RETREAT_SUCCESS = "GET_RETREAT_SUCCESS"
export const GET_RETREAT_FAILURE = "GET_RETREAT_FAILURE"

export function getRetreat(guid: string) {
  let endpoint = `/v1.0/retreats/${guid}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_RETREAT_REQUEST,
      GET_RETREAT_SUCCESS,
      {type: GET_RETREAT_FAILURE, meta: {guid}},
    ],
  })
}

export const PUT_RETREAT_PREFERENCES_REQUEST = "PUT_RETREAT_PREFERENCES_REQUEST"
export const PUT_RETREAT_PREFERENCES_SUCCESS = "PUT_RETREAT_PREFERENCES_SUCCESS"
export const PUT_RETREAT_PREFERENCES_FAILURE = "PUT_RETREAT_PREFERENCES_FAILURE"

export function updateRetreatPreferences(
  retreatGuid: string,
  numAttendeesLower: number,
  numAttendeesUpper: number,
  isFlexDates: boolean,
  flexNumNights?: number,
  flexMonths: string[] = [],
  flexStartDow: string[] = [],
  exactStartDate?: Date,
  exactEndDate?: Date,
  onSuccess: () => void = () => undefined
) {
  let endpoint = `/v1.0/retreats/${retreatGuid}/preferences`
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
          PUT_RETREAT_PREFERENCES_SUCCESS,
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
  retreatGuid: string,
  destinationId: number
) {
  let endpoint = `/v1.0/retreats/${retreatGuid}/destinations/${destinationId}`
  return createApiAction({
    method: "POST",
    endpoint,
    types: [
      {
        type: POST_SELECTED_RETREAT_DESTINATION_REQUEST,
        meta: {retreatGuid, destinationId},
      },
      POST_SELECTED_RETREAT_DESTINATION_SUCCESS,
      {
        type: POST_SELECTED_RETREAT_DESTINATION_FAILURE,
        meta: {retreatGuid, destinationId},
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
  retreatGuid: string,
  destinationId: number
) {
  let endpoint = `/v1.0/retreats/${retreatGuid}/destinations/${destinationId}`
  return createApiAction({
    method: "DELETE",
    endpoint,
    types: [
      {
        type: DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
        meta: {retreatGuid, destinationId},
      },
      DELETE_SELECTED_RETREAT_DESTINATION_SUCCESS,
      {
        type: DELETE_SELECTED_RETREAT_DESTINATION_FAILURE,
        meta: {retreatGuid, destinationId},
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

export function postSelectedRetreatHotel(retreatGuid: string, hotelId: number) {
  let endpoint = `/v1.0/retreats/${retreatGuid}/hotels/${hotelId}`
  return createApiAction({
    method: "POST",
    endpoint,
    types: [
      {type: POST_SELECTED_RETREAT_HOTEL_REQUEST, meta: {retreatGuid, hotelId}},
      POST_SELECTED_RETREAT_HOTEL_SUCCESS,
      {type: POST_SELECTED_RETREAT_HOTEL_FAILURE, meta: {retreatGuid, hotelId}},
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
  retreatGuid: string,
  hotelId: number
) {
  let endpoint = `/v1.0/retreats/${retreatGuid}/hotels/${hotelId}`
  return createApiAction({
    method: "DELETE",
    endpoint,
    types: [
      {
        type: DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
        meta: {retreatGuid, hotelId},
      },
      DELETE_SELECTED_RETREAT_HOTEL_SUCCESS,
      {
        type: DELETE_SELECTED_RETREAT_HOTEL_FAILURE,
        meta: {retreatGuid, hotelId},
      },
    ],
  })
}
