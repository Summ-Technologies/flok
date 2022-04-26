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

export type RetreatProgressState = // Deprecated

    | "INTAKE_1"
    | "INTAKE_2"
    | "FILTER_SELECT"
    | "DESTINATION_SELECT"
    | "HOTEL_SELECT"
    | "PROPOSAL"
    | "PROPOSAL_READY"

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
export type RetreatItineraryState = typeof OrderedRetreatItineraryState[number]
/****************** End retreat states types ******************/

export type RetreatToTaskState = "TODO" | "COMPLETED" | "HIDDEN"

export type RetreatToTask = {
  task_id: number
  order: number
  state: RetreatToTaskState
  due_date?: string
  title: string
  description?: string
  link?: string
  is_flok_task?: boolean
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

  // Other documents
  faq_link: string
  budget_link: string

  tasks_todo: RetreatToTask[]
  tasks_completed: RetreatToTask[]

  //Retreat itinerary links
  itinerary_first_draft_link?: string
  itinerary_final_draft_link?: string
}

export type RetreatTripModel = {
  id: number
  cost: number
  duration: number
  confirmation_number: string
  trip_legs: RetreatTripLeg[]
}

// aka flight
export type RetreatTripLeg = {
  trip_id: number
  airline?: string
  dep_airport?: string
  dep_datetime?: string
  arr_airport?: string
  arr_datetime?: string
  flight_num?: string
  duration?: number // number of minutes
}

export type RetreatTravelModel = {
  id: number
  cost: number
  dep_trip?: RetreatTripModel
  arr_trip?: RetreatTripModel
  email_address: string
  name: string
}

export type RetreatAttendeeModel = {
  id: number
  email_address: string
  name: string
  travel?: RetreatTravelModel
  city?: string
  dietary_prefs: string
  notes: string
  info_status: string
  flight_status: "PENDING" | "OPT_OUT" | "BOOKED"
  hotel_check_in?: string // iso date string
  hotel_check_out?: string // iso date string
}

export const SampleLockedAttendees = [
  {
    dietary_prefs: "Vegan",
    info_status: "INFO_ENTERED",
    name: "Eli Manning",
    id: 1,
    notes: "Says they are vegan but not really",
    city: "New York",
    flight_status: "BOOKED",
    hotel_check_in: "2022-04-21",
    hotel_check_out: "2022-04-25",
    travel: {
      id: 1,
      cost: 450,
      arr_trip: {
        id: 1,
        cost: 250,
        confirmation_number: 12345,
        trip_legs: [
          {
            trip_id: 1,
            airline: "Jet Blue",
            dep_airport: "LGA",
            dep_datetime: "2022-04-07T13:33:14.195Z",
            arr_airport: "LAX",
            arr_datetime: "2022-04-06T13:33:14.195Z",
            flight_num: "967",
            duration: "300",
          },
        ],
      },
      dep_trip: {
        id: 1,
        cost: 250,
        confirmation_number: 12345,
        trip_legs: [
          {
            trip_id: 1,
            airline: "Jet Blue",
            dep_airport: "LGA",
            dep_datetime: "2022-04-10T13:33:14.195Z",
            arr_airport: "LAX",
            arr_datetime: "2022-04-06T13:33:14.195Z",
            flight_num: "967",
            duration: "300",
          },
        ],
      },
    },
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Vegan",
    info_status: "CREATED",
    name: "Tiki Barber",
    id: 1,
    travel: undefined,
    notes: "",
    city: "New York",
    flight_status: "OPT_OUT",
    email_address: "tp@123.com",
    hotel_check_in: "2022-04-21",
    hotel_check_out: "2022-04-25",
  },
  {
    dietary_prefs: "Paleo",
    info_status: "INFO_ADDED",
    name: "Jeremy Shockey",
    id: 1,
    hotel_check_in: "2022-04-21",
    hotel_check_out: "2022-04-25",
    travel: {
      id: 1,
      cost: 400,
      arr_trip: {
        id: 1,
        cost: 250,
        confirmation_number: 12345,
        trip_legs: [
          {
            trip_id: 1,
            airline: "Jet Blue",
            dep_airport: "LGA",
            dep_datetime: "2022-04-05T18:31:27.963Z",
            arr_airport: "LAX",
            arr_datetime: "2022-04-06T15:25:14.195Z",
            flight_num: "967",
            duration: "300",
          },
        ],
      },
      dep_trip: {
        id: 1,
        cost: 250,
        confirmation_number: 12345,
        trip_legs: [
          {
            trip_id: 1,
            airline: "Jet Blue",
            dep_airport: "LGA",
            dep_datetime: "2022-04-10T13:33:14.195Z",
            arr_airport: "LAX",
            arr_datetime: "2022-04-06T13:33:14.195Z",
            flight_num: "967",
            duration: "300",
          },
        ],
      },
    },
    notes: "",
    city: "New York",
    flight_status: "BOOKED",
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Vegan",
    info_status: "INFO_ENTERED",
    name: "Kevin Boss",
    id: 1,
    travel: {
      id: 1,
      cost: 325,
      arr_trip: {
        id: 1,
        cost: 250,
        confirmation_number: 12345,
        trip_legs: [
          {
            trip_id: 1,
            airline: "Jet Blue",
            dep_airport: "LGA",
            dep_datetime: "2022-04-05T18:31:27.963Z",
            arr_airport: "LAX",
            arr_datetime: "2022-04-06T13:33:14.195Z",
            flight_num: "967",
            duration: "300",
          },
        ],
      },
      dep_trip: {
        id: 1,
        cost: 250,
        confirmation_number: 12345,
        trip_legs: [
          {
            trip_id: 1,
            airline: "Jet Blue",
            dep_airport: "LGA",
            dep_datetime: "2022-04-10T13:33:14.195Z",
            arr_airport: "LAX",
            arr_datetime: "2022-04-06T13:33:14.195Z",
            flight_num: "967",
            duration: "300",
          },
        ],
      },
    },
    notes: "Says they are vegan but not really",
    city: "New York",
    flight_status: "BOOKED",
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Kosher",
    info_status: "CREATED",
    name: "Plaxico Burress",
    id: 1,
    travel: undefined,
    notes: "",
    city: "New York",
    flight_status: "PENDING",
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Paleo",
    info_status: "INFO_ADDED",
    name: "Amani Toomer",
    id: 1,
    travel: undefined,
    notes: "",
    city: "New York",
    flight_status: "OPT_OUT",
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Vegan",
    info_status: "INFO_ENTERED",
    name: "Ahmad Bradshaw",
    id: 1,
    travel: undefined,
    notes: "Says they are vegan but not really",
    city: "New York",
    flight_status: "PENDING",
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Vegetarian",
    info_status: "CREATED",
    name: "Brandon Jacobs",
    id: 1,
    travel: undefined,
    notes: "",
    city: "New York",
    flight_status: "PENDING",
    email_address: "tp@123.com",
  },
  {
    dietary_prefs: "Paleo",
    info_status: "INFO_ADDED",
    name: "Mario Manningham",
    id: 1,
    travel: undefined,
    notes: "",
    city: "New York",
    flight_status: "PENDING",
    email_address: "tp@123.com",
  },
] as RetreatAttendeeModel[]
