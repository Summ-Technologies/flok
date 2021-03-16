import {RootState} from ".."

export default class ApiGetters {
  static getSignupRequest(state: RootState) {
    return state.api.auth.signup
  }
  static getSigninRequest(state: RootState) {
    return state.api.auth.signin
  }
}
