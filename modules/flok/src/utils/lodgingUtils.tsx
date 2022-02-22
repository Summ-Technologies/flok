import {useCallback, useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ResourceNotFound, ResourceNotFoundType} from "../models"
import {DestinationModel, HotelModel} from "../models/lodging"
import {
  FilterAnswerModel,
  RetreatAttendeeModel,
  RetreatModel,
} from "../models/retreat"
import {RootState} from "../store"
import {
  getDestinations,
  getHotelById,
  getHotels,
} from "../store/actions/lodging"
import {
  getRetreat,
  getRetreatAttendees,
  getRetreatFilters,
} from "../store/actions/retreat"
import {
  getAlgoliaDestinationFilterString,
  getAlgoliaHotelFilterString,
} from "./algoliaUtils"

// HOOKS
export function useDestinations() {
  let dispatch = useDispatch()
  let allDestinations = useSelector(
    (state: RootState) => state.lodging.destinationsByFilter[""]
  )
  let destinations = useSelector(
    (state: RootState) => state.lodging.destinations
  )
  let destinationsLoading = useSelector(
    (state: RootState) => state.api.getDestinationsLoading
  )
  useEffect(() => {
    if (!allDestinations) {
      dispatch(getDestinations(""))
    }
  }, [dispatch, allDestinations])
  return [destinations, destinationsLoading] as const
}

export function useFilteredDestinations(
  selectedFilterResponses: number[],
  filterAnswers: FilterAnswerModel[]
) {
  let dispatch = useDispatch()

  let [filter, setFilter] = useState(
    getAlgoliaDestinationFilterString(selectedFilterResponses, filterAnswers)
  )
  useEffect(() => {
    setFilter(
      getAlgoliaDestinationFilterString(selectedFilterResponses, filterAnswers)
    )
  }, [selectedFilterResponses, filterAnswers])

  let destinationsById = useSelector(
    (state: RootState) => state.lodging.destinations
  )

  let [destinations, setDestinations] = useState<DestinationModel[]>([])

  let destinationsFilterState = useSelector(
    (state: RootState) =>
      state.lodging.destinationsByFilter[filter] || {
        destinations: [],
      }
  )

  useEffect(() => {
    if (!destinationsFilterState.destinations.length) {
      dispatch(getDestinations(filter))
    }
  }, [dispatch, filter, destinationsFilterState.destinations.length])

  useEffect(() => {
    setDestinations(
      destinationsFilterState.destinations.map((id) => destinationsById[id])
    )
  }, [destinationsById, destinationsFilterState.destinations])

  return destinations
}

/**
 *
 * @returns
 *    1. destination
 *    2. isLoading
 */
export function useDestination(destinationGuid: string) {
  let [destinations, destinationsLoading] = useDestinations()
  let [destination, setDestination] = useState<
    DestinationModel | ResourceNotFoundType | null
  >(null)
  useEffect(() => {
    if (
      Object.keys(destinations).length &&
      destinationGuid &&
      destination === null
    ) {
      setDestination(
        Object.values(destinations).filter(
          (dest) => dest.guid === destinationGuid
        )[0] || ResourceNotFound
      )
    }
  }, [destinations, destinationGuid, destination])
  return [destination, destinationsLoading] as const
}

/**
 *
 * @returns Array with
 *    1. hotels: HotelModel[]
 *    2. numHits: number
 *    3. loading: boolean
 *    4. hasMore: boolean
 *    5. getMore: () => void
 */
export function useHotels(
  selectedFilterResponses: number[],
  filterAnswers: FilterAnswerModel[],
  selectedDestinationIds: number[]
) {
  let dispatch = useDispatch()

  let [filter, setFilter] = useState(
    getAlgoliaHotelFilterString(
      selectedFilterResponses,
      filterAnswers,
      selectedDestinationIds
    )
  )
  useEffect(() => {
    setFilter(
      getAlgoliaHotelFilterString(
        selectedFilterResponses,
        filterAnswers,
        selectedDestinationIds
      )
    )
  }, [selectedFilterResponses, filterAnswers, selectedDestinationIds])

  let hotelsById = useSelector((state: RootState) => state.lodging.hotels)

  let [hotels, setHotels] = useState<HotelModel[]>([])
  let [numHits, setNumHits] = useState(0)
  let [hasMore, setHasMore] = useState(false)
  let [loading] = useState(false)

  let hotelsFilterState = useSelector(
    (state: RootState) =>
      state.lodging.hotelsByFilter[filter] || {
        hotels: [],
        hasMore: false,
        currPage: 0,
        numHits: 0,
      }
  )

  let getMore = useCallback(() => {
    dispatch(getHotels(filter, hotelsFilterState.currPage + 1))
  }, [dispatch, filter, hotelsFilterState.currPage])

  useEffect(() => {
    if (!hotelsFilterState.hotels.length) {
      dispatch(getHotels(filter))
    }
  }, [dispatch, filter, hotelsFilterState.hotels.length])

  useEffect(() => {
    setHotels(hotelsFilterState.hotels.map((id) => hotelsById[id]))
    setNumHits(hotelsFilterState.numHits)
    setHasMore(hotelsFilterState.hasMore)
  }, [
    hotelsById,
    hotelsFilterState.hasMore,
    hotelsFilterState.hotels,
    hotelsFilterState.numHits,
  ])

  return [hotels, numHits, loading, hasMore, getMore] as const
}

/**
 * @returns HotelModel | ResourceNotFound | undefined
 */
export function useHotel(hotelGuid: string) {
  let dispatch = useDispatch()
  let hotelId = useSelector(
    (state: RootState) => state.lodging.hotelsGuidMapping[hotelGuid]
  )
  let hotel = useSelector((state: RootState) => {
    if (hotelId === ResourceNotFound) {
      return ResourceNotFound
    } else if (hotelId) {
      return state.lodging.hotels[hotelId]
    } else {
      return undefined
    }
  })
  useEffect(() => {
    if (!hotel && hotelId !== ResourceNotFound) {
      dispatch(getHotelById(hotelGuid))
    }
  }, [hotelGuid, hotel, hotelId, dispatch])

  return hotel
}

export function useRetreat(retreatIdx: number) {
  let dispatch = useDispatch()
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatIdx]
  )
  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreat(retreatIdx))
    }
  }, [retreat, dispatch, retreatIdx])
  return retreat as RetreatModel | ResourceNotFoundType | undefined
}

export class DestinationUtils {
  static EMOJIS_BY_COUNTRY: {[key: string]: string} = {
    USA: "🇺🇸",
    MX: "🇲🇽",
    ESP: "🇪🇸",
  }
  static EMOJIS_BY_LOCATION: {[key: string]: string} = {}

  static getCountryEmoji(destination: DestinationModel) {
    let emoji = DestinationUtils.EMOJIS_BY_LOCATION[destination.location]
    if (!emoji && destination.country_abbreviation) {
      emoji =
        DestinationUtils.EMOJIS_BY_COUNTRY[destination.country_abbreviation]
    }
    return emoji
  }

  /**
   * Location name short is the state (if available) and country the
   * location (usually city or area) is a part of. Return value doesn't
   * include location (city/area) itself as it will often be displayed
   * elsewhere like in the destination list item.
   */
  static getLocationNameShort(
    destination: DestinationModel,
    includeEmoji: boolean = false
  ) {
    let locationStr = destination.state
      ? `${destination.state}, ${destination.country_abbreviation}`
      : `${destination.country}`
    if (includeEmoji) {
      let emoji = DestinationUtils.getCountryEmoji(destination)
      if (emoji) {
        locationStr += ` ${emoji}`
      }
    }
    return locationStr
  }
  static getLocationName(
    destination: DestinationModel,
    includeEmoji: boolean = false,
    hotel: HotelModel | undefined = undefined
  ) {
    let locationStr = `${
      (hotel && hotel.sub_location) || destination.location
    }, ${destination.state_abbreviation || destination.country}`
    if (includeEmoji) {
      let emoji = DestinationUtils.getCountryEmoji(destination)
      if (emoji) {
        locationStr += ` ${emoji}`
      }
    }
    return locationStr
  }
}

export class HotelUtils {
  static getAirportTravelTime(mins: number) {
    let airportHours = Math.floor(mins / 60)
    let airportMins = mins % 60
    return `${airportHours > 0 ? `${airportHours}h ` : ""}${airportMins}m`
  }
}

export function useRetreatFilters(retreatIdx: number) {
  let dispatch = useDispatch()
  let questions = useSelector(
    (state: RootState) => state.retreat.retreatFilterQuestions[retreatIdx]
  )
  let responses = useSelector(
    (state: RootState) => state.retreat.retreatFilterResponses[retreatIdx]
  )
  useEffect(() => {
    if (!questions || !responses) {
      dispatch(getRetreatFilters(retreatIdx))
    }
  }, [questions, responses, retreatIdx, dispatch])
  return [questions, responses] as const
}

export function useRetreatAttendees(retreatIdx: number) {
  let dispatch = useDispatch()
  let attendees = useSelector(
    (state: RootState) => state.retreat.retreatAttendees[retreatIdx]
  )
  useEffect(() => {
    if (!attendees) {
      dispatch(getRetreatAttendees(retreatIdx))
    }
  }, [attendees, dispatch, retreatIdx])
  return attendees as RetreatAttendeeModel[] | ResourceNotFoundType | undefined
}
