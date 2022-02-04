import {Action} from "redux"
import {
  AdminRetreatDetailsModel,
  AdminRetreatListModel,
  AdminRetreatListType,
} from "../../models"
import {GET_RETREATS_LIST_SUCCESS} from "../actions/admin"
import {ApiAction} from "../actions/api"

export type AdminState = {
  retreatsList: {
    active: AdminRetreatListModel[]
    inactive: AdminRetreatListModel[]
    complete: AdminRetreatListModel[]
  }
  retreats: {
    [key: number]: AdminRetreatDetailsModel | undefined
  }
}

const initialState: AdminState = {
  retreatsList: {
    active: [],
    inactive: [],
    complete: [],
  },
  retreats: {},
}

export default function AdminReducer(
  state: AdminState = initialState,
  action: Action
): AdminState {
  var payload
  switch (action.type) {
    case GET_RETREATS_LIST_SUCCESS:
      let meta = (action as unknown as {meta: {state: AdminRetreatListType}})
        .meta
      payload = (action as unknown as ApiAction).payload as {
        retreats: AdminRetreatListModel[]
      }
      return {
        ...state,
        retreatsList: {...state.retreatsList, [meta.state]: payload.retreats},
      }
    default:
      return state
  }
}
