// API endpoints

import {CompanyModel} from "./company"
import {RetreatModel} from "./retreat"
import {UserModel} from "./user"

// GET v1.0/user/home, GET_USER_HOME_SUCCESS
export type UserHomeResponse = {
  user: UserModel
  company?: CompanyModel
  retreat?: RetreatModel
}

// GET v1.0/retreats/<id>
// POST v1.0/retreats/<id>/<item_id>
export type RetreatResponse = {
  retreat: RetreatModel
}

// User auth
export type UserAuthResponse = {
  user: UserModel
}
