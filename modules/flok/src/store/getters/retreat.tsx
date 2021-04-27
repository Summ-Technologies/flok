import {RootState} from ".."
import {
  RetreatEmployeeLocationSubmission,
  RetreatModel,
  RetreatProposal,
} from "../../models/retreat"

export default class RetreatGetters {
  static getRetreat(state: RootState): RetreatModel | void {
    return Object.values(state.retreat.retreats).length
      ? Object.values(state.retreat.retreats)[0]
      : undefined
  }

  static getEmployeeLocationSubmission(
    state: RootState
  ): RetreatEmployeeLocationSubmission | void {
    let retreat = RetreatGetters.getRetreat(state)
    return retreat ? retreat.employeeLocationSubmission : undefined
  }

  static getRetreatInitialProposals(state: RootState): RetreatProposal[] {
    let retreat = RetreatGetters.getRetreat(state)
    return retreat ? retreat.proposals : []
  }
}
