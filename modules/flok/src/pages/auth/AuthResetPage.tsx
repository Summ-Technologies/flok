import {Box, makeStyles} from "@material-ui/core"
import querysting from "querystring"
import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AuthForm from "../../components/forms/AuthForm"
import PageContainer from "../../components/page/PageContainer"
import {getUserResetToken, postUserReset} from "../../store/actions/user"
import UserGetters from "../../store/getters/user"
import {apiToModel} from "../../utils/apiUtils"

let useStyles = makeStyles((theme) => ({
  modal: {
    maxWidth: 500,
    maxHeight: 250,
    width: "90%",
    height: "90%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    "-webkit-box-shadow": "0 3px 7px rgba(0, 0, 0, 0.3)",
    "-moz-box-shadow": "0 3px 7px rgba(0, 0, 0, 0.3)",
    "box-shadow": "0 3px 7px rgba(0, 0, 0, 0.3)",
    "-webkit-background-clip": "padding-box",
    "-moz-background-clip": "padding-box",
    display: "flex",
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
    backgroundImage:
      'url("https://flok-b32d43c.s3.amazonaws.com/misc/flok-page-construction-background.svg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}))
export type AuthResetPageProps = RouteComponentProps<{}>
function AuthResetPage(props: AuthResetPageProps) {
  let dispatch = useDispatch()
  let {loginToken}: {loginToken: string} = apiToModel(
    querysting.parse(props.location.search)
  )
  let loginTokenUserEmail = useSelector(
    UserGetters.getUserForLoginToken(loginToken)
  )

  useEffect(() => {
    if (loginToken !== undefined && loginTokenUserEmail === undefined) {
      dispatch(getUserResetToken(loginToken))
    }
  }, [dispatch, loginToken, loginTokenUserEmail])

  function submitForm() {
    dispatch(postUserReset(loginToken, ""))
  }
  let classes = useStyles(props)
  return (
    <PageContainer>
      <Box className={classes.body}>
        <Box className={classes.modal}>
          <AuthForm
            submitForm={submitForm}
            submitText="Submit"
            prefilledEmail={loginTokenUserEmail ? loginTokenUserEmail : " "}
            title="Set Your Password"
          />
        </Box>
      </Box>
    </PageContainer>
  )
}
export default withRouter(AuthResetPage)
