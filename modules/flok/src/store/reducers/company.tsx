import {Action} from "redux"
import {UserHomeResponse} from "../../models/api"
import {CompanyModel} from "../../models/company"
import {apiToModel} from "../../utils/apiUtils"
import {ApiAction} from "../actions/api"
import {GET_USER_HOME_SUCCESS} from "../actions/user"

export type CompanyState = {
  companies: {[key: number]: CompanyModel}
}

const initialState: CompanyState = {companies: {}}

export default function userReducer(
  state: CompanyState = initialState,
  action: Action
): CompanyState {
  var payload
  switch (action.type) {
    case GET_USER_HOME_SUCCESS:
      payload = (action as ApiAction).payload as UserHomeResponse
      return payload.company
        ? {
            ...state,
            companies: {
              ...state.companies,
              [payload.company.id]: apiToModel(payload.company),
            },
          }
        : {...state}
    default:
      return state
  }
}
