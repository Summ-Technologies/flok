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
export type AdminRetreatDetailsModel = {
  id: number
  guid: string
  company_name: string
  contact_name: string
  contact_email: string
  preferences_num_attendees_lower: number
  preferences_is_dates_flexible: boolean
  preferences_dates_flexible_num_nights?: number
  preferences_dates_flexible_months?: string[]
  preferences_dates_exact_start?: string
  preferences_dates_exact_end?: string
  state: string
  flok_admin_calendly_call: string
  flok_admin_signup_type: string
  flok_admin_owner: string
  flok_admin_state: string // One of retreat state options
}

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

export type AdminSelectedHotelProposal = {
  retreat_id: number
  hotel_id: number
  state: "SELECTED" | "PENDING" | "NOT_AVAILABLE" | "REVIEW"
  hotel_proposals?: AdminLodgingProposalModel[]
}

export type AdminLodgingProposalModel = {
  id: number
  dates?: string
  num_guests?: string
  compare_room_rate?: number
  compare_room_total?: number
  on_hold?: boolean
  summary?: string
  hold_status?: string
  guestroom_rates?: string
  approx_room_total?: string
  resort_fee?: string
  tax_rates?: string
  additional_fees?: string
  suggested_meeting_spaces?: string
  meeting_room_rates?: string
  meeting_room_tax_rates?: string
  food_bev_minimum?: string
  food_bev_service_fee?: string
  avg_breakfast_price?: string
  avg_snack_price?: string
  avg_lunch_price?: string
  avg_dinner_price?: string
  cost_saving_notes?: string
  additional_links: {link_url: string; link_text: string}[]
}
