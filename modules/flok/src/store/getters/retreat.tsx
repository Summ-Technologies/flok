import {RootState} from ".."
import {
  RetreatEmployeeLocationSubmission,
  RetreatInitialProposal,
  RetreatModel,
  RetreatToItemModel,
} from "../../models/retreat"

export default class RetreatGetters {
  static getRetreat(state: RootState): RetreatModel | void {
    return Object.values(state.retreat.retreats).length
      ? Object.values(state.retreat.retreats)[0]
      : undefined
  }

  static getInProgressItem(state: RootState): RetreatToItemModel | void {
    let retreat = RetreatGetters.getRetreat(state)
    let inProgressItems =
      retreat && retreat.retreatItems
        ? retreat.retreatItems.filter((item) => item.state === "IN_PROGRESS")
        : []
    return inProgressItems.length ? inProgressItems[0] : undefined
  }

  static getEmployeeLocationSubmission(
    state: RootState
  ): RetreatEmployeeLocationSubmission | void {
    let retreat = RetreatGetters.getRetreat(state)
    return retreat ? retreat.employeeLocationSubmission : undefined
  }

  static getRetreatInitialProposals(
    state: RootState
  ): RetreatInitialProposal[] {
    let retreat = RetreatGetters.getRetreat(state)
    return retreat ? retreat.initialProposals : []
  }
}
