import {Link, makeStyles} from "@material-ui/core"
import {useDispatch} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../../components/base/AppTypography"
import AuthForm from "../../components/forms/AuthForm"
import PageContainer from "../../components/page/PageContainer"
import {AppRoutes} from "../../Stack"
import {postUserSignin} from "../../store/actions/user"

let useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: theme.spacing(1),
    maxWidth: 500,
    width: "90%",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    textAlign: "center",
  },
  modal: {
    maxWidth: 500,
    maxHeight: 250,
    width: "90%",
    height: "90%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
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
  let dispatch = useDispatch()
  const handleLogin = (vals: {email: string; password: string}) => {
    dispatch(postUserSignin(vals.email, vals.password))
  }
  return (
    <PageContainer>
      <div className={classes.body}>
        <div className={classes.modal}>
          <AuthForm
            submitForm={handleLogin}
            submitText="Login"
            title="Good To See You"
            forgotPassword
          />
        </div>
        <div className={classes.footer}>
          <AppTypography variant="body1">
            <Link
              color="inherit"
              underline="always"
              to={AppRoutes.getPath("DeprecatedNewRetreatFormPage")}
              component={ReactRouterLink}>
              Don't have an account?
            </Link>
          </AppTypography>
        </div>
      </div>
    </PageContainer>
  )
}
export default withRouter(SigninPage)
