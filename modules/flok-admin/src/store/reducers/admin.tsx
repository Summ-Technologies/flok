import {Action} from "redux"
import {ApiError} from "redux-api-middleware"
import {
  AdminRetreatListModel,
  AdminRetreatListType,
  AdminRetreatModel,
} from "../../models"
import {
  GET_RETREATS_LIST_SUCCESS,
  GET_RETREAT_DETAILS_FAILURE,
  GET_RETREAT_DETAILS_REQUEST,
  GET_RETREAT_DETAILS_SUCCESS,
  PUT_RETREAT_DETAILS_FAILURE,
  PUT_RETREAT_DETAILS_REQUEST,
  PUT_RETREAT_DETAILS_SUCCESS,
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
    default:
      return state
  }
}
