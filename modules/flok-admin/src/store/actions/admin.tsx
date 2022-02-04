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
