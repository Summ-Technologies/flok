// API endpoints
import {RetreatAttendeeModel, RetreatTripModel} from "./retreat"
import {UserModel} from "./user"

// GET v1.0/user/home, GET_USER_HOME_SUCCESS
export type UserHomeResponse = {
  user: UserModel
}

// v1.0/auth/signin
export type UserAuthResponse = {
  user: UserModel
}

export type RetreatAttendeesApiResponse = {
  message: string
  attendees: RetreatAttendeeModel[]
}
export type AttendeeApiResponse = {
  attendee: RetreatAttendeeModel
}
export type TripsApiResponse = {
  trips: RetreatTripModel[]
}
export type TripApiResponse = {
  trip: RetreatTripModel
}
