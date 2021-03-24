import {RootState} from ".."

export default class ApiGetters {
  static getSignupRequest(state: RootState) {
    return state.api.auth.signup
  }
  static getSigninRequest(state: RootState) {
    return state.api.auth.signin
  }
  static getAuthResetTokenRequest(loginToken: string) {
    return (state: RootState) => state.api.auth.resetTokens[loginToken]
  }
}
