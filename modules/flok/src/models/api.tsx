// API endpoints
import {FilterQuestionModel, FilterResponseModel} from "./retreat"
import {UserModel} from "./user"

// GET v1.0/user/home, GET_USER_HOME_SUCCESS
export type UserHomeResponse = {
  user: UserModel
}

// v1.0/auth/signin
export type UserAuthResponse = {
  user: UserModel
}

// GET/PUT v1.0/retreats/<guid>/filters
export type RetreatFiltersApiResponse = {
  retreat_filter_questions?: FilterQuestionModel[] // only included in GET request, not PUT
  retreat_filter_responses: FilterResponseModel[]
}
