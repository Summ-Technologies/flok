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

  static getRetreatProposals(
    state: RootState
  ): {[key: number]: RetreatProposal} {
    let retreat = RetreatGetters.getRetreat(state)
    let _ret: {[key: number]: RetreatProposal} = {}
    if (retreat) {
      retreat.proposals.forEach((proposal) => {
        _ret[proposal.id] = proposal
      })
    }
    return _ret
  }
}
