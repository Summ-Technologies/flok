import querystring from "querystring"
import {createApiAction} from "./api"

// destinations
export const GET_DESTINATIONS_REQUEST = "GET_DESTINATIONS_REQUEST"
export const GET_DESTINATIONS_SUCCESS = "GET_DESTINATIONS_SUCCESS"
export const GET_DESTINATIONS_FAILURE = "GET_DESTINATIONS_FAILURE"

export function getDestinations() {
  let endpoint = `/v1.0/destinations`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      GET_DESTINATIONS_REQUEST,
      GET_DESTINATIONS_SUCCESS,
      GET_DESTINATIONS_FAILURE,
    ],
  })
}

// destinations
export const GET_HOTELS_REQUEST = "GET_HOTELS_REQUEST"
export const GET_HOTELS_SUCCESS = "GET_HOTELS_SUCCESS"
export const GET_HOTELS_FAILURE = "GET_HOTELS_FAILURE"

export function getHotels(ids: number[]) {
  let endpoint = `/v1.0/hotels?${querystring.stringify({id: ids})}`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [GET_HOTELS_REQUEST, GET_HOTELS_SUCCESS, GET_HOTELS_FAILURE],
  })
}

export const GET_HOTEL_BY_GUID_REQUEST = "GET_HOTEL_BY_GUID_REQUEST"
export const GET_HOTEL_BY_GUID_SUCCESS = "GET_HOTEL_BY_GUID_SUCCESS"
export const GET_HOTEL_BY_GUID_FAILURE = "GET_HOTEL_BY_GUID_FAILURE"

export function getHotelByGuid(guid: string) {
  let endpoint = `/v1.0/hotels/${guid}`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      GET_HOTEL_BY_GUID_REQUEST,
      GET_HOTEL_BY_GUID_SUCCESS,
      {type: GET_HOTEL_BY_GUID_FAILURE, meta: {hotelGuid: guid}},
    ],
  })
}
