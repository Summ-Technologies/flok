import {RootState} from ".."
import {CompanyModel} from "../../models/company"

export default class CompanyGetters {
  static getCompany(state: RootState): CompanyModel | void {
    return Object.values(state.company.companies).length
      ? Object.values(state.company.companies)[0]
      : undefined
  }
}
