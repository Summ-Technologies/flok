import {
  Box,
  Button,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import React from "react"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {postRetreatAttendee} from "../../store/actions/admin"
import {ApiAction} from "../../store/actions/api"
import {nullifyEmptyString} from "../../utils"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: -theme.spacing(2),
    marginLeft: -theme.spacing(2),
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      padding: theme.spacing(2),
    },
  },
  formGroup: {
    overflowY: "scroll",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
  },
}))

type NewRetreatAttendeeFormProps = {
  retreatId: number
  onSuccess?: () => void
}
export default function NewRetreatAttendeeForm(
  props: NewRetreatAttendeeFormProps
) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let formik = useFormik({
    initialValues: {
      email_address: "",
      first_name: "",
      last_name: "",
    },
    onSubmit: (values) => {
      async function postAttendee() {
        let response = (await dispatch(
          postRetreatAttendee(props.retreatId, nullifyEmptyString(values))
        )) as unknown as ApiAction
        if (!response.error && props.onSuccess) {
          props.onSuccess()
        }
      }
      postAttendee()
    },
    validate: (values) => {
      try {
        yup.string().required().email().validateSync(values.email_address)
      } catch (err) {
        return {email_address: "Please enter a valid email."}
      }
      return {}
    },
    enableReinitialize: true,
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Create new attendee</AppTypography>
        <TextField
          {...textFieldProps}
          id="first_name"
          value={formik.values.first_name ?? ""}
          label="First Name"
          required
        />
        <TextField
          {...textFieldProps}
          id="last_name"
          value={formik.values.last_name ?? ""}
          label="Last Name"
          required
        />
        <TextField
          {...textFieldProps}
          id="email_address"
          value={formik.values.email_address}
          error={!!formik.errors.email_address}
          helperText={formik.errors.email_address}
          required
          label="Email"
        />
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button
            disabled={_.isEqual(
              nullifyEmptyString(formik.initialValues),
              nullifyEmptyString(formik.values)
            )}
            type="submit"
            variant="contained"
            color="primary">
            Create attendee
          </Button>
        </Box>
      </Paper>
    </form>
  )
}
