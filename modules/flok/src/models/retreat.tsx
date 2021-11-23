export type RetreatSelectedHotelProposalState =
  | "SELECTED"
  | "PENDING"
  | "NOT_AVAILABLE"
  | "REVIEW"
export type RetreatSelectedHotelProposal = {
  retreat_id: number
  hotel_id: number
  state: RetreatSelectedHotelProposalState
}

export type RetreatProgressState =
  | "INTAKE_1"
  | "INTAKE_2"
  | "FILTER_SELECT"
  | "DESTINATION_SELECT"
  | "HOTEL_SELECT"
  | "PROPOSAL"

export type RetreatModel = {
  id: number
  guid: string
  company_name: string
  contact_email: string
  state: RetreatProgressState
  selected_destinations_ids: number[]
  selected_hotels_ids: number[]
  selected_hotels_proposals: RetreatSelectedHotelProposal[]
  preferences_num_attendees_lower?: number
  preferences_is_dates_flexible?: boolean
  preferences_dates_exact_start?: string
  preferences_dates_exact_end?: string
  preferences_dates_flexible_months?: string[]
  preferences_dates_flexible_num_nights?: number
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
