import {
  Button,
  IconButton,
  InputAdornment,
  makeStyles,
  StandardProps,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {VisibilityOffRounded, VisibilityRounded} from "@material-ui/icons"
import {useFormik} from "formik"
import {useState} from "react"
import * as yup from "yup"
import AppTypography from "../base/AppTypography"

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(0.5),
  },
}))

export type SigninFormValues = {
  email: string
  password: string
}

let SigninFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(3, "Please enter a valid password")
    .required("Password is required"),
})

interface AuthCardProps
  extends StandardProps<{}, "root" | "header" | "body" | "footer"> {
  submitForm: (values: SigninFormValues) => void
  prefilledEmail?: string
  submitText: string
  title: string
}
export default function AuthForm(props: AuthCardProps) {
  const classes = useStyles()
  let [showPassword, setShowPassword] = useState(false)
  let formik = useFormik({
    initialValues: {
      email: props.prefilledEmail ? props.prefilledEmail : "",
      password: "",
    },
    validationSchema: SigninFormSchema,
    onSubmit: (values) => {
      props.submitForm(values)
    },
    validateOnMount: true,
  })
  const commonTextFieldProps: TextFieldProps = {
    variant: "standard",
    fullWidth: true,
  }

  return (
    <>
      <AppTypography className={classes.title} variant="h1">
        {props.title}
      </AppTypography>
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
        <TextField
          id="password"
          name="password"
          label="Password"
          required
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.password && formik.errors.password ? true : false
          }
          helperText={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : " "
          }
          {...commonTextFieldProps}
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            formik.errors.email !== undefined ||
            formik.errors.password !== undefined
          }
          style={{marginTop: 12}}>
          {props.submitText}
        </Button>
      </form>
    </>
  )
}
