import {
  Box,
  Button,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {ArrowForward} from "@material-ui/icons"
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
  tripLegRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  },
  tripLeg: {
    borderBottomWidth: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.primary.light,
    paddingBottom: theme.spacing(2),
  },
}))

type RetreatAttendeeInfoFormProps = {
  attendee: AdminRetreatAttendeeModel
  onBack: () => void
  retreatId: number
}
export function RetreatAttendeeInfoForm(props: RetreatAttendeeInfoFormProps) {
  let [attendee, setAttendee] = useState(props.attendee)
  let classes = useStyles(props)
  let dispatch = useDispatch()

  const addTrip = (arr: boolean) => {
    let newAttendee = {...attendee}
    if (!newAttendee.travel) {
      newAttendee.travel = {
        id: -1,
        status: RetreatAttendeeFlightStatusOptions[0],
        cost: 0,
      }
    }
    if (arr) {
      newAttendee.travel.arr_trip = {
        id: -1,
        cost: 0,
        confirmation_number: "",
        trip_legs: [],
      }
    } else {
      newAttendee.travel.dep_trip = {
        id: -1,
        cost: 0,
        confirmation_number: "",
        trip_legs: [],
      }
    }
    setAttendee(newAttendee)
  }

  const addTripLeg = (arr: boolean) => {
    let newAttendee = {...attendee}
    let trip = newAttendee.travel?.dep_trip
    if (arr) {
      trip = newAttendee.travel?.arr_trip
    }
    if (!trip) return

    trip.trip_legs.push({
      id: -1,
      airline: "",
      dep_airport: "",
      arr_airport: "",
      flight_num: "",
      arr_datetime: new Date(),
      dep_datetime: new Date(),
    })
    setAttendee(newAttendee)
    console.log(attendee)
  }

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
        putRetreatAttendees(props.retreatId, createRetreatAttendeeForm(values))
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
          <AppTypography variant="h4">Attendee Info</AppTypography>
          <TextField
            {...textFieldProps}
            id="notes"
            value={formik.values.notes}
            label="Other Notes"
            multiline
            maxRows={1}
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
          {attendee.travel ? (
            <TextField
              id="travel.cost"
              value={formik.values.travel?.cost}
              type="number"
              required
              label="Travel Cost ($)"
              InputLabelProps={{shrink: true}}
            />
          ) : undefined}
        </Paper>
        <Paper elevation={0} className={classes.formGroup}>
          <AppTypography variant="h4">Arriving Trip Info</AppTypography>
          {attendee.travel?.arr_trip ? (
            <>
              <TextField
                id="travel.arr_trip.confirmation_number"
                value={
                  formik.values.travel?.arr_trip?.confirmation_number || ""
                }
                required
                label="Confirmation #"
                InputLabelProps={{shrink: true}}
              />
              <AppTypography variant="h4" fontWeight="medium">
                Trip Legs
              </AppTypography>
              {attendee.travel.arr_trip.trip_legs.map((leg, i) => (
                <div className={classes.tripLeg}>
                  <div className={classes.tripLegRow}>
                    <TextField
                      id={`travel.arr_trip.trip_legs.${i}.dep_airport`}
                      value={
                        formik.values.travel?.arr_trip?.trip_legs[i].dep_airport
                      }
                      required
                      label="Departing Airport"
                      InputLabelProps={{shrink: true}}
                    />
                    <ArrowForward />
                    <TextField
                      id={`travel.arr_trip.trip_legs.${i}.arr_airport`}
                      value={
                        formik.values.travel?.arr_trip?.trip_legs[i].arr_airport
                      }
                      required
                      label="Arriving Airport"
                      InputLabelProps={{shrink: true}}
                    />
                  </div>
                  <div className={classes.tripLegRow}>
                    <TextField
                      type="datetime-local"
                      id={`travel.arr_trip.trip_legs.${i}.dep_datetime`}
                      value={
                        formik.values.travel?.arr_trip?.trip_legs[i]
                          .dep_datetime
                      }
                      helperText="Departing airport timezone"
                      InputLabelProps={{shrink: true}}
                      required
                      label="Departing Date & Time"
                    />
                    <TextField
                      type="datetime-local"
                      id={`travel.arr_trip.trip_legs.${i}.arr_datetime`}
                      InputLabelProps={{shrink: true}}
                      value={
                        formik.values.travel?.arr_trip?.trip_legs[i]
                          .arr_datetime
                      }
                      required
                      helperText="Arriving airport timezone"
                      label="Arriving Date & Time"
                    />
                  </div>
                  <div className={classes.tripLegRow}>
                    <TextField
                      id={`travel.arr_trip.trip_legs.${i}.flight_num`}
                      InputLabelProps={{shrink: true}}
                      value={
                        formik.values.travel?.arr_trip?.trip_legs[i].flight_num
                      }
                      required
                      label="Flight #"
                    />
                    <TextField
                      id={`travel.arr_trip.trip_legs.${i}.airline`}
                      InputLabelProps={{shrink: true}}
                      value={
                        formik.values.travel?.arr_trip?.trip_legs[i].airline
                      }
                      required
                      label="Airline"
                    />
                  </div>
                </div>
              ))}
              <AppTypography
                variant="body2"
                underline
                onClick={() => addTripLeg(true)}>
                + add trip leg
              </AppTypography>
            </>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => addTrip(true)}>
              Create Arrival Trip
            </Button>
          )}
        </Paper>
        <Paper elevation={0} className={classes.formGroup}>
          <AppTypography variant="h4">Returning Trip Info</AppTypography>
          {attendee.travel?.dep_trip ? (
            <AppTypography
              variant="body2"
              underline
              onClick={() => addTripLeg(true)}>
              + add trip leg
            </AppTypography>
          ) : (
            <Button
              fullWidth={false}
              variant="outlined"
              color="primary"
              onClick={() => addTrip(false)}>
              Create Returning Trip
            </Button>
          )}
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
    </>
  )
}
