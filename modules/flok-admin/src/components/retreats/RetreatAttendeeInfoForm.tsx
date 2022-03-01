import {
  Box,
  Button,
  Collapse,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import {useState} from "react"
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
import {theme} from "../../theme"
import AppTypography from "../base/AppTypography"
import RetreatTravelView from "./RetreatTravelView"

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

type RetreatAttendeeInfoFormProps = {
  attendee: AdminRetreatAttendeeModel
  onBack: () => void
}
export function RetreatAttendeeInfoForm(props: RetreatAttendeeInfoFormProps) {
  let {attendee} = props
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let [showFlight, setShowFlight] = useState(false)

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
    <>
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
            id="dietary_prefs"
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
            id="flight_status"
            value={formik.values.flight_status}
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
            id="info_status"
            value={formik.values.info_status}
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
              onClick={() => setShowFlight(!showFlight)}>
              {showFlight
                ? "Hide flight information"
                : "Show flight information"}
            </Button>
          </Box>
        </Paper>
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button
            disabled={_.isEqual(
              formik.initialValues,
              createRetreatAttendeeForm(formik.values)
            )}
            type="submit"
            variant="contained"
            color="primary"
            style={{marginRight: theme.spacing(1)}}>
            {"Save changes"}
          </Button>
          <Button variant="outlined" color="primary" onClick={props.onBack}>
            Back to all attendees
          </Button>
        </Box>
      </form>
      {attendee.travel ? (
        <Collapse in={showFlight}>
          <RetreatTravelView travel={attendee.travel} />
        </Collapse>
      ) : (
        <></>
      )}
    </>
  )
}
