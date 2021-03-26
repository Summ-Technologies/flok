import {RetreatEmployeeLocationSubmission} from "../../models/retreat"
import {modelToApi} from "../../utils/apiUtils"
import {createApiAction} from "./api"

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
