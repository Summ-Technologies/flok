import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {ApiAction, createApiAction} from "./api"

// Authentication
export const POST_LODGING_REQUEST_FORM_REQUEST =
  "POST_LODGING_REQUEST_FORM_REQUEST"
export const POST_LODGING_REQUEST_FORM_SUCCESS =
  "POST_LODGING_REQUEST_FORM_SUCCESS"
export const POST_LODGING_REQUEST_FORM_FAILURE =
  "POST_LODGING_REQUEST_FORM_FAILURE"

export function postLodgingRequestForm(
  onSuccess: () => void,
  email: string,
  companyName: string,
  numberAttendeesUpper: number,
  numberAttendeesLower: number,
  flexibleDates: boolean,
  meetingSpaces: string[],
  occupancyTypes: string[],
  numberNights?: number,
  preferredMonths?: string[],
  preferredStartDow?: string[],
  startDate?: Date,
  endDate?: Date
) {
  let endpoint = "/v1.0/lodging/proposal-requests"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let toDate = (dt?: Date) =>
      dt
        ? dt.toISOString().substring(0, dt.toISOString().indexOf("T"))
        : undefined
    let response = (await dispatch(
      createApiAction({
        endpoint,
        method: "POST",
        body: JSON.stringify({
          email,
          companyName,
          numberAttendeesUpper,
          numberAttendeesLower,
          flexibleDates,
          numberNights,
          meetingSpaces,
          occupancyTypes,
          preferredMonths,
          preferredStartDow,
          startDate: toDate(startDate),
          endDate: toDate(endDate),
        }),
        types: [
          POST_LODGING_REQUEST_FORM_REQUEST,
          POST_LODGING_REQUEST_FORM_SUCCESS,
          POST_LODGING_REQUEST_FORM_FAILURE,
        ],
      })
    )) as unknown as ApiAction
    if (!response.error) {
      onSuccess()
      dispatch(
        enqueueSnackbar(
          apiNotification("Successfully submitted", (key) =>
            dispatch(closeSnackbar(key))
          )
        )
      )
    } else {
      dispatch(
        enqueueSnackbar(
          apiNotification(
            "An error occurred, try again.",
            (key) => dispatch(closeSnackbar(key)),
            true
          )
        )
      )
    }
  }
}
