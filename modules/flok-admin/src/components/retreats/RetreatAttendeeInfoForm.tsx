import {
  Box,
  Button,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {
  AdminRetreatAttendeeModel,
  RetreatAttendeeFlightStatusOptions,
  RetreatAttendeeInfoStatusOptions,
} from "../../models"
import {
  createRetreatAttendeeForm,
  putRetreatAttendees,
} from "../../store/actions/admin"
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
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
  },
}))

type RetreatAttendeeInfoFormProps = {attendee: AdminRetreatAttendeeModel}
export function RetreatAttendeeInfoForm(props: RetreatAttendeeInfoFormProps) {
  const showFlight = () => {}

  let {attendee} = props
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: createRetreatAttendeeForm(attendee),
    validate: (values) => {
      try {
        yup.string().required().email().validateSync(values.email_address)
      } catch (err) {
        return {contact_email: "Please enter a valid email."}
      }
      return {}
    },
    onSubmit: (values) => {
      dispatch(
        putRetreatAttendees(attendee.id, createRetreatAttendeeForm(values))
      )
    },
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }
  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Attendee Info</AppTypography>
        <TextField
          {...textFieldProps}
          id="name"
          value={formik.values.name ?? ""}
          label="Name"
        />
        <TextField
          {...textFieldProps}
          id="email_address"
          value={formik.values.email_address ?? ""}
          error={!!formik.errors.email_address}
          helperText={formik.errors.email_address}
          required
          label="Email"
        />
        <TextField
          {...textFieldProps}
          id="city"
          value={formik.values.city}
          label="City"
        />
        <TextField
          {...textFieldProps}
          id="dietaryPrefs"
          value={formik.values.dietary_prefs}
          label="Dietary Preferences"
          helperText="Enter preferences as comma-separated list"
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <TextField
          {...textFieldProps}
          id="notes"
          value={formik.values.notes}
          label="Other Notes"
          multiline
          maxRows={4}
        />
        <TextField
          {...textFieldProps}
          id="flightStatus"
          value={formik.values.flight_status}
          onChange={formik.handleChange}
          select
          SelectProps={{native: true}}
          label="Flight Status">
          {RetreatAttendeeFlightStatusOptions.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </TextField>
        <TextField
          {...textFieldProps}
          id="flightStatus"
          value={formik.values.info_status}
          onChange={formik.handleChange}
          select
          SelectProps={{native: true}}
          label="Information Entry Status">
          {RetreatAttendeeInfoStatusOptions.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </TextField>
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button
            disabled={!!!attendee.travel}
            variant="contained"
            color="primary"
            onClick={showFlight}>
            Show Flight Information
          </Button>
        </Box>
      </Paper>
    </form>
  )
}
