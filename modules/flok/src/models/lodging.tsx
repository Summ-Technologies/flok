export type DestinationAlgoliaHitModel = {
  city: string
  country: string
  state: string
  objectID: string
}

export type HotelAlgoliaHitModel = {
  location: string
  price: string
  website: string
  rooms: string
  google_rating: string
  hotel_name: string
  objectID: string
}

export type BudgetType = "$" | "$$" | "$$$" | "$$$$"
