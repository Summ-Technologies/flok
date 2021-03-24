import {RootState} from ".."

export default class UserGetters {
  static getLoginStatus(state: RootState) {
    return state.user.loginStatus
  }
  static getUserEmail(state: RootState) {
    return state.user.user ? state.user.user.email : undefined
  }
  static getUserFullName(state: RootState) {
    return state.user.user
      ? state.user.user.first_name + " " + state.user.user.last_name
      : undefined
  }
  static getUserForLoginToken(loginToken: string) {
    return (state: RootState) => {
      return state.user.auth.tokens[loginToken]
        ? state.user.auth.tokens[loginToken].email
        : undefined
    }
  }
}
