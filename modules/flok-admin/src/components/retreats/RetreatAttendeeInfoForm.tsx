import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {ArrowForward, Delete} from "@material-ui/icons"
import {FieldArray, Formik} from "formik"
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
  attendeeToForm,
  formToAttendee,
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
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let [travel, setTravel] = useState<boolean>(!!props.attendee.travel)
  let [arrTrip, setArrTrip] = useState<boolean>(
    !!props.attendee.travel?.arr_trip
  )
  let [depTrip, setDepTrip] = useState<boolean>(
    !!props.attendee.travel?.dep_trip
  )

  const addTrip = (arr: boolean) => {
    setTravel(true)
    arr ? setArrTrip(true) : setDepTrip(true)
  }

  console.log(props.attendee, attendeeToForm(props.attendee))

  return (
    <>
      <Formik
        initialValues={attendeeToForm(props.attendee)}
        onSubmit={(values) => {
          dispatch(
            putRetreatAttendees(
              props.retreatId,
              formToAttendee(
                props.attendee.id,
                values,
                travel,
                arrTrip,
                depTrip
              )
            )
          )
        }}
        validate={(values) => {
          try {
            yup.string().required().email().validateSync(values.email_address)
          } catch (err) {
            return {contact_email: "Please enter a valid email."}
          }
          return {}
        }}
        enableReinitialize>
        {(formik) => {
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
                  value={formik.values.email_address}
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
                {travel ? (
                  <TextField
                    {...textFieldProps}
                    id="travel.cost"
                    name="travel.cost"
                    value={formik.values.travel.cost}
                    type="number"
                    required
                    label="Travel Cost ($)"
                  />
                ) : undefined}
              </Paper>
              <Paper elevation={0} className={classes.formGroup}>
                <AppTypography variant="h4">Arriving Trip Info</AppTypography>
                {arrTrip ? (
                  <>
                    <TextField
                      id="travel.arr_trip.confirmation_number"
                      value={formik.values.travel.arr_trip.confirmation_number}
                      required
                      label="Confirmation #"
                      InputLabelProps={{shrink: true}}
                      onChange={formik.handleChange}
                    />
                    <FieldArray
                      name="travel.arr_trip.trip_legs"
                      render={(arrayHelpers) => (
                        <>
                          <AppTypography variant="h4" fontWeight="medium">
                            Trip Legs
                          </AppTypography>
                          {formik.values.travel.arr_trip.trip_legs.map(
                            (leg, i) => (
                              <div className={classes.tripLeg} key={i}>
                                <div className={classes.tripLegRow}>
                                  <TextField
                                    id={`travel.arr_trip.trip_legs[${i}].dep_airport`}
                                    name={`travel.arr_trip.trip_legs[${i}].dep_airport`}
                                    value={
                                      formik.values.travel.arr_trip.trip_legs[i]
                                        .dep_airport
                                    }
                                    required
                                    label="Departing Airport"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                  />
                                  <ArrowForward />
                                  <TextField
                                    id={`travel.arr_trip.trip_legs.${i}.arr_airport`}
                                    name={`travel.arr_trip.trip_legs[${i}].arr_airport`}
                                    value={
                                      formik.values.travel.arr_trip.trip_legs[i]
                                        .arr_airport
                                    }
                                    required
                                    label="Arriving Airport"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                  />
                                </div>
                                <div className={classes.tripLegRow}>
                                  <TextField
                                    type="datetime-local"
                                    id={`travel.arr_trip.trip_legs.${i}.dep_datetime`}
                                    name={`travel.arr_trip.trip_legs.${i}.dep_datetime`}
                                    value={
                                      formik.values.travel.arr_trip.trip_legs[i]
                                        .dep_datetime
                                    }
                                    helperText="Departing airport timezone"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                    required
                                    label="Departing Date & Time"
                                  />
                                  <IconButton
                                    onClick={() => arrayHelpers.remove(i)}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                  <TextField
                                    type="datetime-local"
                                    id={`travel.arr_trip.trip_legs.${i}.arr_datetime`}
                                    name={`travel.arr_trip.trip_legs.${i}.arr_datetime`}
                                    value={
                                      formik.values.travel.arr_trip.trip_legs[i]
                                        .arr_datetime
                                    }
                                    required
                                    helperText="Arriving airport timezone"
                                    label="Arriving Date & Time"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                  />
                                </div>
                                <div className={classes.tripLegRow}>
                                  <TextField
                                    id={`travel.arr_trip.trip_legs.${i}.flight_num`}
                                    value={
                                      formik.values.travel.arr_trip.trip_legs[i]
                                        .flight_num
                                    }
                                    required
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                    label="Flight #"
                                  />
                                  <TextField
                                    id={`travel.arr_trip.trip_legs.${i}.airline`}
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                    value={
                                      formik.values.travel.arr_trip.trip_legs[i]
                                        .airline
                                    }
                                    required
                                    label="Airline"
                                  />
                                </div>
                              </div>
                            )
                          )}
                          <AppTypography
                            variant="body2"
                            underline
                            style={{cursor: "pointer"}}
                            onClick={() => {
                              arrayHelpers.push({
                                id: -1,
                                airline: "",
                                dep_airport: "",
                                arr_airport: "",
                                flight_num: "",
                                dep_datetime: new Date(),
                                arr_datetime: new Date(),
                                duration: 0,
                              })
                            }}>
                            + add trip leg
                          </AppTypography>
                        </>
                      )}
                    />
                  </>
                ) : (
                  <Button
                    fullWidth={false}
                    variant="outlined"
                    color="primary"
                    onClick={() => addTrip(true)}>
                    Create Arriving Trip
                  </Button>
                )}
              </Paper>
              <Paper elevation={0} className={classes.formGroup}>
                <AppTypography variant="h4">Returning Trip Info</AppTypography>
                {depTrip ? (
                  <>
                    <TextField
                      id="travel.dep_trip.confirmation_number"
                      value={formik.values.travel.dep_trip.confirmation_number}
                      required
                      label="Confirmation #"
                      InputLabelProps={{shrink: true}}
                      onChange={formik.handleChange}
                    />
                    <FieldArray
                      name="travel.dep_trip.trip_legs"
                      render={(arrayHelpers) => (
                        <>
                          <AppTypography variant="h4" fontWeight="medium">
                            Trip Legs
                          </AppTypography>
                          {formik.values.travel.arr_trip.trip_legs.map(
                            (leg, i) => (
                              <div className={classes.tripLeg} key={i}>
                                <div className={classes.tripLegRow}>
                                  <TextField
                                    id={`travel.dep_trip.trip_legs[${i}].dep_airport`}
                                    value={
                                      formik.values.travel.dep_trip.trip_legs[i]
                                        .dep_airport
                                    }
                                    required
                                    label="Departing Airport"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                  />
                                  <ArrowForward />
                                  <TextField
                                    id={`travel.dep_trip.trip_legs.${i}.arr_airport`}
                                    value={
                                      formik.values.travel.dep_trip.trip_legs[i]
                                        .arr_airport
                                    }
                                    required
                                    label="Arriving Airport"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                  />
                                </div>
                                <div className={classes.tripLegRow}>
                                  <TextField
                                    type="datetime-local"
                                    id={`travel.dep_trip.trip_legs.${i}.dep_datetime`}
                                    value={
                                      formik.values.travel.dep_trip.trip_legs[i]
                                        .dep_datetime
                                    }
                                    helperText="Departing airport timezone"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                    required
                                    label="Departing Date & Time"
                                  />
                                  <IconButton
                                    onClick={() => arrayHelpers.remove(i)}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                  <TextField
                                    type="datetime-local"
                                    id={`travel.dep_trip.trip_legs.${i}.arr_datetime`}
                                    value={
                                      formik.values.travel.dep_trip.trip_legs[i]
                                        .arr_datetime
                                    }
                                    required
                                    helperText="Arriving airport timezone"
                                    label="Arriving Date & Time"
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                  />
                                </div>
                                <div className={classes.tripLegRow}>
                                  <TextField
                                    id={`travel.dep_trip.trip_legs.${i}.flight_num`}
                                    value={
                                      formik.values.travel.dep_trip.trip_legs[i]
                                        .flight_num
                                    }
                                    required
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                    label="Flight #"
                                  />
                                  <TextField
                                    id={`travel.dep_trip.trip_legs.${i}.airline`}
                                    InputLabelProps={{shrink: true}}
                                    onChange={formik.handleChange}
                                    value={
                                      formik.values.travel.dep_trip.trip_legs[i]
                                        .airline
                                    }
                                    required
                                    label="Airline"
                                  />
                                </div>
                              </div>
                            )
                          )}
                          <AppTypography
                            variant="body2"
                            underline
                            style={{cursor: "pointer"}}
                            onClick={() => {
                              arrayHelpers.push({
                                id: -1,
                                airline: "",
                                dep_airport: "",
                                arr_airport: "",
                                flight_num: "",
                                dep_datetime: new Date(),
                                arr_datetime: new Date(),
                                duration: 0,
                              })
                            }}>
                            + add trip leg
                          </AppTypography>
                        </>
                      )}
                    />
                  </>
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
                  disabled={_.isEqual(formik.initialValues, formik.values)}
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{marginRight: theme.spacing(1)}}>
                  {"Save changes"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={props.onBack}>
                  Back to all attendees
                </Button>
              </Box>
            </form>
          )
        }}
      </Formik>
    </>
  )
}
