import {
  Button,
  Link,
  makeStyles,
  StandardProps,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import {Link as RouterLink} from "react-router-dom"
import * as yup from "yup"
import {AppRoutes} from "../../Stack"
import AppLogo from "../base/AppLogo"
import AppPasswordTextField, {
  PasswordValidation,
} from "../base/AppPasswordTextField"
import AppTypography from "../base/AppTypography"

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(0.5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: -theme.spacing(1),
    "& > *": {
      marginTop: theme.spacing(1),
    },
  },
  submitRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}))

export type SigninFormValues = {
  email: string
  password: string
}

interface AuthCardProps
  extends StandardProps<{}, "root" | "header" | "body" | "footer"> {
  submitForm: (values: SigninFormValues) => void
  prefilledEmail?: string
  submitText: string
  title: string
  forgotPassword?: boolean
}
export default function AuthForm(props: AuthCardProps) {
  const classes = useStyles()

  const validator = {
    regex: props.prefilledEmail
      ? PasswordValidation.validationRegex
      : PasswordValidation.loginValidationRegex,
    errMessage: props.prefilledEmail
      ? PasswordValidation.errorMessage
      : PasswordValidation.loginErrorMessage,
  }
  let SigninFormSchema = yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .matches(validator.regex, validator.errMessage)
      .required("Enter a valid password"),
  })

  let formik = useFormik({
    initialValues: {
      email: props.prefilledEmail ? props.prefilledEmail : "",
      password: "",
    },
    validationSchema: SigninFormSchema,
    onSubmit: (values) => {
      props.submitForm(values)
    },
  })
  const commonTextFieldProps: TextFieldProps = {
    variant: "standard",
    fullWidth: true,
  }

  return (
    <>
      <div className={classes.title}>
        <AppLogo height={50} noBackground withText />
        <AppTypography variant="h3">{props.title}</AppTypography>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="email"
          name="email"
          label="Email"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email ? true : false}
          helperText={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : " "
          }
          {...commonTextFieldProps}
          disabled={props.prefilledEmail ? true : false}
        />
        <AppPasswordTextField
          id="password"
          name="password"
          label="Password"
          required
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            (formik.touched.password || props.prefilledEmail) &&
            formik.errors.password
              ? true
              : false
          }
          helperText={
            (formik.touched.password || props.prefilledEmail) &&
            formik.errors.password
              ? formik.errors.password
              : ""
          }
          {...commonTextFieldProps}
        />
        <div className={classes.submitRow}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{marginTop: 12}}>
            {props.submitText}
          </Button>
          {props.forgotPassword ? (
            <Link
              variant="body1"
              component={RouterLink}
              to={AppRoutes.getPath("ForgotPasswordPage")}>
              Forgot password?
            </Link>
          ) : undefined}
        </div>
      </form>
    </>
  )
}
