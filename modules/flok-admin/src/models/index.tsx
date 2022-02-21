export type AdminRetreatListType = "active" | "inactive" | "complete"
export type AdminRetreatListModel = {
  id: number
  guid: string
  company_name: string
  contact_email: string
  preferences_num_attendees_lower: number
  flok_admin_state: string
  flok_admin_owner: string
  created_at: string
}
export type AdminRetreatModel = {
  id: number
  guid: string
  company_name: string
  contact_name: string | null
  contact_email: string | null
  preferences_num_attendees_lower: number | null
  preferences_is_dates_flexible: boolean | null
  preferences_dates_flexible_num_nights: number | null
  preferences_dates_flexible_months: string[] | null
  preferences_dates_exact_start: string | null
  preferences_dates_exact_end?: string | null
  state: string | null
  flok_admin_calendly_call: string | null
  flok_admin_signup_type: string | null
  flok_admin_owner: string | null
  flok_admin_state: string | null // One of retreat state options
  selected_hotels: AdminSelectedHotelProposalModel[]
}

export type AdminRetreatUpdateModel = Pick<
  AdminRetreatModel,
  | "contact_name"
  | "contact_email"
  | "preferences_num_attendees_lower"
  | "preferences_is_dates_flexible"
  | "preferences_dates_flexible_num_nights"
  | "preferences_dates_flexible_months"
  | "preferences_dates_exact_start"
  | "preferences_dates_exact_end"
  | "flok_admin_owner"
  | "flok_admin_state"
  | "state"
>

export const RetreatStateOptions = [
  "Signed up",
  "Intake Call",
  "Follow up Sent",
  "Deposit Sent",
  "Deposit Paid",
  "Hotel Proposal Sourced",
  "Hotel Proposals Sent",
  "Hotel Contract Requested",
  "Hotel Contract To Client",
  "Full Invoice Sent",
  "Hotel Contract Signed",
  "Full Invoiced Paid",
  "Retreat Designer Handoff",
  "Retreat Complete",
  "Did not Sign Up",
  "Not Moving Forward",
  "Canceled",
  "No Show",
]

export const DashboardStateOptions = [
  "INTAKE_1",
  "INTAKE_2",
  "FILTER_SELECT",
  "DESTINATION_SELECT",
  "HOTEL_SELECT",
  "PROPOSAL",
  "PROPOSAL_READY",
]

export type AdminSelectedHotelStateTypes =
  | "SELECTED"
  | "PENDING"
  | "NOT_AVAILABLE"
  | "REVIEW"

export type AdminSelectedHotelProposalModel = {
  retreat_id: number
  hotel_id: number
  state: AdminSelectedHotelStateTypes
  hotel_proposals?: AdminLodgingProposalModel[]
}

export type AdminLodgingProposalModel = {
  id: number
  created_at: string | null
  dates: string | null
  dates_note: string | null
  compare_room_rate: number | null
  compare_room_total: number | null
  num_guests: string | null
  guestroom_rates: string | null
  approx_room_total: string | null
  resort_fee: string | null
  tax_rates: string | null
  additional_fees: string | null
  suggested_meeting_spaces: string | null
  meeting_room_rates: string | null
  meeting_room_tax_rates: string | null
  food_bev_minimum: string | null
  food_bev_service_fee: string | null
  avg_breakfast_price: string | null
  avg_snack_price: string | null
  avg_lunch_price: string | null
  avg_dinner_price: string | null
  cost_saving_notes: string | null
  additional_links: {
    link_url: string
    link_text: string
    affinity: "GUESTROOMS" | "MEETING_ROOMS" | "FOOD_BEV" | null
  }[]
}

export type AdminLodgingProposalUpdateModel = Omit<
  AdminLodgingProposalModel,
  "id" | "created_at"
>

export type AdminHotelModel = {
  id: number
  guid: string
  destination_id: number
  name: string
}

export type AdminDestinationModel = {
  id: number
  guid: string
  location: string
  state?: string
  state_abbreviation?: string
  country?: string
  country_abbreviation?: string
}
