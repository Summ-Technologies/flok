import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ResourceNotFound} from "../models"
import {DestinationModel, HotelModel} from "../models/lodging"
import {RootState} from "../store"
import {getDestinations, getHotelByGuid} from "../store/actions/lodging"

// HOOKS
export function useDestinations() {
  let dispatch = useDispatch()
  let destinations = useSelector(
    (state: RootState) => state.lodging.destinations
  )
  let [loadingDestinations, setLoadingDestinations] = useState(false)
  useEffect(() => {
    async function loadDestinations() {
      setLoadingDestinations(true)
      await dispatch(getDestinations())
      setLoadingDestinations(false)
    }
    if (!Object.keys(destinations).length) {
      loadDestinations()
    }
  }, [dispatch, destinations])
  return [destinations, loadingDestinations] as const
}

export function useHotel(hotelGuid: string) {
  let dispatch = useDispatch()
  let [loadingHotel, setLoadingHotel] = useState(false)
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
    async function loadHotel() {
      setLoadingHotel(true)
      await dispatch(getHotelByGuid(hotelGuid))
      setLoadingHotel(false)
    }
    if (!hotel && hotel !== ResourceNotFound) {
      loadHotel()
    }
  }, [hotelGuid, hotel, hotelId, dispatch])

  return [hotel, loadingHotel] as const
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
    let locationStr = ""
    // Hack for only sublocation if it includes state: see https://goflok.slack.com/archives/C02HR2Y7J66/p1647367887286479
    if (hotel && hotel.sub_location && hotel.sub_location.includes(",")) {
      locationStr = hotel.sub_location
    } else {
      locationStr = `${
        (hotel && hotel.sub_location) || destination.location
      }, ${destination.state_abbreviation || destination.country}`
    }
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
    return `${
      airportHours > 0
        ? `${airportHours} hr${airportHours > 1 ? "s" : ""} `
        : ""
    }${airportMins} mins`
  }
}
