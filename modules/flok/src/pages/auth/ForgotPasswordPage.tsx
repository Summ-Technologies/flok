import {Box, Button, Link, makeStyles, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import React, {useState} from "react"
import {useDispatch} from "react-redux"
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import * as yup from "yup"
import AppTypography from "../../components/base/AppTypography"
import PageContainer from "../../components/page/PageContainer"
import {AppRoutes} from "../../Stack"
import {postForgotPassword} from "../../store/actions/user"
import {theme} from "../../theme"

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
    justifyContent: "space-between",
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
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
}))

let validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
})
export type AuthResetPageProps = RouteComponentProps<{}>
function AuthResetPage(props: AuthResetPageProps) {
  let dispatch = useDispatch()

  let [submitted, setSubmitted] = useState(false)

  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(postForgotPassword(values.email))
      setSubmitted(true)
      console.log(submitted)
    },
    validateOnMount: true,
  })
  let classes = useStyles(props)
  return (
    <PageContainer>
      <Box className={classes.body}>
        <Box className={classes.modal}>
          <AppTypography
            variant="h1"
            style={{marginBottom: theme.spacing(0.5)}}>
            Trouble Logging In?
          </AppTypography>
          {submitted ? (
            <AppTypography variant="body2" style={{flexGrow: 2}}>
              If there is a user matching that email address you shuld receive
              an email shortly.
            </AppTypography>
          ) : (
            <>
              <AppTypography variant="body1">
                Enter your email below and we'll send a link to get back into
                your account.
              </AppTypography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  helperText={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : " "
                  }
                />
                <div className={classes.buttons}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!!formik.errors.email}>
                    Submit
                  </Button>
                  <Link
                    style={{marginLeft: theme.spacing(0.5)}}
                    variant="body1"
                    underline="always"
                    component={RouterLink}
                    to={AppRoutes.getPath("SigninPage")}>
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          )}
        </Box>
      </Box>
    </PageContainer>
  )
}
export default withRouter(AuthResetPage)
