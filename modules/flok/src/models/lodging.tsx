import {ImageModel} from "."

// Destinations
export type DestinationModel = {
  id: number
  guid: string
  objectID: string
  location: string // usually a city, can be more generic like "Lake Tahoe"/"Bay Area" etc.
  state?: string
  state_abbreviation?: string
  country: string
  country_abbreviation?: string

  description_short: string

  spotlight_img: ImageModel
  imgs: ImageModel[]
}

// Hotels
export type HotelModel = {
  id: number
  guid: string
  objectID: string
  name: string
  destination_id: number
  sub_location?: string
  street_address?: string

  website_url: string
  description_short: string
  airport_travel_time?: number
  airport?: string

  spotlight_img: ImageModel
  imgs: ImageModel[]
}
