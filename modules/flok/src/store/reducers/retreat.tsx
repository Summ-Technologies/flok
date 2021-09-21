import {Action} from "redux"
import {RetreatModel} from "../../models/retreat"
import {ApiAction} from "../actions/api"
import {GET_RETREAT_FAILURE, GET_RETREAT_SUCCESS} from "../actions/retreat"

export type RetreatState = {
  retreats: {
    [guid: string]: RetreatModel | "NOT_FOUND"
  }
}

const initialState: RetreatState = {
  retreats: {},
}

export default function retreatReducer(
  state: RetreatState = initialState,
  action: Action
): RetreatState {
  var payload
  var newRetreatsState: {[guid: string]: RetreatModel | "NOT_FOUND"}
  switch (action.type) {
    case GET_RETREAT_SUCCESS:
      payload = (action as ApiAction).payload as RetreatModel
      newRetreatsState = {...state.retreats}
      newRetreatsState[payload.guid] = payload
      return {...state, retreats: newRetreatsState}
    case GET_RETREAT_FAILURE:
      let guid = (action as unknown as {meta: {guid: string}}).meta.guid
      newRetreatsState = {...state.retreats}
      newRetreatsState[guid] = "NOT_FOUND"
      return {...state, retreats: newRetreatsState}
    default:
      return state
  }
}
