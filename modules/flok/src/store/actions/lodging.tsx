import {ThunkDispatch} from "redux-thunk"
import {RootState} from ".."
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {DestinationModel, HotelModel} from "../../models/lodging"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {AlgoliaClient} from "../../utils/algoliaUtils"
import {ApiAction, createApiAction} from "./api"

// destinations
export const GET_DESTINATIONS = "GET_DESTINATIONS"
export type GetDestinationsAction = {
  type: typeof GET_DESTINATIONS
  destinations: DestinationModel[]
}
export function getDestinations() {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let destinationsIndex = AlgoliaClient.getDestinationsIndex()
    try {
      let response = await destinationsIndex.search<DestinationModel>("", {
        hitsPerPage: 50,
      })
      if (response) {
        dispatch({
          type: GET_DESTINATIONS,
          destinations: response.hits,
        })
      }
    } catch (err) {
      // TODO err handling
    }
  }
}

// destinations
export const GET_HOTELS = "GET_HOTELS"
export type GetHotelsAction = {
  type: typeof GET_HOTELS
  hotels: HotelModel[]
  filterKey: string
  currPage: number
  hasMore: boolean
  numHits: number
}
export function getHotels(filter: string, page: number = 0) {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    let hotelsIndex = AlgoliaClient.getHotelsIndex()
    try {
      let response = await hotelsIndex.search<HotelModel>("", {
        filters: filter || undefined,
        page: page || undefined,
      })
      if (response) {
        dispatch({
          type: GET_HOTELS,
          hotels: response.hits,
          filterKey: filter,
          currPage: response.page,
          hasMore: response.page + 1 <= response.nbPages,
          numHits: response.nbHits,
        } as GetHotelsAction)
      }
    } catch (err) {
      // TODO err handling
    }
  }
}

export const GET_HOTEL_BY_GUID = "GET_HOTEL_BY_GUID"
export type GetHotelByGuidAction = {
  type: typeof GET_HOTEL_BY_GUID
  hotel: HotelModel | ResourceNotFoundType
  guid: string
}
function getHotelByGuid(
  guid: string,
  hotel: HotelModel | ResourceNotFoundType
): GetHotelByGuidAction {
  return {
    type: GET_HOTEL_BY_GUID,
    guid,
    hotel,
  }
}

export function getHotelById(guid: string) {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState
  ) => {
    try {
      let hotel = await AlgoliaClient.getHotelsIndex().getObject<HotelModel>(
        guid
      )
      dispatch(getHotelByGuid(guid, hotel))
    } catch (err) {
      dispatch(getHotelByGuid(guid, ResourceNotFound))
    }
  }
}

// lodging form
export const POST_LODGING_REQUEST_FORM_REQUEST =
  "POST_LODGING_REQUEST_FORM_REQUEST"
export const POST_LODGING_REQUEST_FORM_SUCCESS =
  "POST_LODGING_REQUEST_FORM_SUCCESS"
export const POST_LODGING_REQUEST_FORM_FAILURE =
  "POST_LODGING_REQUEST_FORM_FAILURE"

export function postLodgingRequestForm(
  onSuccess: (id: number) => void,
  email: string,
  companyName: string,
  numberAttendeesLower: number,
  flexibleDates: boolean,
  meetingSpaces: string[],
  occupancyTypes: string[],
  numberNights?: number,
  preferredMonths?: string[],
  preferredStartDow?: string[],
  startDate?: Date,
  endDate?: Date,
  budget?: string[]
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
          numberAttendeesLower,
          flexibleDates,
          numberNights,
          meetingSpaces,
          occupancyTypes,
          preferredMonths,
          preferredStartDow,
          startDate: toDate(startDate),
          endDate: toDate(endDate),
          budget,
        }),
        types: [
          POST_LODGING_REQUEST_FORM_REQUEST,
          POST_LODGING_REQUEST_FORM_SUCCESS,
          POST_LODGING_REQUEST_FORM_FAILURE,
        ],
      })
    )) as unknown as ApiAction
    if (!response.error) {
      onSuccess(response.payload.id)
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

export const POST_RFP_LITE_RESPONSE_REQUEST = "POST_RFP_LITE_RESPONSE_REQUEST"
export const POST_RFP_LITE_RESPONSE_SUCCESS = "POST_RFP_LITE_RESPONSE_SUCCESS"
export const POST_RFP_LITE_RESPONSE_FAILURE = "POST_RFP_LITE_RESPONSE_FAILURE"

export function postRFPLiteResponse(
  lodgingProposalRequestId: number,
  availability: boolean,
  hotel: string,
  dates?: string
) {
  let endpoint = "/v1.0/lodging/rfp-lite-responses"
  return createApiAction({
    endpoint,
    method: "POST",
    body: JSON.stringify({
      lodgingProposalRequestId,
      availability,
      hotel,
      dates,
    }),
    types: [
      POST_RFP_LITE_RESPONSE_REQUEST,
      POST_RFP_LITE_RESPONSE_SUCCESS,
      POST_RFP_LITE_RESPONSE_FAILURE,
    ],
  })
}
