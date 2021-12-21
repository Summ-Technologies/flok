import {FlokInternalAdminModel} from "./user"

export type RetreatSelectedHotelProposalState =
  | "SELECTED"
  | "PENDING"
  | "NOT_AVAILABLE"
  | "REVIEW"

export type HotelLodgingProposal = {
  id: number
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

export type RetreatModel = {
  id: number
  guid: string
  company_name: string
  contact_email: string
  state: RetreatProgressState
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
