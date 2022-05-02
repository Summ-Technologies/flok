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
import AppLogo from "../../components/base/AppLogo"
import AppTypography from "../../components/base/AppTypography"
import PageContainer from "../../components/page/PageContainer"
import {closeSnackbar, enqueueSnackbar} from "../../notistack-lib/actions"
import {apiNotification} from "../../notistack-lib/utils"
import {AppRoutes} from "../../Stack"
import {ApiAction} from "../../store/actions/api"
import {postForgotPassword} from "../../store/actions/user"
import {theme} from "../../theme"

let useStyles = makeStyles((theme) => ({
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
  footer: {
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    textAlign: "center",
  },
  modal: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    boxShadow: theme.shadows[1],
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "auto",
    maxWidth: 500,
    width: "90%",
    textAlign: "center",
  },
  modalFooterContainer: {
    margin: "auto",
    maxWidth: 500,
    width: "90%",
  },
  body: {
    overflow: "auto",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },

  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    onSubmit: async (values) => {
      let forgotPwResponse = (await dispatch(
        postForgotPassword(values.email)
      )) as unknown as ApiAction
      if (forgotPwResponse.error) {
        dispatch(
          enqueueSnackbar(
            apiNotification(
              "Something went wrong",
              (key) => dispatch(closeSnackbar(key)),
              true
            )
          )
        )
      } else {
        setSubmitted(true)
      }
    },
    validateOnMount: true,
  })
  let classes = useStyles(props)
  return (
    <PageContainer>
      <Box className={classes.body}>
        <Box className={classes.modal}>
          <div className={classes.title}>
            <AppLogo height={50} noBackground withText />
            <AppTypography variant="h3">Trouble Logging In?</AppTypography>
          </div>
          {submitted ? (
            <AppTypography
              variant="body2"
              style={{flexGrow: 2, minHeight: 100}}>
              If there is a user matching that email address you should receive
              an email shortly.
            </AppTypography>
          ) : (
            <>
              <AppTypography variant="body2">
                Enter your email below and we'll send you a link to get back
                into your account.
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
