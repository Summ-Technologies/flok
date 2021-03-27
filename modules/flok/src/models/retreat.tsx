import {RetreatItemModelApi} from "./api"

export type RetreatModel = {
  id: number
  companyId: number
  name?: string
  retreatItems: RetreatToItemModel[]
  employeeLocationSubmission?: RetreatEmployeeLocationSubmission
  initialProposals: RetreatInitialProposal[]
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
  uid: string
  type: RetreatItemType
  data: any
  title: string
  subtitle?: string
}

export class RetreatItemModel {
  constructor(apiModel: RetreatItemModelApi) {
    this.id = apiModel.id
    this.uid = apiModel.uid
    this.data = apiModel.data
    this.title = apiModel.title
    this.subtitle = apiModel.subtitle
    this.type = apiModel.type
  }
}

export type RetreatEmployeeLocationItem = {
  id?: number
  submissionId?: number
  employeeCount?: number
  googlePlaceId: string
  mainText: string
  secondaryText: string
}

export type RetreatEmployeeLocationSubmission = {
  id?: number
  retreatId: number
  locationItems: RetreatEmployeeLocationItem[]
  createdAt?: string
  extraInfo?: string
}

export type RetreatEmployeeLocationDataModel = {
  submission: RetreatEmployeeLocationSubmission
}

export type RetreatInitialProposal = {
  id: number
  retreatId: number
  imageUrl: string
  title: string
  body: string
  datesRange: string
  numNightsEstimate: string
  flightTimeAvg: string
  weatherPrediction: string
  lodgingEstimate: string
  flightsEstimate: string
  transportationEstimate?: string
  miscEstimate?: string
  totalEstimate?: string
  extraInfo?: string
  createdAt: string
}
