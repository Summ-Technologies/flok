// API endpoints
import {UserModel} from "./user"
import { RfpLiteRequestModel } from "./rfpLiteRequest"

// GET v1.0/user/home, GET_USER_HOME_SUCCESS
export type UserHomeResponse = {
  user: UserModel
}

// v1.0/auth/signin
export type UserAuthResponse = {
  user: UserModel
}

// v1.0/lodging/rfp-lite-requests/:id
export type RfpLiteRequestResponse = {
  request: RfpLiteRequestModel
}