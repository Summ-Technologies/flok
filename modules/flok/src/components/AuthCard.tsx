import {
  Box,
  Button,
  Card,
  makeStyles,
  StandardProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {SyntheticEvent, useState} from "react"
import {Link} from "react-router-dom"
import {AppRoutes} from "../Stack"
import {RequestState} from "../store/reducers/api"
import {Form, FormUtils, TextFormField} from "../utils/formUtils"
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

export interface AuthForm
  extends Form<"email" | "password" | "confirmPassword"> {
  email: TextFormField<keyof AuthForm>
  password: TextFormField<keyof AuthForm>
  confirmPassword: TextFormField<keyof AuthForm>
}

interface AuthCardProps
  extends StandardProps<{}, "root" | "header" | "body" | "footer"> {
  authType: "signup" | "signin"
  submitAuthForm: () => void
  form: AuthForm
  setForm: (form: AuthForm) => void
  request: RequestState | undefined
}
export default function AuthCard(props: AuthCardProps) {
  const classes = useStyles()

  let [validateEmail, setValidateEmail] = useState(false)
  let [validatePassword, setValidatePassword] = useState(false)
  let [validateConfirmPw, setValidateConfirmPw] = useState(false)

  let authFormUtils = new FormUtils<keyof AuthForm>()

  function submitAuthForm(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    props.submitAuthForm()
  }

  function disableSubmit(): boolean {
    switch (props.authType) {
      case "signup":
        return !(
          props.form.email.validator(props.form.email.value, props.form) ===
            undefined &&
          props.form.password.validator(
            props.form.password.value,
            props.form
          ) === undefined &&
          props.form.confirmPassword.validator(
            props.form.confirmPassword.value,
            props.form
          ) === undefined
        )
      case "signin":
        return !(
          props.form.email.validator(props.form.email.value, props.form) ===
            undefined &&
          props.form.password.validator(
            props.form.password.value,
            props.form
          ) === undefined
        )
      default:
        return false
    }
  }

  const commonTextFieldProps: TextFieldProps = {
    variant: "outlined",
    fullWidth: true,
  }
  return (
    <Card className={classes.root}>
      <Box className={classes.header}>
        <AppLogo height={50} noBackground withText />
        <Typography variant="h6">Bring your team together (finally)</Typography>
      </Box>
      <form
        className={classes.body}
        autoComplete="off"
        onSubmit={submitAuthForm}>
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
          label="Email"
          type="email"
          {...commonTextFieldProps}
          required
          autoFocus
        />
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
          label="Password"
          type="password"
          {...commonTextFieldProps}
          required
        />
        {props.authType === "signup" ? (
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
            label="Confirm password"
            type="password"
            {...commonTextFieldProps}
            required
          />
        ) : undefined}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={disableSubmit()}>
          {props.authType === "signup" ? "Sign Up" : "Sign In"}
        </Button>
        <Typography variant="body2" color="error">
          {props.request && props.request.error
            ? props.request.errorText
              ? props.request.errorText
              : "There was an authentication error"
            : undefined}
        </Typography>
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
