import {RetreatProposal} from "../models/retreat"

export class RetreatUtils {
  /**
   * Get the total estimate for a retreat given number of
   *  employees, number of nights, and a retreat proposal.
   */
  static getProposalEstimate(
    proposal: RetreatProposal,
    numEmployees: number,
    numNights: number
  ): number {
    let flightsTotal = proposal.flightsCost * numEmployees
    let lodgingTotal = proposal.lodgingCost * numNights * numEmployees
    let otherTotal = proposal.otherCost * numEmployees
    return flightsTotal + lodgingTotal + otherTotal
  }
}
