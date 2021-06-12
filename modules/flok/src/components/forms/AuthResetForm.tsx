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

const useStyles = makeStyles((theme) => ({
  root: {},
}))

export type AuthResetValues = {
  password: string
}

let AuthResetSchema = yup.object().shape({
  password: yup
    .string()
    .min(5, "Please enter a valid password")
    .required("Password is required"),
})

interface AuthCardProps
  extends StandardProps<{}, "root" | "header" | "body" | "footer"> {
  submitAuthReset: (values: AuthResetValues) => void
  prefilledEmail?: string
}
export default function AuthCard(props: AuthCardProps) {
  const classes = useStyles()
  let [showPassword, setShowPassword] = useState(false)
  let formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: AuthResetSchema,
    onSubmit: (values) => {
      props.submitAuthReset(values)
    },
    validateOnMount: true,
  })
  const commonTextFieldProps: TextFieldProps = {
    variant: "standard",
    fullWidth: true,
  }

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <TextField
        id="email"
        name="email"
        label="Email"
        disabled
        value={props.prefilledEmail}
        {...commonTextFieldProps}
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
        error={formik.touched.password && formik.errors.password ? true : false}
        helperText={formik.touched.password && formik.errors.password}
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
        disabled={formik.errors.password !== undefined}>
        Reset
      </Button>
    </form>
  )
}
