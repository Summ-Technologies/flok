import {Box, makeStyles, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import querystring from "querystring"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AuthForm from "../../components/forms/AuthForm"
import PageContainer from "../../components/page/PageContainer"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {AppRoutes} from "../../Stack"
import {ApiAction} from "../../store/actions/api"
import {getUserResetToken, postUserReset} from "../../store/actions/user"
import UserGetters from "../../store/getters/user"
import {apiToModel} from "../../utils/apiUtils"

let useStyles = makeStyles((theme) => ({
  modal: {
    maxWidth: 500,
    width: "90%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    display: "flex",
    boxShadow: theme.shadows[1],
    flexDirection: "column",
    justifyContent: "center",
  },
  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "baseline",
  },

  errorMessageText: {
    padding: theme.spacing(2),
  },
}))
export type AuthResetPageProps = RouteComponentProps<{
  next: string
}>
function AuthResetPage(props: AuthResetPageProps) {
  let dispatch = useDispatch()

  let {loginToken, next}: {loginToken: string; next: string} = apiToModel(
    querystring.parse(props.location.search)
  )
  let loginTokenUserEmail = useSelector(
    UserGetters.getUserForLoginToken(loginToken)
  )
  useEffect(() => {
    if (loginToken !== undefined && loginTokenUserEmail === undefined) {
      dispatch(getUserResetToken(loginToken))
    }
  }, [dispatch, loginToken, loginTokenUserEmail])

  async function submitForm(vals: {password: string}) {
    let authResponse = (await dispatch(
      postUserReset(loginToken, vals.password)
    )) as unknown as ApiAction
    if (!authResponse.error) {
      if (next) {
        dispatch(push(decodeURIComponent(next)))
      } else {
        dispatch(push(AppRoutes.getPath("RetreatHomePage", {retreatIdx: "0"})))
      }
    } else {
      dispatch(
        enqueueSnackbar(
          apiNotification(
            "Something went wrong.",
            (key) => dispatch(closeSnackbar(key)),
            true
          )
        )
      )
    }
  }
  let classes = useStyles(props)
  return (
    <PageContainer>
      <Box className={classes.body}>
        <Box className={classes.modal}>
          {loginTokenUserEmail !== undefined ? (
            <AuthForm
              submitForm={submitForm}
              submitText="Submit"
              prefilledEmail={loginTokenUserEmail}
              title="Set Your Password"
            />
          ) : (
            <Box>
              <Typography variant="h4" className={classes.errorMessageText}>
                Oops. Looks like we can't find your login token. Please try
                again.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </PageContainer>
  )
}
export default withRouter(AuthResetPage)
