import {ImageModel} from "."

// keep the following in parity (enables us to check if strings are of budget type)
export type BudgetType = "$" | "$$" | "$$$" | "$$$$"
export const BudgetTypeVals = ["$", "$$", "$$$", "$$$$"]

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

  tagline: string
  description: string
  description_short: string
  detail_sections: {header: string; body: string}[]

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

  price: BudgetType
  rating: number // should be 1 - 5
  num_rooms: number
  website_url: string
  tagline: string
  description: string
  description_short: string
  street_address?: string
  address_coordinates?: [number, number]

  spotlight_img: ImageModel
  imgs: ImageModel[]
}
