export type RetreatSelectedHotelProposalState =
  | "SELECTED"
  | "PENDING"
  | "NOT_AVAILABLE"
  | "REVIEW"

export type HotelLodgingProposalLink = {
  link_url: string
  link_text: string
  affinity?: "MEETING_ROOMS" | "FOOD_BEV" | "GUESTROOMS"
}

export type HotelLodgingProposal = {
  id: number
  dates: string
  dates_note: string
  num_guests?: string
  is_all_inclusive?: boolean
  currency?: "USD" | "EUR"
  compare_room_rate: number
  compare_room_total: number
  on_hold: boolean
  summary: string
  hold_status: string
  guestroom_rates: string
  approx_room_total: string
  resort_fee: string
  tax_rates: string
  additional_fees: string
  suggested_meeting_spaces: string
  meeting_room_rates: string
  meeting_room_tax_rates: string
  food_bev_minimum: string
  food_bev_service_fee: string
  avg_breakfast_price: string
  avg_snack_price: string
  avg_lunch_price: string
  avg_dinner_price: string
  cost_saving_notes: string
  additional_links: HotelLodgingProposalLink[]
}

export type RetreatSelectedHotelProposal = {
  retreat_id: number
  hotel_id: number
  state: RetreatSelectedHotelProposalState
  hotel_proposals?: HotelLodgingProposal[]
}

export type RetreatProgressState =  // Deprecated
  | "INTAKE_1"
  | "INTAKE_2"
  | "FILTER_SELECT"
  | "DESTINATION_SELECT"
  | "HOTEL_SELECT"
  | "PROPOSAL"
  | "PROPOSAL_READY"

export const OrderedRetreatLodgingState = [
  "NOT_STARTED",
  "PROPOSALS_WAITING",
  "PROPOSALS_VIEW",
  "BOOKED",
] as const
export type RetreatLodgingState = typeof OrderedRetreatLodgingState[number]

export const OrderedRetreatAttendeesState = [
  "NOT_STARTED",
  "FORM_REVIEW",
  "REGISTRATION_OPEN",
] as const
export type RetreatAttendeesState = typeof OrderedRetreatAttendeesState[number]

export const OrderedRetreatFlightsState = [
  "NOT_STARTED",
  "POLICY_REVIEW",
  "BOOKING",
] as const
export type RetreatFlightsState = typeof OrderedRetreatFlightsState[number]

export const OrderedRetreatItineraryState = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const
export type RetreatItineraryState = typeof OrderedRetreatFlightsState[number]

export type RetreatToTaskState = "TODO" | "COMPLETED" | "HIDDEN"

export type RetreatTask = {
  id: number
  description?: string
  title: string
  link: string
  user_complete: boolean
}

export type RetreatToTask = {
  task: RetreatTask
  order: number
  state: RetreatToTaskState
  due_date?: string
  link_override?: string
}
export type RetreatModel = {
  id: number
  guid: string
  company_name: string
  state: RetreatProgressState

  // Retreat data related to the intake form
  contact_email: string
  preferences_num_attendees_lower?: number // `_lower` is legacy, treat this as the number input in form
  preferences_is_dates_flexible?: boolean
  preferences_dates_exact_start?: string
  preferences_dates_exact_end?: string
  preferences_dates_flexible_months?: string[]
  preferences_dates_flexible_num_nights?: number

  // Retreat data related to lodging
  lodging_state?: RetreatLodgingState
  lodging_final_start_date?: string
  lodging_final_end_date?: string
  lodging_final_destination?: string
  lodging_final_hotel_id?: number
  lodging_final_contract_notes?: string
  lodging_final_contract_url?: string
  selected_hotels_ids: number[]
  selected_hotels: RetreatSelectedHotelProposal[]

  // Retreat data related to flights
  attendees_state?: RetreatAttendeesState

  // Retreat data related to flights
  flights_state?: RetreatFlightsState

  // Retreat data related to itinerary
  itinerary_state?: RetreatItineraryState

  tasks_todo: RetreatToTask[]
  tasks_completed: RetreatToTask[]
}

export type RetreatTripModel = {
  id: number
  cost: number
  duration: number
  confirmation_number: string
  arr_airport: string
  dep_airport: string
  arr_datetime: string
  dep_datetime: string
  airline: string
}

export type RetreatTravelModel = {
  id: number
  cost: number
  dep_trip?: RetreatTripModel
  arr_trip?: RetreatTripModel
  email_address: string
  name: string
  status: string // OPT_OUT | BOOKED | PENDING
}

export type RetreatAttendeeModel = {
  id: number
  email_address: string
  name: string
  travel?: RetreatTravelModel
  city: string
  dietary_prefs: string
  notes: string
  info_status: string
}
