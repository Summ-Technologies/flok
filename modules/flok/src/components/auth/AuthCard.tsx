import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  StandardProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {VisibilityOffRounded, VisibilityRounded} from "@material-ui/icons"
import {push} from "connected-react-router"
import {SyntheticEvent, useState} from "react"
import {useDispatch} from "react-redux"
import {AppRoutes} from "../../Stack"
import {RequestState} from "../../store/reducers/api"
import {Form, FormUtils, TextFormField} from "../../utils/formUtils"
import AppButton from "../base/AppButton"

const useStyles = makeStyles((theme) => ({
  root: {
    // size & spacing
    maxWidth: 450,
    marginLeft: "auto",
    marginRight: "auto",
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
    width: "100%",
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
  formNameRow: {
    "& > *:not(:last-child)": {
      paddingRight: theme.spacing(2),
    },
  },
  footer: {},
}))

export interface SigninForm extends Form<"email" | "password"> {
  email: TextFormField<keyof SigninForm>
  password: TextFormField<keyof SigninForm>
}

export interface SignupForm
  extends Form<"email" | "password" | "firstName" | "lastName"> {
  email: TextFormField<keyof SignupForm>
  password: TextFormField<keyof SignupForm>
  firstName: TextFormField<keyof SignupForm>
  lastName: TextFormField<keyof SignupForm>
}

interface AuthCardProps
  extends StandardProps<{}, "root" | "header" | "body" | "footer"> {
  authType: "signup" | "signin"
  signupForm: SignupForm
  setSignupForm: (form: SignupForm) => void
  signinForm: SigninForm
  setSigninForm: (form: SigninForm) => void
  submitAuthForm: () => void
  signupRequest: RequestState | undefined
  signinRequest: RequestState | undefined
}
export default function AuthCard(props: AuthCardProps) {
  const classes = useStyles()
  let dispatch = useDispatch()

  let [validateFirst, setValidateFirst] = useState(false)
  let [validateLast, setValidateLast] = useState(false)
  let [validateEmail, setValidateEmail] = useState(false)
  let [validatePassword, setValidatePassword] = useState(false)
  let [showPassword, setShowPassword] = useState(false)
  let form = props.authType === "signup" ? props.signupForm : props.signinForm
  let request =
    props.authType === "signup" ? props.signupRequest : props.signinRequest

  function submitAuthForm(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    props.submitAuthForm()
  }

  function getErrorTextProps(key: string) {
    if (props.authType === "signup") {
      let authFormUtils = new FormUtils<keyof SignupForm>()
      return authFormUtils.getTextErrorProps(
        props.signupForm,
        key as keyof SignupForm
      )
    } else {
      let authFormUtils = new FormUtils<keyof SigninForm>()
      return authFormUtils.getTextErrorProps(
        props.signinForm,
        key as keyof SigninForm
      )
    }
  }

  function _updateForm(key: string, value: string) {
    if (props.authType === "signup") {
      let updatedForm: SignupForm = {
        ...props.signupForm,
        [key as keyof SignupForm]: {
          ...props.signupForm[key as keyof SignupForm],
          value,
        },
      }
      props.setSignupForm(updatedForm)
    } else {
      let updatedForm: SigninForm = {
        ...props.signinForm,
        [key as keyof SigninForm]: {
          ...props.signinForm[key as keyof SigninForm],
          value,
        },
      }
      props.setSigninForm(updatedForm)
    }
  }

  function disableSubmit(): boolean {
    switch (props.authType) {
      case "signup":
        return !(
          props.signupForm.email.validator(
            props.signupForm.email.value,
            props.signupForm
          ) === undefined &&
          props.signupForm.password.validator(
            props.signupForm.password.value,
            props.signupForm
          ) === undefined &&
          props.signupForm.firstName.validator(
            props.signupForm.firstName.value,
            props.signupForm
          ) === undefined &&
          props.signupForm.lastName.validator(
            props.signupForm.lastName.value,
            props.signupForm
          ) === undefined
        )
      case "signin":
        return !(
          props.signinForm.email.validator(
            props.signinForm.email.value,
            props.signinForm
          ) === undefined &&
          props.signinForm.password.validator(
            props.signinForm.password.value,
            props.signinForm
          ) === undefined
        )
      default:
        return false
    }
  }

  const commonTextFieldProps: TextFieldProps = {
    variant: "standard",
    fullWidth: true,
  }
  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        {props.authType === "signup" ? (
          <>
            <Typography variant="h3">
              Bring your team together (finally)
            </Typography>
            <Typography variant="body1">
              Create your account and start building your team retreat
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h3">Welcome back!</Typography>
            <Typography variant="body1">Sign in</Typography>
          </>
        )}
      </Box>
      <form
        className={classes.body}
        autoComplete="off"
        onSubmit={submitAuthForm}>
        {props.authType === "signup" ? (
          <Grid container className={classes.formNameRow}>
            <Grid item xs={6}>
              <TextField
                value={props.signupForm.firstName.value}
                onChange={(e) => _updateForm("firstName", e.target.value)}
                onBlur={() => setValidateFirst(true)}
                {...(validateFirst ? getErrorTextProps("firstName") : {})}
                label="First name"
                type="text"
                {...commonTextFieldProps}
                required
                autoFocus
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={props.signupForm.lastName.value}
                onChange={(e) => _updateForm("lastName", e.target.value)}
                onBlur={() => setValidateLast(true)}
                {...(validateLast ? getErrorTextProps("lastName") : {})}
                label="Last name"
                type="text"
                {...commonTextFieldProps}
                required
              />
            </Grid>
          </Grid>
        ) : undefined}
        <TextField
          value={form.email.value}
          onChange={(e) => _updateForm("email", e.target.value)}
          onBlur={() => setValidateEmail(true)}
          {...(validateEmail ? getErrorTextProps("email") : {})}
          label="Email"
          type="email"
          {...commonTextFieldProps}
          required
          autoFocus={props.authType === "signin"}
        />
        <TextField
          value={form.password.value}
          onChange={(e) => _updateForm("password", e.target.value)}
          onBlur={() => setValidatePassword(true)}
          {...(validatePassword ? getErrorTextProps("password") : {})}
          label="Password"
          type={showPassword ? "text" : "password"}
          {...commonTextFieldProps}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <VisibilityRounded />
                  ) : (
                    <VisibilityOffRounded />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" justifyContent="flex-end">
          <AppButton
            type="submit"
            variant="contained"
            color="primary"
            width={150}
            disabled={disableSubmit()}>
            {props.authType === "signup" ? "Sign Up" : "Sign In"}
          </AppButton>
        </Box>
        <Typography variant="body2" color="error" align="right">
          {request && request.error
            ? request.errorText
              ? request.errorText
              : "There was an authentication error"
            : undefined}
        </Typography>
        {props.authType === "signup" ? (
          <Typography variant="body2" align="right">
            By signing up you agree to our <Link href="/">User Agreement</Link>{" "}
            & <Link href="/">Privacy Policy</Link>
          </Typography>
        ) : undefined}
      </form>
      <Box className={classes.footer}>
        {props.authType === "signup" ? (
          <Typography variant="body1" align="right">
            Already have an account?{" "}
            <Link
              href="#"
              onClick={(e: SyntheticEvent) => {
                e.preventDefault()
                dispatch(push(AppRoutes.getPath("SigninPage")))
              }}>
              Sign in
            </Link>
          </Typography>
        ) : (
          <Typography variant="body1" align="right">
            Don't have an account?{" "}
            <Link
              href="#"
              onClick={(e: SyntheticEvent) => {
                e.preventDefault()
                dispatch(push(AppRoutes.getPath("SignupPage")))
              }}>
              Sign up
            </Link>
          </Typography>
        )}
      </Box>
    </Box>
  )
}
