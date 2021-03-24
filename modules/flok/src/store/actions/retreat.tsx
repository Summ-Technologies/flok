import {RetreatEmployeeLocationSubmission} from "../../models/retreat"
import {modelToApi} from "../../utils/apiUtils"
import {createApiAction} from "./api"

// Authentication
export const POST_EMPLOYEE_LOCATION_REQUEST = "POST_EMPLOYEE_LOCATION_REQUEST"
export const POST_EMPLOYEE_LOCATION_SUCCESS = "POST_EMPLOYEE_LOCATION_SUCCESS"
export const POST_EMPLOYEE_LOCATION_FAILURE = "POST_EMPLOYEE_LOCATION_FAILURE"

export function postEmployeeLocation(
  retreatId: number,
  retreatItemId: number,
  locationDataSubmission: RetreatEmployeeLocationSubmission
) {
  let endpoint = `/v1.0/retreats/${retreatId}/${retreatItemId}`
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify(modelToApi(locationDataSubmission)),
    types: [
      POST_EMPLOYEE_LOCATION_REQUEST,
      POST_EMPLOYEE_LOCATION_SUCCESS,
      POST_EMPLOYEE_LOCATION_FAILURE,
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
