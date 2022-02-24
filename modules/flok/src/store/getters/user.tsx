import {RootState} from ".."

export default class UserGetters {
  static getActiveUser(state: RootState) {
    return state.user.user
  }
  static getLoginStatus(state: RootState) {
    return state.user.loginStatus
  }
  static getUserEmail(state: RootState) {
    return state.user.user ? state.user.user.email : undefined
  }
  static getUserForLoginToken(loginToken: string) {
    return (state: RootState) => {
      return state.user.auth.tokens[loginToken]
        ? state.user.auth.tokens[loginToken].email
        : undefined
    }
  }
}
