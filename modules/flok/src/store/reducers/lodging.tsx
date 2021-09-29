import {Action} from "redux"
import {ResourceNotFound, ResourceNotFoundType} from "../../models"
import {DestinationModel, HotelModel} from "../../models/lodging"
import {
  GetDestinationsAction,
  GetHotelByGuidAction,
  GetHotelsAction,
  GET_DESTINATIONS,
  GET_HOTELS,
  GET_HOTEL_BY_GUID,
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
  hotelsByFilter: {
    [filterKey: string]: {
      hotels: number[]
      hasMore: boolean
      currPage: number
      numHits: number
    }
  }
  hotelsGuidMapping: {
    [guid: string]: number | ResourceNotFoundType
  }
}

const initialState: LodgingState = {
  destinations: {},
  destinationsLoaded: false,
  destinationsGuidMapping: {},

  hotels: {},
  hotelsByFilter: {},
  hotelsGuidMapping: {},
}

export default function lodgingReducer(
  state: LodgingState = initialState,
  action: Action
): LodgingState {
  var newDestinationsGuidMapping: {[guid: string]: number}
  var newHotelsGuidMapping: {[guid: string]: number | ResourceNotFoundType}
  var newHotels: {[id: number]: HotelModel}
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
    case GET_HOTELS:
      let {hotels, filterKey, currPage, hasMore, numHits} =
        action as GetHotelsAction
      newHotels = {...state.hotels}
      let hotelIds = [
        ...(state.hotelsByFilter[filterKey]
          ? state.hotelsByFilter[filterKey].hotels
          : []),
        ...hotels.map((hotel) => hotel.id),
      ]
      let newHotelsByFilter = {
        ...state.hotelsByFilter,
        [filterKey]: {hotels: hotelIds, hasMore, currPage, numHits},
      }
      newHotelsGuidMapping = {...state.hotelsGuidMapping}
      hotels.forEach((hotel) => {
        newHotels[hotel.id] = hotel
        newHotelsGuidMapping[hotel.guid] = hotel.id
      })
      return {
        ...state,
        hotels: newHotels,
        hotelsGuidMapping: newHotelsGuidMapping,
        hotelsByFilter: newHotelsByFilter,
      }
    case GET_HOTEL_BY_GUID:
      let {guid, hotel} = action as GetHotelByGuidAction
      newHotelsGuidMapping = {...state.hotelsGuidMapping}
      newHotels = {...state.hotels}
      if (hotel === ResourceNotFound) {
        newHotelsGuidMapping[guid] = ResourceNotFound
      } else {
        newHotels[hotel.id] = hotel
        newHotelsGuidMapping[hotel.guid] = hotel.id
      }
      return {
        ...state,
        hotels: newHotels,
        hotelsGuidMapping: newHotelsGuidMapping,
      }
    default:
      return state
  }
}
