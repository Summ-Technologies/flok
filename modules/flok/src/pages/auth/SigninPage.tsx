import {makeStyles} from "@material-ui/core"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AuthForm from "../../components/forms/AuthForm"
import PageContainer from "../../components/page/PageContainer"
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
          />
        </div>
      </div>
    </PageContainer>
  )
}
export default withRouter(SigninPage)
