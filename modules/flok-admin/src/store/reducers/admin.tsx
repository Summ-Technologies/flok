import {Action} from "redux"
import {ApiError} from "redux-api-middleware"
import {
  AdminDestinationModel,
  AdminHotelModel,
  AdminRetreatListModel,
  AdminRetreatListType,
  AdminRetreatModel,
} from "../../models"
import {
  DELETE_HOTEL_PROPOSAL_SUCCESS,
  DELETE_SELECTED_HOTEL_SUCCESS,
  GET_DESTINATIONS_SUCCESS,
  GET_HOTELS_BY_DEST_SUCCESS,
  GET_HOTELS_BY_ID_SUCCESS,
  GET_RETREATS_LIST_SUCCESS,
  GET_RETREAT_DETAILS_FAILURE,
  GET_RETREAT_DETAILS_REQUEST,
  GET_RETREAT_DETAILS_SUCCESS,
  POST_HOTEL_PROPOSAL_SUCCESS,
  POST_SELECTED_HOTEL_SUCCESS,
  PUT_HOTEL_PROPOSAL_SUCCESS,
  PUT_RETREAT_DETAILS_FAILURE,
  PUT_RETREAT_DETAILS_REQUEST,
  PUT_RETREAT_DETAILS_SUCCESS,
  PUT_SELECTED_HOTEL_SUCCESS,
} from "../actions/admin"
import {ApiAction} from "../actions/api"

export type ApiStatus = {
  loading?: boolean
  status?: number
}
export type AdminState = {
  retreatsList: {
    active: AdminRetreatListModel[]
    inactive: AdminRetreatListModel[]
    complete: AdminRetreatListModel[]
  }
  retreatsDetails: {
    [key: number]: AdminRetreatModel | undefined
  }
  hotels: {
    [key: number]: AdminHotelModel | undefined
  }
  destinations: {
    [key: number]: AdminDestinationModel | undefined
  }
  allDestinations?: number[]
  hotelsByDestination: {[key: number]: number[]}
  api: {
    retreatsDetails: {
      [key: number]: ApiStatus | undefined
    }
  }
}

const initialState: AdminState = {
  retreatsList: {
    active: [],
    inactive: [],
    complete: [],
  },
  retreatsDetails: {},
  destinations: {},
  allDestinations: undefined,
  hotelsByDestination: {},
  hotels: {},
  api: {
    retreatsDetails: {},
  },
}

export default function AdminReducer(
  state: AdminState = initialState,
  action: Action
): AdminState {
  var payload
  var meta
  switch (action.type) {
    case GET_RETREATS_LIST_SUCCESS:
      meta = (action as unknown as {meta: {state: AdminRetreatListType}}).meta
      payload = (action as unknown as ApiAction).payload as {
        retreats: AdminRetreatListModel[]
      }
      return {
        ...state,
        retreatsList: {...state.retreatsList, [meta.state]: payload.retreats},
      }
    case GET_RETREAT_DETAILS_REQUEST:
    case GET_RETREAT_DETAILS_SUCCESS:
    case GET_RETREAT_DETAILS_FAILURE:
    case PUT_RETREAT_DETAILS_REQUEST:
    case PUT_RETREAT_DETAILS_SUCCESS:
    case PUT_RETREAT_DETAILS_FAILURE:
      meta = (action as unknown as {meta: {id: number}}).meta
      action = action as unknown as ApiAction
      payload = (action as unknown as ApiAction).payload as {
        retreat: AdminRetreatModel
      }
      if ((action.type as string).endsWith("SUCCESS")) {
        state = {
          ...state,
          retreatsDetails: {
            ...state.retreatsDetails,
            [meta.id]: payload.retreat,
          },
        }
      }
      return {
        ...state,
        api: {
          ...state.api,
          retreatsDetails: {
            ...state.api.retreatsDetails,
            [meta.id]: {
              loading: (action.type as string).endsWith("REQUEST")
                ? true
                : false,
              status: (action.type as string).endsWith("FAILURE")
                ? ((action as unknown as ApiAction).payload as ApiError).status
                : undefined,
            },
          },
        },
      }
    case GET_DESTINATIONS_SUCCESS:
      meta = (action as unknown as {meta: {id: number}}).meta
      action = action as unknown as ApiAction
      payload = (action as unknown as ApiAction).payload as {
        destinations: AdminDestinationModel[]
      }
      return {
        ...state,
        destinations: {
          ...state.destinations,
          ...payload.destinations.reduce(
            (last, curr) => ({...last, [curr.id]: curr}),
            {}
          ),
        },
        allDestinations: payload.destinations
          .sort((a, b) => (a.location > b.location ? 0 : 1))
          .map((dest) => dest.id),
      }
    case GET_HOTELS_BY_DEST_SUCCESS:
      meta = (action as unknown as {meta: {id: number}}).meta
      action = action as unknown as ApiAction
      payload = (action as unknown as ApiAction).payload as {
        hotels: AdminHotelModel[]
      }
      let hotelsByDestination: {[key: number]: number[]} = {}
      payload.hotels.forEach((hotel) => {
        if (hotelsByDestination[hotel.destination_id] == null) {
          hotelsByDestination[hotel.destination_id] = [hotel.id]
        } else {
          hotelsByDestination[hotel.destination_id].push(hotel.id)
        }
      })
      return {
        ...state,
        hotels: {
          ...state.hotels,
          ...payload.hotels.reduce(
            (last, curr) => ({...last, [curr.id]: curr}),
            {}
          ),
        },
        hotelsByDestination: {
          ...state.hotelsByDestination,
          ...hotelsByDestination,
        },
      }
    case GET_HOTELS_BY_ID_SUCCESS:
      meta = (action as unknown as {meta: {id: number}}).meta
      action = action as unknown as ApiAction
      payload = (action as unknown as ApiAction).payload as {
        hotels: AdminHotelModel[]
      }
      return {
        ...state,
        hotels: {
          ...state.hotels,
          ...payload.hotels.reduce(
            (last, curr) => ({...last, [curr.id]: curr}),
            {}
          ),
        },
      }
    case POST_SELECTED_HOTEL_SUCCESS:
    case PUT_SELECTED_HOTEL_SUCCESS:
    case DELETE_SELECTED_HOTEL_SUCCESS:
    case POST_HOTEL_PROPOSAL_SUCCESS:
    case PUT_HOTEL_PROPOSAL_SUCCESS:
    case DELETE_HOTEL_PROPOSAL_SUCCESS:
      action = action as unknown as ApiAction
      payload = (action as unknown as ApiAction).payload as {
        retreat: AdminRetreatModel
      }
      return {
        ...state,
        retreatsDetails: {
          ...state.retreatsDetails,
          [payload.retreat.id]: payload.retreat,
        },
      }
    default:
      return state
  }
}
