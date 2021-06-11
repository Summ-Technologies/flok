export type AccomodationModel = {
  id: number
  lat: number
  long: number
  city: string
  name: string
  airport: string
  employees: string
  img: string
  pricing: string
  destinationId: number
}

export type AccomodationImageModel = {
  img: string
  type: "portrait" | "landscape"
  featured?: boolean
}

export type DestinationModel = {
  id: number
  lat: number
  long: number
  name: string
}
