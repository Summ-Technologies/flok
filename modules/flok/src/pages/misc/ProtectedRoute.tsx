import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, RouteProps} from "react-router-dom"
import {RootState} from "../../store"
import {getUserHome} from "../../store/actions/user"
import LoadingPage from "./LoadingPage"
import RedirectPage from "./RedirectPage"

export default function ProtectedRoute(props: RouteProps) {
  let dispatch = useDispatch()
  let loginStatus = useSelector((state: RootState) => state.user.loginStatus)
  useEffect(() => {
    if (loginStatus === "UNKNOWN") {
      dispatch(getUserHome())
    }
  }, [dispatch, loginStatus])
  return loginStatus === "UNKNOWN" ? (
    <LoadingPage />
  ) : loginStatus === "LOGGED_OUT" ? (
    <RedirectPage pageName="SigninPage" />
  ) : (
    <Route {...props} />
  )
}
