import {Action} from "redux"
import {DestinationModel, HotelModel} from "../../models/lodging"
import {
  GetDestinationsAction,
  GET_DESTINATIONS,
  UpdateHotelNotFoundAction,
  UpdateHotelsAction,
  UPDATE_HOTELS,
  UPDATE_HOTEL_NOT_FOUND,
} from "../actions/lodging"

export type LodgingState = {
  destinationsLoaded: boolean
  destinations: {
    [id: number]: DestinationModel
  }
  destinationsGuidMapping: {
    [guid: string]: number
  }
  hotels: {
    [id: number]: HotelModel
  }
  hotelsGuidMapping: {
    [guid: string]: number | "NOT_FOUND"
  }
}

const initialState: LodgingState = {
  destinations: {},
  destinationsLoaded: false,
  destinationsGuidMapping: {},

  hotels: {},
  hotelsGuidMapping: {},
}

export default function lodgingReducer(
  state: LodgingState = initialState,
  action: Action
): LodgingState {
  var newDestinationsGuidMapping: {[guid: string]: number}
  var newHotelsGuidMapping: {[guid: string]: number | "NOT_FOUND"}
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
    case UPDATE_HOTELS:
      let hotels = (action as UpdateHotelsAction).hotels
      let newHotels = {...state.hotels}
      newHotelsGuidMapping = {...state.hotelsGuidMapping}
      hotels.forEach((hotel) => {
        newHotels[hotel.id] = hotel
        newHotelsGuidMapping[hotel.guid] = hotel.id
      })
      return {
        ...state,
        hotels: newHotels,
        hotelsGuidMapping: newHotelsGuidMapping,
      }
    case UPDATE_HOTEL_NOT_FOUND:
      let guid = (action as UpdateHotelNotFoundAction).guid
      newHotelsGuidMapping = {...state.hotelsGuidMapping}
      newHotelsGuidMapping[guid] = "NOT_FOUND"
      return {
        ...state,
        hotelsGuidMapping: newHotelsGuidMapping,
      }
    default:
      return state
  }
}
