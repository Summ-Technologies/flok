import {Stripe} from "@stripe/stripe-js"
import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {RetreatEmployeeLocationSubmission} from "../../models/retreat"
import {modelToApi} from "../../utils/apiUtils"
import {ApiAction, ApiUtils, createApiAction} from "./api"

export const POST_EMPLOYEE_LOCATION_V2_REQUEST =
  "POST_EMPLOYEE_LOCATION_V2_REQUEST"
export const POST_EMPLOYEE_LOCATION_V2_SUCCESS =
  "POST_EMPLOYEE_LOCATION_V2_SUCCESS"
export const POST_EMPLOYEE_LOCATION_V2_FAILURE =
  "POST_EMPLOYEE_LOCATION_V2_FAILURE"

export function postEmployeeLocationV2(
  retreatId: number,
  locationDataSubmission: RetreatEmployeeLocationSubmission
) {
  let endpoint = `/v1.0/retreats/${retreatId}/employees-locations`
  let submission = {
    locationItems: locationDataSubmission.locationItems,
    extraInfo: locationDataSubmission.extraInfo,
  }
  let submissionBody = {
    submission,
  }
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(modelToApi(submissionBody)),
    types: [
      POST_EMPLOYEE_LOCATION_V2_REQUEST,
      POST_EMPLOYEE_LOCATION_V2_SUCCESS,
      POST_EMPLOYEE_LOCATION_V2_FAILURE,
    ],
  })
}

// User home
export const GET_RETREAT_REQUEST = "GET_RETREAT_REQUEST"
export const GET_RETREAT_SUCCESS = "GET_RETREAT_SUCCESS"
export const GET_RETREAT_FAILURE = "GET_RETREAT_FAILURE"

export function getUserHome(retreat_id: number) {
  let endpoint = `/v1.0/retreats/${retreat_id}`
  return createApiAction({
    endpoint,
    method: "GET",
    types: [GET_RETREAT_REQUEST, GET_RETREAT_SUCCESS, GET_RETREAT_FAILURE],
  })
}

// Post selected proposal
export const POST_SELECTED_PROPOSAL_REQUEST = "POST_SELECTED_PROPOSAL_REQUEST"
export const POST_SELECTED_PROPOSAL_SUCCESS = "POST_SELECTED_PROPOSAL_SUCCESS"
export const POST_SELECTED_PROPOSAL_FAILURE = "POST_SELECTED_PROPOSAL_FAILURE"

export function postSelectedProposal(retreatId: number, proposalId: number) {
  let endpoint = `/v1.0/retreats/${retreatId}/proposals/selected`
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(modelToApi({proposalId})),
    types: [
      ApiUtils.typeWithMeta(POST_SELECTED_PROPOSAL_REQUEST, {
        retreatId,
        proposalId,
      }),
      POST_SELECTED_PROPOSAL_SUCCESS,
      POST_SELECTED_PROPOSAL_FAILURE,
    ],
  })
}

// Delete selected proposal
export const DELETE_SELECTED_PROPOSAL_REQUEST =
  "DELETE_SELECTED_PROPOSAL_REQUEST"
export const DELETE_SELECTED_PROPOSAL_SUCCESS =
  "DELETE_SELECTED_PROPOSAL_SUCCESS"
export const DELETE_SELECTED_PROPOSAL_FAILURE =
  "DELETE_SELECTED_PROPOSAL_FAILURE"

export function deleteSelectedProposal(retreatId: number) {
  let endpoint = `/v1.0/retreats/${retreatId}/proposals/selected`
  return createApiAction({
    endpoint,
    method: "DELETE",
    types: [
      ApiUtils.typeWithMeta(DELETE_SELECTED_PROPOSAL_REQUEST, {
        retreatId,
      }),
      DELETE_SELECTED_PROPOSAL_SUCCESS,
      DELETE_SELECTED_PROPOSAL_FAILURE,
    ],
  })
}

// PUT retreat filter details
export const PUT_RETREAT_DETAILS_REQUEST = "PUT_RETREAT_DETAILS_REQUEST"
export const PUT_RETREAT_DETAILS_SUCCESS = "PUT_RETREAT_DETAILS_SUCCESS"
export const PUT_RETREAT_DETAILS_FAILURE = "PUT_RETREAT_DETAILS_FAILURE"

export function putRetreatDetails(
  retreatId: number,
  numEmployees: number,
  numNights?: number
) {
  let endpoint = `/v1.0/retreats/${retreatId}/details`
  let body = {numEmployees, ...(numNights ? {numNights} : {})}
  return createApiAction({
    endpoint,
    method: "PUT",
    body: JSON.stringify(modelToApi(body)),
    types: [
      ApiUtils.typeWithMeta(PUT_RETREAT_DETAILS_REQUEST, {
        retreatId,
        ...body,
      }),
      PUT_RETREAT_DETAILS_SUCCESS,
      PUT_RETREAT_DETAILS_FAILURE,
    ],
  })
}

// PUT retreat filter details
export const POST_PROPOSAL_CHECKOUT_REQUEST = "POST_PROPOSAL_CHECKOUT_REQUEST"
export const POST_PROPOSAL_CHECKOUT_SUCCESS = "POST_PROPOSAL_CHECKOUT_SUCCESS"
export const POST_PROPOSAL_CHECKOUT_FAILURE = "POST_PROPOSAL_CHECKOUT_FAILURE"

export function postProposalCheckout(
  retreatId: number,
  proposalId: number,
  redirectUrl: string,
  stripe: Stripe
) {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let endpoint = `/v1.0/checkout/retreats`
    let body = {retreatId, proposalId, redirectUrl}
    let checkoutRequest = ((await dispatch(
      createApiAction({
        endpoint,
        method: "POST",
        body: JSON.stringify(modelToApi(body)),
        types: [
          POST_PROPOSAL_CHECKOUT_REQUEST,
          POST_PROPOSAL_CHECKOUT_SUCCESS,
          POST_PROPOSAL_CHECKOUT_FAILURE,
        ],
      })
    )) as unknown) as ApiAction
    if (!checkoutRequest.error) {
      stripe.redirectToCheckout({
        sessionId: (checkoutRequest.payload as {session_id: string}).session_id,
      })
    }
  }
}
