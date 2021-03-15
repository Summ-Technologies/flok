import {
  Box,
  Button,
  Card,
  makeStyles,
  StandardProps,
  TextField,
  Typography,
} from "@material-ui/core"
import {useState} from "react"
import {Link} from "react-router-dom"
import {AppRoutes} from "../Stack"
import {Form, FormUtils} from "../utils/formUtils"
import AppLogo from "./AppLogo"

const useStyles = makeStyles((theme) => ({
  root: {
    // size & spacing
    width: 450,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
  header: {},
  body: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
  footer: {},
}))

export type AuthForm = Form<"email" | "password" | "confirmPassword">
interface AuthCardProps
  extends StandardProps<{}, "root" | "header" | "body" | "footer"> {
  authType: "signup" | "signin"
  form: AuthForm
  setForm: (form: AuthForm) => void
  formError: string
  setFormError: (val: string) => void
}
export default function AuthCard(props: AuthCardProps) {
  const classes = useStyles()
  let authFormUtils = new FormUtils<keyof AuthForm>()

  let [validateEmail, setValidateEmail] = useState(false)
  let [validatePassword, setValidatePassword] = useState(false)
  let [validateConfirmPw, setValidateConfirmPw] = useState(false)

  var EmailInput = (
    <TextField
      value={props.form.email.value}
      onChange={(e) =>
        props.setForm({
          ...props.form,
          email: {...props.form.email, value: e.target.value},
        })
      }
      onBlur={() => setValidateEmail(true)}
      {...(validateEmail
        ? authFormUtils.getTextErrorProps(props.form, "email")
        : {})}
      variant="standard"
      label="Email"
      type="email"
      fullWidth
      required
      autoFocus
    />
  )

  var PasswordInput = (
    <TextField
      value={props.form.password.value}
      onChange={(e) =>
        props.setForm({
          ...props.form,
          password: {...props.form.password, value: e.target.value},
        })
      }
      onBlur={() => setValidatePassword(true)}
      {...(validatePassword
        ? authFormUtils.getTextErrorProps(props.form, "password")
        : {})}
      variant="standard"
      label="Password"
      type="password"
      fullWidth
      required
    />
  )

  var ConfirmPasswordInput =
    props.authType === "signup" ? (
      <TextField
        value={props.form.confirmPassword.value}
        onChange={(e) =>
          props.setForm({
            ...props.form,
            confirmPassword: {
              ...props.form.confirmPassword,
              value: e.target.value,
            },
          })
        }
        onFocus={() => setValidateConfirmPw(true)}
        {...(validateConfirmPw
          ? authFormUtils.getTextErrorProps(props.form, "confirmPassword")
          : {})}
        variant="standard"
        label="Confirm password"
        type="password"
        fullWidth
        required
      />
    ) : undefined

  var AuthButton = (
    <Button type="submit" variant="contained" color="primary">
      {props.authType === "signup" ? "Sign Up" : "Sign In"}
    </Button>
  )

  var FormError = (
    <Typography variant="body2" color="error">
      {props.formError}
    </Typography>
  )

  return (
    <Card className={classes.root}>
      <Box className={classes.header}>
        <AppLogo height={50} noBackground withText />
        <Typography variant="h6">Bring your team together (finally)</Typography>
      </Box>
      <form className={classes.body} autoComplete="off">
        {EmailInput}
        {PasswordInput}
        {ConfirmPasswordInput}
        {FormError}
        {AuthButton}
      </form>
      <Box className={classes.footer}>
        {props.authType === "signup" ? (
          <>
            <Typography variant="body1">
              Already have an account?{" "}
              <Link to={AppRoutes.getPath("SigninPage")}>Sign in</Link>
            </Typography>
            <Typography variant="body1">
              By signing up you agree to our <Link to="/">User Agreement</Link>{" "}
              & <Link to="/">Privacy Policy</Link>
            </Typography>
          </>
        ) : (
          <Typography variant="body1">
            Don't have an account?{" "}
            <Link to={AppRoutes.getPath("SignupPage")}>Sign up</Link>
          </Typography>
        )}
      </Box>
    </Card>
  )
}
