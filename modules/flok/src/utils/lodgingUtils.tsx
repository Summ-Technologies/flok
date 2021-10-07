import {useCallback, useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ResourceNotFound, ResourceNotFoundType} from "../models"
import {BudgetType, DestinationModel, HotelModel} from "../models/lodging"
import {RootState} from "../store"
import {
  getDestinations,
  getHotelById,
  getHotels,
} from "../store/actions/lodging"
import {getRetreat} from "../store/actions/retreat"
import {getAlgoliaFilterString} from "./algoliaUtils"

// HOOKS
export function useDestinations() {
  let dispatch = useDispatch()
  let destinations = useSelector(
    (state: RootState) => state.lodging.destinations
  )
  let destinationsLoading = useSelector(
    (state: RootState) => state.api.getDestinationsLoading
  )
  useEffect(() => {
    if (!Object.keys(destinations).length) {
      dispatch(getDestinations())
    }
  }, [dispatch, destinations])
  return [destinations, destinationsLoading] as const
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
  destinationsFilter: number[],
  budgetFilter: BudgetType[]
) {
  let dispatch = useDispatch()

  let [filter, setFilter] = useState(
    getAlgoliaFilterString(destinationsFilter, budgetFilter)
  )
  useEffect(() => {
    setFilter(getAlgoliaFilterString(destinationsFilter, budgetFilter))
  }, [destinationsFilter, budgetFilter])

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

export function useRetreat(retreatGuid: string) {
  let dispatch = useDispatch()
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatGuid]
  )
  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreat(retreatGuid))
    }
  }, [retreat, dispatch, retreatGuid])
  return retreat
}

export class DestinationUtils {
  static getLocationName(destination: DestinationModel) {
    return `${destination.location}, ${
      destination.state_abbreviation || destination.country
    }`
  }
}
