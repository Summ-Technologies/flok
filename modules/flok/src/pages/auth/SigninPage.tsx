import {Box, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AuthForm from "../../components/forms/AuthForm"
import PageContainer from "../../components/page/PageContainer"
import {AppRoutes} from "../../Stack"
import {RootState} from "../../store"
import {postUserSignin} from "../../store/actions/user"

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

type SigninPageProps = RouteComponentProps<{}>
function SigninPage(props: SigninPageProps) {
  let classes = useStyles(props)
  let loginStatus = useSelector((state: RootState) => state.user.loginStatus)
  console.log(loginStatus)
  let dispatch = useDispatch()
  useEffect(() => {
    if (loginStatus === "LOGGED_IN") {
      dispatch(push(AppRoutes.getPath("RetreatRoutingPage")))
    }
  }, [dispatch, loginStatus])
  const handleLogin = (vals: {email: string; password: string}) => {
    dispatch(postUserSignin(vals.email, vals.password))
  }
  return (
    <PageContainer>
      <Box className={classes.body}>
        <Box className={classes.modal}>
          <AuthForm
            submitForm={handleLogin}
            submitText="Login"
            title="Good To See You"
          />
        </Box>
      </Box>
    </PageContainer>
  )
}
export default withRouter(SigninPage)
