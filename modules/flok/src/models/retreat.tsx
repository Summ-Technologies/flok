export type RetreatModel = {
  id: number
  companyId: number
  name?: string
  employeeLocationSubmission?: RetreatEmployeeLocationSubmission
  proposals: RetreatProposal[]
  flokNote?: string
  selectedProposalId?: number
  numEmployees: number
  numNights: number
}

export type RetreatEmployeeLocationItem = {
  id: number
  submissionId: number
  employeeCount: number
  googlePlaceId: string
  mainText: string
  secondaryText: string
}

export type RetreatEmployeeLocationSubmission = {
  id: number
  retreatId: number
  locationItems: RetreatEmployeeLocationItem[]
  createdAt?: string
  extraInfo?: string
}

export type RetreatEmployeeLocationDataModel = {
  submission: RetreatEmployeeLocationSubmission
}

export type RetreatProposal = {
  id: number
  retreatId: number
  imageUrl: string
  title: string
  body?: string
  flightTimeAvg: string
  lodgingCost: number
  flightsCost: number
  otherCost: number
  extraInfo?: string

  createdAt: string
}
