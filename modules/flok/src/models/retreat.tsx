import {FlokInternalAdminModel} from "./user"

export type RetreatToTaskState = "TODO" | "COMPLETED" | "NEXT"
export type RetreatTask = {
  id: number
  description: string
  link: string
}
export type RetreatToTask = {
  retreat_id: number
  state: RetreatToTaskState
  task: RetreatTask
  task_id: number
}

export type RetreatSelectedHotelProposalState =
  | "SELECTED"
  | "PENDING"
  | "NOT_AVAILABLE"
  | "REVIEW"

export type HotelLodgingProposal = {
  id: number
  dates: string
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
}

export type RetreatSelectedHotelProposal = {
  retreat_id: number
  hotel_id: number
  state: RetreatSelectedHotelProposalState
  hotel_proposal: HotelLodgingProposal
}

export type RetreatProgressState =
  | "INTAKE_1"
  | "INTAKE_2"
  | "FILTER_SELECT"
  | "DESTINATION_SELECT"
  | "HOTEL_SELECT"
  | "PROPOSAL"
  | "PROPOSAL_READY"

export type RetreatLodgingState =
  | "NOT_STARTED"
  | "PROPOSALS_WAITING"
  | "PROPOSALS_VIEW"
  | "CONTRACT_NEGOTIATION"
  | "BOOKED"
export type FlightState = "NOT_STARTED" | "POLICY_REVIEW" | "BOOKING"
export type ItineraryState = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"

export type RetreatModel = {
  id: number
  guid: string
  company_name: string
  contact_email: string
  state: RetreatProgressState
  state_lodging: RetreatLodgingState
  state_flights: FlightState
  state_itinerary: ItineraryState
  selected_destinations_ids: number[]
  selected_hotels_ids: number[]
  selected_hotels: RetreatSelectedHotelProposal[]
  preferences_num_attendees_lower?: number
  preferences_is_dates_flexible?: boolean
  preferences_dates_exact_start?: string
  preferences_dates_exact_end?: string
  preferences_dates_flexible_months?: string[]
  preferences_dates_flexible_num_nights?: number
  flok_sourcing_admin?: FlokInternalAdminModel
  tasks_todo: RetreatToTask[]
  tasks_next: RetreatToTask[]
  tasks_completed: RetreatToTask[]
}

export type FilterAnswerModel = {
  id: number
  question_id: number
  title: string
  algolia_filter: string
  is_default_answer: boolean
}

export type FilterQuestionModel = {
  id: number
  title: string
  more_info: string
  is_multi_select: boolean
  question_affinity: string
  answers: FilterAnswerModel[]
}

export type FilterResponseModel = {
  id: number
  retreat_id: number
  answer_id: number
}

export type RetreatTripModel = {
  id: number
  cost: number
  duration: number
  confirmation_number: string
  arr_airport: string
  dep_airport: string
  arr_datetime: Date
  dep_datetime: Date
  airline: string
}

export type RetreatTravelModel = {
  id: number
  cost: number
  dep_trip?: RetreatTripModel
  arr_trip?: RetreatTripModel
  email_address: string
  name: string
  status: string
}

export type RetreatAttendeeModel = {
  id: number
  email_address: string
  name: string
  travel?: RetreatTravelModel
}
