import {createApiAction} from "./api"

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
      POST_SELECTED_RETREAT_DESTINATION_REQUEST,
      POST_SELECTED_RETREAT_DESTINATION_SUCCESS,
      POST_SELECTED_RETREAT_DESTINATION_FAILURE,
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
      DELETE_SELECTED_RETREAT_DESTINATION_REQUEST,
      DELETE_SELECTED_RETREAT_DESTINATION_SUCCESS,
      DELETE_SELECTED_RETREAT_DESTINATION_FAILURE,
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
      POST_SELECTED_RETREAT_HOTEL_REQUEST,
      POST_SELECTED_RETREAT_HOTEL_SUCCESS,
      POST_SELECTED_RETREAT_HOTEL_FAILURE,
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
      DELETE_SELECTED_RETREAT_HOTEL_REQUEST,
      DELETE_SELECTED_RETREAT_HOTEL_SUCCESS,
      DELETE_SELECTED_RETREAT_HOTEL_FAILURE,
    ],
  })
}
