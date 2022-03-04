import querystring from "querystring"
import {
  AdminHotelDetailsModel,
  AdminLodgingProposalUpdateModel,
  AdminRetreatAttendeeModel,
  AdminRetreatAttendeeUpdateModel,
  AdminRetreatListType,
  AdminRetreatModel,
  AdminRetreatTravelModel,
  AdminRetreatTravelUpdateModel,
  AdminSelectedHotelStateTypes,
} from "../../models"
import {nullifyEmptyString} from "../../utils"
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

export function createRetreatDetailsForm(
  obj: Partial<AdminRetreatModel>
): Partial<AdminRetreatModel> {
  let keys = Object.keys(obj) as (keyof AdminRetreatModel)[]
  keys.forEach((key) => {
    if (obj[key] == null || obj[key] === "") {
      obj[key] = undefined
    }
  })
  return obj
}

export const PATCH_RETREAT_DETAILS_REQUEST = "PATCH_RETREAT_DETAILS_REQUEST"
export const PATCH_RETREAT_DETAILS_SUCCESS = "PATCH_RETREAT_DETAILS_SUCCESS"
export const PATCH_RETREAT_DETAILS_FAILURE = "PATCH_RETREAT_DETAILS_FAILURE"

export function patchRetreatDetails(
  id: number,
  retreatDetails: Partial<AdminRetreatModel>
) {
  let endpoint = `/v1.0/admin/retreats/${id}`
  return createApiAction({
    endpoint,
    method: "PATCH",
    body: JSON.stringify(retreatDetails, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      {type: PATCH_RETREAT_DETAILS_REQUEST, meta: {id}},
      {type: PATCH_RETREAT_DETAILS_SUCCESS, meta: {id}},
      {type: PATCH_RETREAT_DETAILS_FAILURE, meta: {id}},
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

export const GET_HOTEL_DETAILS_REQUEST = "GET_HOTEL_DETAILS_REQUEST"
export const GET_HOTEL_DETAILS_SUCCESS = "GET_HOTEL_DETAILS_SUCCESS"
export const GET_HOTEL_DETAILS_FAILURE = "GET_HOTEL_DETAILS_FAILURE"

export function getHotelDetails(hotelId: number) {
  let endpoint = `/v1.0/admin/hotels/${hotelId}`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [
      GET_HOTEL_DETAILS_REQUEST,
      GET_HOTEL_DETAILS_SUCCESS,
      GET_HOTEL_DETAILS_FAILURE,
    ],
  })
}

export const POST_HOTEL_REQUEST = "POST_HOTEL_REQUEST"
export const POST_HOTEL_SUCCESS = "POST_HOTEL_SUCCESS"
export const POST_HOTEL_FAILURE = "POST_HOTEL_FAILURE"

export function postHotel(hotel: Partial<AdminHotelDetailsModel>) {
  let endpoint = `/v1.0/admin/hotels`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [POST_HOTEL_REQUEST, POST_HOTEL_SUCCESS, POST_HOTEL_FAILURE],
  })
}

export const PATCH_HOTEL_REQUEST = "PATCH_HOTEL_REQUEST"
export const PATCH_HOTEL_SUCCESS = "PATCH_HOTEL_SUCCESS"
export const PATCH_HOTEL_FAILURE = "PATCH_HOTEL_FAILURE"

export function patchHotel(
  hotelId: number,
  hotel: Partial<AdminHotelDetailsModel>
) {
  let endpoint = `/v1.0/admin/hotels/${hotelId}`
  return createApiAction({
    endpoint,
    body: JSON.stringify(nullifyEmptyString(hotel)),
    method: "PATCH",
    types: [PATCH_HOTEL_REQUEST, PATCH_HOTEL_SUCCESS, PATCH_HOTEL_FAILURE],
  })
}

export const POST_HOTEL_TEMPLATE_PROPOSAL_REQUEST =
  "POST_HOTEL_TEMPLATE_PROPOSAL_REQUEST"
export const POST_HOTEL_TEMPLATE_PROPOSAL_SUCCESS =
  "POST_HOTEL_TEMPLATE_PROPOSAL_SUCCESS"
export const POST_HOTEL_TEMPLATE_PROPOSAL_FAILURE =
  "POST_HOTEL_TEMPLATE_PROPOSAL_FAILURE"

export function postHotelTemplateProposal(
  hotelId: number,
  proposal: AdminLodgingProposalUpdateModel
) {
  let endpoint = `/v1.0/admin/hotels/${hotelId}/proposal`
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(nullifyEmptyString(proposal)),
    types: [
      POST_HOTEL_TEMPLATE_PROPOSAL_REQUEST,
      POST_HOTEL_TEMPLATE_PROPOSAL_SUCCESS,
      POST_HOTEL_TEMPLATE_PROPOSAL_FAILURE,
    ],
  })
}

export const PUT_HOTEL_TEMPLATE_PROPOSAL_REQUEST =
  "PUT_HOTEL_TEMPLATE_PROPOSAL_REQUEST"
export const PUT_HOTEL_TEMPLATE_PROPOSAL_SUCCESS =
  "PUT_HOTEL_TEMPLATE_PROPOSAL_SUCCESS"
export const PUT_HOTEL_TEMPLATE_PROPOSAL_FAILURE =
  "PUT_HOTEL_TEMPLATE_PROPOSAL_FAILURE"

export function putHotelTemplateProposal(
  hotelId: number,
  proposal: AdminLodgingProposalUpdateModel
) {
  let endpoint = `/v1.0/admin/hotels/${hotelId}/proposal`
  return createApiAction({
    endpoint,
    method: "PUT",
    body: JSON.stringify(nullifyEmptyString(proposal)),
    types: [
      PUT_HOTEL_TEMPLATE_PROPOSAL_REQUEST,
      PUT_HOTEL_TEMPLATE_PROPOSAL_SUCCESS,
      PUT_HOTEL_TEMPLATE_PROPOSAL_FAILURE,
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

export const POST_RETREAT_HOTEL_PROPOSAL_REQUEST =
  "POST_RETREAT_HOTEL_PROPOSAL_REQUEST"
export const POST_RETREAT_HOTEL_PROPOSAL_SUCCESS =
  "POST_RETREAT_HOTEL_PROPOSAL_SUCCESS"
export const POST_RETREAT_HOTEL_PROPOSAL_FAILURE =
  "POST_RETREAT_HOTEL_PROPOSAL_FAILURE"

/** Adds hotel proposal. */
export function postHotelProposal(
  retreatId: number,
  hotelId: number,
  proposal: AdminLodgingProposalUpdateModel
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}/proposals`
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(proposal, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      POST_RETREAT_HOTEL_PROPOSAL_REQUEST,
      POST_RETREAT_HOTEL_PROPOSAL_SUCCESS,
      POST_RETREAT_HOTEL_PROPOSAL_FAILURE,
    ],
  })
}

export const PUT_RETREAT_HOTEL_PROPOSAL_REQUEST =
  "PUT_RETREAT_HOTEL_PROPOSAL_REQUEST"
export const PUT_RETREAT_HOTEL_PROPOSAL_SUCCESS =
  "PUT_RETREAT_HOTEL_PROPOSAL_SUCCESS"
export const PUT_RETREAT_HOTEL_PROPOSAL_FAILURE =
  "PUT_RETREAT_HOTEL_PROPOSAL_FAILURE"

/** Edits hotel proposal. */
export function putRetreatHotelProposal(
  retreatId: number,
  hotelId: number,
  proposalId: number,
  proposal: AdminLodgingProposalUpdateModel
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}/proposals/${proposalId}`
  return createApiAction({
    endpoint,
    method: "PUT",
    body: JSON.stringify(proposal, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      PUT_RETREAT_HOTEL_PROPOSAL_REQUEST,
      PUT_RETREAT_HOTEL_PROPOSAL_SUCCESS,
      PUT_RETREAT_HOTEL_PROPOSAL_FAILURE,
    ],
  })
}

export const DELETE_RETREAT_HOTEL_PROPOSAL_REQUEST =
  "DELETE_RETREAT_HOTEL_PROPOSAL_REQUEST"
export const DELETE_RETREAT_HOTEL_PROPOSAL_SUCCESS =
  "DELETE_RETREAT_HOTEL_PROPOSAL_SUCCESS"
export const DELETE_RETREAT_HOTEL_PROPOSAL_FAILURE =
  "DELETE_RETREAT_HOTEL_PROPOSAL_FAILURE"

/** Adds hotel proposal. */
export function deleteRetreatHotelProposal(
  retreatId: number,
  hotelId: number,
  proposalId: number
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/hotels/${hotelId}/proposals/${proposalId}`
  return createApiAction({
    endpoint,
    method: "DELETE",
    types: [
      DELETE_RETREAT_HOTEL_PROPOSAL_REQUEST,
      DELETE_RETREAT_HOTEL_PROPOSAL_SUCCESS,
      DELETE_RETREAT_HOTEL_PROPOSAL_FAILURE,
    ],
  })
}

export const GET_RETREAT_ATTENDEES_REQUEST = "GET_RETREAT_ATTENDEES_REQUEST"
export const GET_RETREAT_ATTENDEES_SUCCESS = "GET_RETREAT_ATTENDEES_SUCCESS"
export const GET_RETREAT_ATTENDEES_FAILURE = "GET_RETREAT_ATTENDEES_FAILURE"
export function getRetreatAttendees(retreatId: number) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/attendees`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      {type: GET_RETREAT_ATTENDEES_REQUEST},
      {type: GET_RETREAT_ATTENDEES_SUCCESS, meta: {retreatId}},
      {type: GET_RETREAT_ATTENDEES_FAILURE, meta: {retreatId}},
    ],
  })
}

function travelToForm(
  travel: AdminRetreatTravelModel
): AdminRetreatTravelUpdateModel {
  console.log(travel.arr_trip)
  return {
    id: travel.id,
    cost: travel.cost,
    status: travel.status,
    dep_trip: travel.dep_trip ?? {
      id: -1,
      cost: 0,
      confirmation_number: "",
      trip_legs: [],
      duration: 0,
    },
    arr_trip: travel.arr_trip ?? {
      id: -1,
      cost: 0,
      confirmation_number: "",
      trip_legs: [],
      duration: 0,
    },
  }
}

export function attendeeToForm(
  attendee: AdminRetreatAttendeeModel
): AdminRetreatAttendeeUpdateModel {
  return {
    ...attendee,
    travel: travelToForm(
      attendee.travel ?? {
        id: -1,
        cost: 0,
        status: "PENDING",
        dep_trip: {
          id: -1,
          cost: 0,
          confirmation_number: "",
          trip_legs: [],
          duration: 0,
        },
        arr_trip: {
          id: -1,
          cost: 0,
          confirmation_number: "",
          trip_legs: [],
          duration: 0,
        },
      }
    ),
  }
}

function formToTravel(
  formVals: AdminRetreatTravelUpdateModel,
  travelPresent: boolean,
  arrTrip: boolean,
  depTrip: boolean
): AdminRetreatTravelModel | undefined {
  if (!travelPresent) return undefined

  let travel = formVals as AdminRetreatTravelModel
  if (!arrTrip) delete travel.arr_trip
  if (!depTrip) delete travel.dep_trip

  return travel
}

export function formToAttendee(
  id: number,
  formVals: AdminRetreatAttendeeUpdateModel,
  travelPresent: boolean,
  arrTripPresent: boolean,
  depTripPresent: boolean
): AdminRetreatAttendeeModel {
  let ret = {
    id: id,
    ...formVals,
    notes: formVals.notes ?? "",
    dietary_prefs: formVals.dietary_prefs ?? "",
    city: formVals.city ?? "",
    name: formVals.name ?? "",
    travel: formToTravel(
      formVals.travel,
      travelPresent,
      arrTripPresent,
      depTripPresent
    ),
  }

  if (ret.travel === undefined) delete ret.travel
  return ret
}

export const PUT_RETREAT_ATTENDEES_REQUEST = "PUT_RETREAT_ATTENDEES_REQUEST"
export const PUT_RETREAT_ATTENDEES_SUCCESS = "PUT_RETREAT_ATTENDEES_SUCCESS"
export const PUT_RETREAT_ATTENDEES_FAILURE = "PUT_RETREAT_ATTENDEES_FAILURE"
export function putRetreatAttendees(
  retreatId: number,
  attendee: AdminRetreatAttendeeModel
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/attendees`
  return createApiAction({
    method: "PUT",
    endpoint,
    body: JSON.stringify(attendee, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      {
        type: PUT_RETREAT_ATTENDEES_REQUEST,
      },
      {
        type: PUT_RETREAT_ATTENDEES_SUCCESS,
        meta: {retreatId},
      },
      {
        type: PUT_RETREAT_ATTENDEES_FAILURE,
        meta: {retreatId},
      },
    ],
  })
}

export const POST_RETREAT_ATTENDEES_REQUEST = "POST_RETREAT_ATTENDEES_REQUEST"
export const POST_RETREAT_ATTENDEES_SUCCESS = "POST_RETREAT_ATTENDEES_SUCCESS"
export const POST_RETREAT_ATTENDEES_FAILURE = "POST_RETREAT_ATTENDEES_FAILURE"
export function postRetreatAttendees(
  retreatId: number,
  attendee: Partial<AdminRetreatAttendeeModel>
) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/attendees`
  return createApiAction({
    method: "POST",
    endpoint,
    body: JSON.stringify(attendee, (key, value) =>
      typeof value === "undefined" ? null : value
    ),
    types: [
      {
        type: POST_RETREAT_ATTENDEES_REQUEST,
      },
      {
        type: POST_RETREAT_ATTENDEES_SUCCESS,
        meta: {retreatId},
      },
      {
        type: POST_RETREAT_ATTENDEES_FAILURE,
        meta: {retreatId},
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
export function deleteRetreatAttendees(retreatId: number, attendeeId: number) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/attendees`
  return createApiAction({
    method: "DELETE",
    endpoint,
    body: JSON.stringify({attendee_id: attendeeId}),
    types: [
      {
        type: DELETE_RETREAT_ATTENDEES_REQUEST,
      },
      {
        type: DELETE_RETREAT_ATTENDEES_SUCCESS,
        meta: {retreatId},
      },
      {
        type: DELETE_RETREAT_ATTENDEES_FAILURE,
        meta: {retreatId},
      },
    ],
  })
}

export const GET_RETREAT_NOTES_REQUEST = "GET_RETREAT_NOTES_REQUEST"
export const GET_RETREAT_NOTES_SUCCESS = "GET_RETREAT_NOTES_SUCCESS"
export const GET_RETREAT_NOTES_FAILURE = "GET_RETREAT_NOTES_FAILURE"
export function getRetreatNotes(retreatId: number) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/notes`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_RETREAT_NOTES_REQUEST,
      {type: GET_RETREAT_NOTES_SUCCESS, meta: {retreatId}},
      {type: GET_RETREAT_NOTES_FAILURE, meta: {retreatId}},
    ],
  })
}

export const POST_RETREAT_NOTES_REQUEST = "POST_RETREAT_NOTES_REQUEST"
export const POST_RETREAT_NOTES_SUCCESS = "POST_RETREAT_NOTES_SUCCESS"
export const POST_RETREAT_NOTES_FAILURE = "POST_RETREAT_NOTES_FAILURE"
export function postRetreatNotes(retreatId: number, note: string) {
  let endpoint = `/v1.0/admin/retreats/${retreatId}/notes`
  return createApiAction({
    method: "POST",
    endpoint,
    body: JSON.stringify({note}),
    types: [
      POST_RETREAT_NOTES_REQUEST,
      {type: POST_RETREAT_NOTES_SUCCESS, meta: {retreatId}},
      {type: POST_RETREAT_NOTES_FAILURE, meta: {retreatId}},
    ],
  })
}
