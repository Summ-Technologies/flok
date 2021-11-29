import {ImageModel} from "."

export type UserModel = {
  id: number
  email: string
  firstName?: string
  lastName?: string
}

export type FlokInternalAdminModel = {
  id: number
  email: string
  first_name: string
  last_name?: string
  gender?: "M" | "F"
  avatar_img?: ImageModel
}
