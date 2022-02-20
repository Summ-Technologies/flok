import querystring from "querystring"
import {RetreatDetailsFormType} from "../../components/retreats/RetreatInfoForm"
import {
  AdminLodgingProposalModel,
  AdminRetreatListType,
  AdminSelectedHotelStateTypes,
} from "../../models"
import {createApiAction} from "./api"

export const GET_RETREATS_LIST_REQUEST = "GET_RETREATS_LIST_REQUEST"
export const GET_RETREATS_LIST_SUCCESS = "GET_RETREATS_LIST_SUCCESS"
export const GET_RETREATS_LIST_FAILURE = "GET_RETREATS_LIST_FAILURE"

export function getRetreatsList(state: AdminRetreatListType) {
  let endpoint = "/v1.0/admin/retreats?" + querystring.stringify({state})
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      {type: GET_RETREATS_LIST_REQUEST, meta: {state}},
      {type: GET_RETREATS_LIST_SUCCESS, meta: {state}},
      {type: GET_RETREATS_LIST_FAILURE, meta: {state}},
    ],
  })
}

export const GET_RETREAT_DETAILS_REQUEST = "GET_RETREAT_DETAILS_REQUEST"
export const GET_RETREAT_DETAILS_SUCCESS = "GET_RETREAT_DETAILS_SUCCESS"
export const GET_RETREAT_DETAILS_FAILURE = "GET_RETREAT_DETAILS_FAILURE"

export function getRetreatDetails(id: number) {
  let endpoint = `/v1.0/admin/retreats/${id}`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      {type: GET_RETREAT_DETAILS_REQUEST, meta: {id}},
      {type: GET_RETREAT_DETAILS_SUCCESS, meta: {id}},
      {type: GET_RETREAT_DETAILS_FAILURE, meta: {id}},
    ],
  })
}

export const PUT_RETREAT_DETAILS_REQUEST = "PUT_RETREAT_DETAILS_REQUEST"
export const PUT_RETREAT_DETAILS_SUCCESS = "PUT_RETREAT_DETAILS_SUCCESS"
export const PUT_RETREAT_DETAILS_FAILURE = "PUT_RETREAT_DETAILS_FAILURE"

export function putRetreatDetails(
  id: number,
  retreatDetails: RetreatDetailsFormType
) {
  let endpoint = `/v1.0/admin/retreats/${id}`
  return createApiAction({
    endpoint,
    method: "PUT",
    body: JSON.stringify(retreatDetails, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      {type: PUT_RETREAT_DETAILS_REQUEST, meta: {id}},
      {type: PUT_RETREAT_DETAILS_SUCCESS, meta: {id}},
      {type: PUT_RETREAT_DETAILS_FAILURE, meta: {id}},
    ],
  })
}

export const GET_DESTINATIONS_REQUEST = "GET_DESTINATIONS_REQUEST"
export const GET_DESTINATIONS_SUCCESS = "GET_DESTINATIONS_SUCCESS"
export const GET_DESTINATIONS_FAILURE = "GET_DESTINATIONS_FAILURE"

export function getDestinations() {
  let endpoint = `/v1.0/admin/destinations`
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

export const GET_HOTELS_BY_DEST_REQUEST = "GET_HOTELS_BY_DEST_REQUEST"
export const GET_HOTELS_BY_DEST_SUCCESS = "GET_HOTELS_BY_DEST_SUCCESS"
export const GET_HOTELS_BY_DEST_FAILURE = "GET_HOTELS_BY_DEST_FAILURE"

export function getHotelsByDest(destinationId: number) {
  let endpoint =
    `/v1.0/admin/hotels?` +
    querystring.stringify({destination_ids: [destinationId]})
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      GET_HOTELS_BY_DEST_REQUEST,
      GET_HOTELS_BY_DEST_SUCCESS,
      GET_HOTELS_BY_DEST_FAILURE,
    ],
  })
}

export const GET_HOTELS_BY_ID_REQUEST = "GET_HOTELS_BY_ID_REQUEST"
export const GET_HOTELS_BY_ID_SUCCESS = "GET_HOTELS_BY_ID_SUCCESS"
export const GET_HOTELS_BY_ID_FAILURE = "GET_HOTELS_BY_ID_FAILURE"

export function getHotelsByHotelId(hotelIds: number[]) {
  let endpoint =
    `/v1.0/admin/hotels?` + querystring.stringify({hotel_ids: hotelIds})
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      GET_HOTELS_BY_ID_REQUEST,
      GET_HOTELS_BY_ID_SUCCESS,
      GET_HOTELS_BY_ID_FAILURE,
    ],
  })
}

export const POST_SELECTED_HOTEL_REQUEST = "POST_SELECTED_HOTEL_REQUEST"
export const POST_SELECTED_HOTEL_SUCCESS = "POST_SELECTED_HOTEL_SUCCESS"
export const POST_SELECTED_HOTEL_FAILURE = "POST_SELECTED_HOTEL_FAILURE"

/** "Selects" a hotel for a particular retreat. */
export function postSelectedHotel(retreatId: number, hotelId: number) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}`
  return createApiAction({
    endpoint,
    method: "POST",
    types: [
      POST_SELECTED_HOTEL_REQUEST,
      POST_SELECTED_HOTEL_SUCCESS,
      POST_SELECTED_HOTEL_FAILURE,
    ],
  })
}

export const PUT_SELECTED_HOTEL_REQUEST = "PUT_SELECTED_HOTEL_REQUEST"
export const PUT_SELECTED_HOTEL_SUCCESS = "PUT_SELECTED_HOTEL_SUCCESS"
export const PUT_SELECTED_HOTEL_FAILURE = "PUT_SELECTED_HOTEL_FAILURE"

/** Update the proposal state for given hotel and retreat. */
export function putSelectedHotel(
  retreatId: number,
  hotelId: number,
  newState: AdminSelectedHotelStateTypes
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}`
  return createApiAction({
    endpoint,
    method: "PUT",
    body: JSON.stringify({state: newState}),
    types: [
      PUT_SELECTED_HOTEL_REQUEST,
      PUT_SELECTED_HOTEL_SUCCESS,
      PUT_SELECTED_HOTEL_FAILURE,
    ],
  })
}

export const DELETE_SELECTED_HOTEL_REQUEST = "DELETE_SELECTED_HOTEL_REQUEST"
export const DELETE_SELECTED_HOTEL_SUCCESS = "DELETE_SELECTED_HOTEL_SUCCESS"
export const DELETE_SELECTED_HOTEL_FAILURE = "DELETE_SELECTED_HOTEL_FAILURE"

/** "Deselects" a hotel for the given retreat. */
export function deleteSelectedHotel(retreatId: number, hotelId: number) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}`
  return createApiAction({
    endpoint,
    method: "DELETE",
    types: [
      DELETE_SELECTED_HOTEL_REQUEST,
      DELETE_SELECTED_HOTEL_SUCCESS,
      DELETE_SELECTED_HOTEL_FAILURE,
    ],
  })
}

export const POST_HOTEL_PROPOSAL_REQUEST = "POST_HOTEL_PROPOSAL_REQUEST"
export const POST_HOTEL_PROPOSAL_SUCCESS = "POST_HOTEL_PROPOSAL_SUCCESS"
export const POST_HOTEL_PROPOSAL_FAILURE = "POST_HOTEL_PROPOSAL_FAILURE"

/** Adds hotel proposal. */
export function postHotelProposal(
  retreatId: number,
  hotelId: number,
  proposal: Omit<AdminLodgingProposalModel, "id" | "created_at">
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}/proposals`
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(proposal, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      POST_HOTEL_PROPOSAL_REQUEST,
      POST_HOTEL_PROPOSAL_SUCCESS,
      POST_HOTEL_PROPOSAL_FAILURE,
    ],
  })
}

export const PUT_HOTEL_PROPOSAL_REQUEST = "PUT_HOTEL_PROPOSAL_REQUEST"
export const PUT_HOTEL_PROPOSAL_SUCCESS = "PUT_HOTEL_PROPOSAL_SUCCESS"
export const PUT_HOTEL_PROPOSAL_FAILURE = "PUT_HOTEL_PROPOSAL_FAILURE"

/** Edits hotel proposal. */
export function putHotelProposal(
  retreatId: number,
  hotelId: number,
  proposalId: number,
  proposal: Omit<AdminLodgingProposalModel, "id" | "created_at">
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}/proposals/${proposalId}`
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(proposal, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      PUT_HOTEL_PROPOSAL_REQUEST,
      PUT_HOTEL_PROPOSAL_SUCCESS,
      PUT_HOTEL_PROPOSAL_FAILURE,
    ],
  })
}

export const DELETE_HOTEL_PROPOSAL_REQUEST = "DELETE_HOTEL_PROPOSAL_REQUEST"
export const DELETE_HOTEL_PROPOSAL_SUCCESS = "DELETE_HOTEL_PROPOSAL_SUCCESS"
export const DELETE_HOTEL_PROPOSAL_FAILURE = "DELETE_HOTEL_PROPOSAL_FAILURE"

/** Adds hotel proposal. */
export function deleteHotelProposal(
  retreatId: number,
  hotelId: number,
  proposalId: number
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}/proposals/${proposalId}`
  return createApiAction({
    endpoint,
    method: "DELETE",
    types: [
      DELETE_HOTEL_PROPOSAL_REQUEST,
      DELETE_HOTEL_PROPOSAL_SUCCESS,
      DELETE_HOTEL_PROPOSAL_FAILURE,
    ],
  })
}
