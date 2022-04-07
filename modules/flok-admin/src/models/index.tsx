export type AdminRetreatListType = "active" | "inactive" | "complete"
export type AdminRetreatListModel = {
  id: number
  company_name: string
  contact_email: string
  preferences_num_attendees_lower: number
  created_at: string
  intake_state: RetreatIntakeState
  lodging_state: RetreatLodgingState
  attendees_state: RetreatAttendeesState
  flights_state: RetreatFlightsState
  itinerary_state: RetreatItineraryState
}
export type AdminRetreatModel = {
  id: number
  guid: string
  company_name: string
  contact_name: string | null
  contact_email: string
  preferences_num_attendees_lower: number | null
  preferences_is_dates_flexible: boolean | null
  preferences_dates_flexible_num_nights: number | null
  preferences_dates_flexible_months: string[]
  preferences_dates_exact_start: string | null
  preferences_dates_exact_end?: string | null
  state: string | null
  flok_admin_calendly_call: string | null
  flok_admin_signup_type: string | null
  flok_admin_owner: string | null
  flok_admin_state: string | null // One of retreat state options

  intake_state?: RetreatIntakeState

  // Retreat data related to lodging
  lodging_state?: RetreatLodgingState
  selected_hotels: AdminSelectedHotelProposalModel[]
  lodging_final_start_date?: string
  lodging_final_end_date?: string
  lodging_final_destination?: string
  lodging_final_hotel_id?: number
  lodging_final_contract_notes?: string
  lodging_final_contract_url?: string

  // Retreat data related to flights
  attendees_state?: RetreatAttendeesState

  // Retreat data related to flights
  flights_state?: RetreatFlightsState

  // Retreat data related to itinerary
  itinerary_state?: RetreatItineraryState

  // Retreat links
  itinerary_first_draft_link?: string
  itinerary_final_draft_link?: string

  flights_travel_policies_link: string | null
  attendees_registration_form_id: string | null
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
  currency: string | null
  num_guests: string | null
  is_all_inclusive: boolean | null
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

export type AdminLodgingProposalUpdateModel = Partial<
  Omit<AdminLodgingProposalModel, "id" | "created_at">
>

export type AdminImageTagType =
  | "MEETING_ROOM"
  | "HOTEL_ROOM"
  | "HOTEL_EXTERIOR"
  | "DINING_AREA"
  | "COMMON_SPACE"
  | "MISCELLANEOUS"
export const AdminImageTagOptions = [
  "MEETING_ROOM",
  "HOTEL_ROOM",
  "HOTEL_EXTERIOR",
  "DINING_AREA",
  "COMMON_SPACE",
  "MISCELLANEOUS",
] as AdminImageTagType[]

export type AdminImageModel = {
  id: number
  image_url: string
  alt: string
  tag?: AdminImageTagType
}
export type AdminHotelDetailsModel = {
  id: number
  guid: string
  destination_id: number
  name: string
  template_proposal: AdminLodgingProposalModel | null
  description_short: string | null
  airport: string | null
  airport_travel_time: number | null
  imgs: AdminImageModel[]
  spotlight_img?: AdminImageModel
  website_url: string
  sub_location: string
}

export type AdminHotelModel = Pick<
  AdminHotelDetailsModel,
  "id" | "guid" | "name" | "destination_id"
>

export type AdminDestinationModel = {
  id: number
  guid: string
  location: string
  state?: string
  state_abbreviation?: string
  country?: string
  country_abbreviation?: string
}

// ATTENDEES
export type AdminTripLegModel = {
  airline: string | null
  dep_airport: string | null
  arr_airport: string | null
  flight_num: string | null
  dep_datetime: string | null
  arr_datetime: string | null
  duration: number | null // length in s
}

export type AdminRetreatTripModel = {
  confirmation_number: string | null
  trip_legs: AdminTripLegModel[]
  duration: number | null
}

export type AdminRetreatTravelModel = {
  cost: number | null
  dep_trip: AdminRetreatTripModel | null
  arr_trip: AdminRetreatTripModel | null
}

export type AdminRetreatAttendeeModel = {
  id: number
  email_address: string
  name: string | null
  travel: AdminRetreatTravelModel | null
  city: string | null
  dietary_prefs: string | null
  notes: string | null
  info_status: RetreatAttendeeInfoStatusType
  flight_status: RetreatAttendeeFlightStatusType
}

export type AdminRetreatAttendeeUpdateModel = Partial<AdminRetreatAttendeeModel>

export type RetreatAttendeeInfoStatusType = "CREATED" | "INFO_ENTERED"
export const RetreatAttendeeInfoStatusOptions = ["CREATED", "INFO_ENTERED"]

export type RetreatAttendeeFlightStatusType = "PENDING" | "BOOKED" | "OPT_OUT"
export const RetreatAttendeeFlightStatusOptions = [
  "PENDING",
  "BOOKED",
  "OPT_OUT",
]

export type RetreatNoteModel = {
  note: string
  created_at: string // date string
}

// TASKS
export type RetreatToTaskState = "TODO" | "COMPLETED" | "HIDDEN"
export const RetreatToTaskStateOptions = ["TODO", "COMPLETED", "HIDDEN"]

// This is the Jinja templated task
export type RetreatTask = {
  id: number
  title: string
  description?: string
  link?: string
}

export type RetreatToTask = {
  retreat_id: number
  task_id: number
  // Task fields (rendered)
  title: string
  description?: string
  link?: string
  // RetreatToTask fields
  order: number
  state: RetreatToTaskState
  due_date?: string
  task_vars: {[key: string]: string | null}
  task_template: RetreatTask
}
export type User = {
  id: number
  email: string
  first_name: string
  last_name: string
  created_at: string // datetime
  retreat_ids: number[]
}

/****************** Retreat states types (keep synced with models/retreat.tsx in flok) ******************/
export const OrderedRetreatIntakeState = [
  "SIGNED_UP",
  "INTAKE_CALL",
  "FOLLOW_UP",
  "NOT_MOVING_FORWARD",
  "INVOICED",
  "HANDOFF",
] as const
export type RetreatIntakeState = typeof OrderedRetreatIntakeState[number]

export const OrderedRetreatLodgingState = [
  "NOT_STARTED",
  "PROPOSALS",
  "CONTRACT",
  "HANDOFF",
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
] as const
export type RetreatItineraryState = typeof OrderedRetreatFlightsState[number]
/****************** End retreat states types ******************/
