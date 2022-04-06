import {Box} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Route, RouteProps} from "react-router-dom"
import {RootState} from "../../store"
import {getUserHome} from "../../store/actions/user"
import LoadingPage from "./LoadingPage"
import RedirectPage from "./RedirectPage"

export default function ProtectedRoute(props: RouteProps) {
  let dispatch = useDispatch()
  let user = useSelector((state: RootState) => state.user.user)
  let loginStatus = useSelector((state: RootState) => state.user.loginStatus)
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      await dispatch(getUserHome())
      setLoading(false)
    }
    if (loginStatus === "UNKNOWN" || (loginStatus !== "LOGGED_OUT" && !user)) {
      loadUser()
    }
  }, [dispatch, loginStatus, setLoading, user])

  return loading ? (
    <LoadingPage />
  ) : loginStatus === "LOGGED_OUT" ? (
    <RedirectPage pageName="SigninPage" />
  ) : !user ? (
    <Box>Something went wrong.</Box>
  ) : (
    <Route {...props} />
  )
}
