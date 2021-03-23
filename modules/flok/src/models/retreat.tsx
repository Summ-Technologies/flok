import {RetreatItemModelApi} from "./api"

export type RetreatModel = {
  id: number
  companyId: number
  name?: string
  retreatItems: RetreatToItemModel[]
}

export type RetreatItemState = "TODO" | "DONE" | "IN_PROGRESS"

export interface RetreatToItemModel {
  order: number
  retreatId: number
  state: RetreatItemState
  data: any
  savedData: any
  retreatItem: RetreatItemModel
}

export type RetreatItemType =
  | "INTAKE_CALL"
  | "EMPLOYEE_LOCATIONS"
  | "INITIAL_PROPOSALS"
  | "DESTINATION_SELECTION"
  | "POST_PAYMENT"

export interface RetreatItemModel {
  id: number
  type: RetreatItemType
  data: any
  title: string
  subtitle?: string
}

export class RetreatItemModel {
  constructor(apiModel: RetreatItemModelApi) {
    this.id = apiModel.id
    this.data = apiModel.data
    this.title = apiModel.title
    this.subtitle = apiModel.subtitle
    this.type = apiModel.type
  }
}
