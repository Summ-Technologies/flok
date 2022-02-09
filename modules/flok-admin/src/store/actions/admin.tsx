import querystring from "querystring"
import {AdminRetreatListType} from "../../models"
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
