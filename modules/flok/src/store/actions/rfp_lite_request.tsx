import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
// import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
// import {apiNotification} from "../../notistack-lib/utils"
import {ApiAction, createApiAction} from "./api"

export const RFP_LITE_REQUEST_REQUEST =
  "RFP_LITE_REQUEST_REQUEST"
export const RFP_LITE_REQUEST_SUCCESS =
  "RFP_LITE_REQUEST_SUCCESS"
export const RFP_LITE_REQUEST_FAILURE =
  "RFP_LITE_REQUEST_FAILURE"

export function getRFPLiteRequest(rfp_lite_request_guid: string) {
  let endpoint = `/v1.0/lodging/rfp-lite-requests/${rfp_lite_request_guid}`
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
    ) => {
      let rfpLiteRequestResponse = (await dispatch(
        createApiAction({
          endpoint,
          method: "GET",
          types: [
            RFP_LITE_REQUEST_REQUEST,
            RFP_LITE_REQUEST_SUCCESS,
            RFP_LITE_REQUEST_FAILURE,
          ],
        })
      )) as unknown as ApiAction
      if (!rfpLiteRequestResponse.error) {
        console.log('error')
      }
      return rfpLiteRequestResponse
    }
  }
