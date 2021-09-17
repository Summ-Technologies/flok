import {Action} from "redux"
import {DestinationModel} from "../../models/lodging"
import {GetDestinationsAction, GET_DESTINATIONS} from "../actions/lodging"

export type LodgingState = {
  destinationsLoaded: boolean
  destinations: {
    [id: number]: DestinationModel
  }
  destinationsGuidMapping: {
    [guid: string]: number
  }
}

const initialState: LodgingState = {
  destinations: {},
  destinationsLoaded: false,
  destinationsGuidMapping: {},
}

export default function lodgingReducer(
  state: LodgingState = initialState,
  action: Action
): LodgingState {
  var newDestinationsGuidMapping: {[guid: string]: number}
  switch (action.type) {
    case GET_DESTINATIONS:
      let destinations = (action as GetDestinationsAction).destinations
      let newDestinations = {...state.destinations}
      newDestinationsGuidMapping = {...state.destinationsGuidMapping}
      destinations.forEach((destination) => {
        newDestinations[destination.id] = destination
        newDestinationsGuidMapping[destination.guid] = destination.id
      })
      return {
        ...state,
        destinations: newDestinations,
        destinationsGuidMapping: newDestinationsGuidMapping,
        destinationsLoaded: true,
      }
    default:
      return state
  }
}
