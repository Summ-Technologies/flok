import {Action} from "redux"
import {RfpLiteRequestResponse} from "../../models/api"
import {RfpLiteRequestModel} from "../../models/rfpLiteRequest"
import {ApiAction} from "../actions/api"
import {
  RFP_LITE_REQUEST_SUCCESS
} from "../actions/rfp_lite_request"

export type RfpLiteRequestState = {
  rfp_lite_request?: RfpLiteRequestModel
}

const initialState: RfpLiteRequestState = {
  rfp_lite_request: undefined
}

export default function rfpLiteRequestReducer(
  state: RfpLiteRequestState = initialState,
  action: Action
): RfpLiteRequestState {
  var payload
  switch (action.type) {
    case RFP_LITE_REQUEST_SUCCESS:
      payload = (action as ApiAction).payload as RfpLiteRequestResponse
      return {...state, rfp_lite_request: payload.request}
    default:
      return state
  }
}
