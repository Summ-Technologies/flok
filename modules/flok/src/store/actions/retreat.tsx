import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {RetreatToTaskState} from "../../models/retreat"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {ApiAction, createApiAction} from "./api"

export const POST_NEW_RETREAT_REQUEST = "POST_NEW_RETREAT_REQUEST"
export const POST_NEW_RETREAT_SUCCESS = "POST_NEW_RETREAT_SUCCESS"
export const POST_NEW_RETREAT_FAILURE = "POST_NEW_RETREAT_FAILURE"

export function postNewRetreat(
  name: string,
  email: string,
  companyName: string,
  onSuccess: (guid: string) => void = () => undefined
) {
  let endpoint = "/v1.0/retreats"
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let apiResponse = (await dispatch(
      createApiAction({
        endpoint,
        method: "POST",
        types: [
          POST_NEW_RETREAT_REQUEST,
          POST_NEW_RETREAT_SUCCESS,
          POST_NEW_RETREAT_FAILURE,
        ],
        body: JSON.stringify({
          name,
          email,
          company_name: companyName,
        }),
      })
    )) as unknown as ApiAction
    if (!apiResponse.error) {
      let guid = apiResponse.payload.retreat?.guid
      if (guid) {
        onSuccess(guid)
      }
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

export const GET_RETREAT_BY_GUID_REQUEST = "GET_RETREAT_BY_GUID_REQUEST"
export const GET_RETREAT_BY_GUID_SUCCESS = "GET_RETREAT_BY_GUID_SUCCESS"
export const GET_RETREAT_BY_GUID_FAILURE = "GET_RETREAT_BY_GUID_FAILURE"

export function getRetreatByGuid(retreatGuid: string) {
  let endpoint = `/v1.0/retreats-by-guid/${retreatGuid}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_RETREAT_BY_GUID_REQUEST,
      {type: GET_RETREAT_BY_GUID_SUCCESS, meta: {retreatGuid}},
      {type: GET_RETREAT_BY_GUID_FAILURE, meta: {retreatGuid}},
    ],
  })
}

export const GET_RETREAT_REQUEST = "GET_RETREAT_REQUEST"
export const GET_RETREAT_SUCCESS = "GET_RETREAT_SUCCESS"
export const GET_RETREAT_FAILURE = "GET_RETREAT_FAILURE"

export function getRetreat(retreatId: number) {
  let endpoint = `/v1.0/retreats/${retreatId}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_RETREAT_REQUEST,
      {type: GET_RETREAT_SUCCESS, meta: {retreatId}},
      {type: GET_RETREAT_FAILURE, meta: {retreatId}},
    ],
  })
}

export const PUT_RETREAT_PREFERENCES_REQUEST = "PUT_RETREAT_PREFERENCES_REQUEST"
export const PUT_RETREAT_PREFERENCES_SUCCESS = "PUT_RETREAT_PREFERENCES_SUCCESS"
export const PUT_RETREAT_PREFERENCES_FAILURE = "PUT_RETREAT_PREFERENCES_FAILURE"

/** This is a special controller that updates retreat preferences by GUID */
export function updateRetreatPreferences(
  retreatId: number,
  isFlexDates: boolean,
  numAttendeesLower: number,
  numAttendeesUpper?: number,
  flexNumNights?: number,
  flexMonths: string[] = [],
  flexStartDow: string[] = [],
  exactStartDate?: Date,
  exactEndDate?: Date,
  onSuccess: () => void = () => undefined
) {
  let endpoint = `/v1.0/retreats/${retreatId}/preferences`
  let toDate = (dt?: Date) =>
    dt
      ? dt.toISOString().substring(0, dt.toISOString().indexOf("T"))
      : undefined

  return createApiAction(
    {
      endpoint,
      method: "PUT",
      types: [
        PUT_RETREAT_PREFERENCES_REQUEST,
        {type: PUT_RETREAT_PREFERENCES_SUCCESS, meta: {retreatId}},
        PUT_RETREAT_PREFERENCES_FAILURE,
      ],
      body: JSON.stringify({
        num_attendees_lower: numAttendeesLower,
        num_attendees_upper: numAttendeesUpper,
        is_flexible_dates: isFlexDates,
        flexible_num_nights: flexNumNights,
        flexible_months: flexMonths,
        flexible_start_dow: flexStartDow,
        exact_start_date: toDate(exactStartDate),
        exact_end_date: toDate(exactEndDate),
      }),
    },
    {onSuccess, errorMessage: "Something went wrong."}
  )
}

export const GET_RETREAT_ATTENDEES_REQUEST = "GET_RETREAT_ATTENDEES_REQUEST"
export const GET_RETREAT_ATTENDEES_SUCCESS = "GET_RETREAT_ATTENDEES_SUCCESS"
export const GET_RETREAT_ATTENDEES_FAILURE = "GET_RETREAT_ATTENDEES_FAILURE"

export function getRetreatAttendees(retreatId: number) {
  let endpoint = `/v1.0/retreats/${retreatId}/attendees`
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

export const POST_RETREAT_ATTENDEES_REQUEST = "POST_RETREAT_ATTENDEES_REQUEST"
export const POST_RETREAT_ATTENDEES_SUCCESS = "POST_RETREAT_ATTENDEES_SUCCESS"
export const POST_RETREAT_ATTENDEES_FAILURE = "POST_RETREAT_ATTENDEES_FAILURE"
export function postRetreatAttendees(
  retreatId: number,
  name: string,
  email_address: string
) {
  let endpoint = `/v1.0/retreats/${retreatId}/attendees`
  return createApiAction({
    method: "POST",
    endpoint,
    body: JSON.stringify({name, email_address}),
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
  let endpoint = `/v1.0/retreats/${retreatId}/attendees/${attendeeId}`
  return createApiAction({
    method: "DELETE",
    endpoint,
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

export const PUT_RETREAT_TASK_REQUEST = "POST_RETREAT_TASK_REQUEST"
export const PUT_RETREAT_TASK_SUCCESS = "POST_RETREAT_TASK_SUCCESS"
export const PUT_RETREAT_TASK_FAILURE = "POST_RETREAT_TASK_FAILURE"
export function putRetreatTask(
  task_id: number,
  retreatId: number,
  new_state: RetreatToTaskState
) {
  let endpoint = `/v1.0/retreats/${retreatId}/tasks/${task_id}`
  return createApiAction(
    {
      method: "PUT",
      endpoint,
      body: JSON.stringify({new_state}),
      types: [
        {
          type: PUT_RETREAT_TASK_REQUEST,
          meta: {retreatId},
        },
        {
          type: PUT_RETREAT_TASK_SUCCESS,
          meta: {retreatId},
        },
        {
          type: PUT_RETREAT_TASK_FAILURE,
          meta: {retreatId},
        },
      ],
    },
    {
      errorMessage: "Oops, something went wrong.",
      successMessage: new_state !== "COMPLETED" ? "Success!" : undefined,
    }
  )
}
