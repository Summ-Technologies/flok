// API endpoints

import {RetreatItemState, RetreatItemType} from "./retreat"

// GET v1.0/user/home, GET_USER_HOME_SUCCESS
export type UserHomeResponse = {
  user: UserModelApi
  company?: CompanyModelApi
  retreat?: RetreatModelApi
}

// GET v1.0/retreats/<id>
// POST v1.0/retreats/<id>/<item_id>
export type RetreatController = {
  retreat: RetreatModelApi
}

// User auth
export type UserAuthResponse = {
  user: UserModelApi
}

export type UserModelApi = {
  id: number
  email: string
  first_name?: string
  last_name?: string
}

// Company
export type CompanyModelApi = {
  id: number
  name?: string
}

// Retreat
export type RetreatModelApi = {
  id: number
  company_id: number
  name?: string
  retreat_items: RetreatToItemModelApi[]
}

export type RetreatToItemModelApi = {
  order: number
  retreat_id: number
  state: RetreatItemState
  data: any
  saved_data: any
  retreat_item: RetreatItemModelApi
}

export type RetreatItemModelApi = {
  id: number
  uid: string
  type: RetreatItemType
  data: any
  title: string
  subtitle?: string
}
