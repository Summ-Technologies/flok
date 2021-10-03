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
}
