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
import clsx from "clsx"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import {
  AdminRetreatAttendeeModel,
  AdminRetreatAttendeeUpdateModel,
  AdminRetreatTripModel,
  RetreatAttendeeFlightStatusOptions,
} from "../../models"
import {patchRetreatAttendee} from "../../store/actions/admin"
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
  halfPageFormGroup: {
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
  },
}))

type RetreatAttendeeTravelFormProps = {
  attendee: AdminRetreatAttendeeModel
  retreatId: number
}
export default function RetreatAttendeeTravelForm(
  props: RetreatAttendeeTravelFormProps
) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      flight_status: props.attendee.flight_status,
      travel: props.attendee.travel ?? {
        cost: null,
        arr_trip: null,
        dep_trip: null,
      },
    },
    onSubmit: (values) => {
      dispatch(
        patchRetreatAttendee(
          props.retreatId,
          props.attendee.id,
          nullifyEmptyString(values)
        )
      )
    },
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  function nullifyForm(
    form: AdminRetreatAttendeeUpdateModel
  ): AdminRetreatAttendeeUpdateModel {
    let ret: any = nullifyEmptyString(form)
    if (ret.travel) {
      ret.travel = nullifyEmptyString(ret.travel)
      if (ret.travel.arr_trip) {
        ret.travel.arr_trip = nullifyEmptyString(ret.travel.arr_trip)
        if (ret.travel.arr_trip.trip_legs) {
          ret.travel.arr_trip.trip_legs = ret.travel.arr_trip.trip_legs.map(
            (val: any) => nullifyEmptyString(val)
          )
        }
      }
      if (ret.travel.dep_trip) {
        ret.travel.dep_trip = nullifyEmptyString(ret.travel.dep_trip)
        if (ret.travel.dep_trip.trip_legs) {
          ret.travel.dep_trip.trip_legs = ret.travel.dep_trip.trip_legs.map(
            (val: any) => nullifyEmptyString(val)
          )
        }
      }
    }
    return ret
  }

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Travel info</AppTypography>
        <TextField
          {...textFieldProps}
          id="flight_status"
          value={formik.values.flight_status ?? ""}
          select
          SelectProps={{native: true}}
          label="Flight Status">
          {formik.values.flight_status ?? (
            <option value={""}>Select an option</option>
          )}
          {RetreatAttendeeFlightStatusOptions.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </TextField>
        <TextField
          {...textFieldProps}
          id="travel.cost"
          value={formik.values.travel.cost ?? ""}
          type="number"
          label="Travel Cost ($)"
        />
      </Paper>
      <Paper className={clsx(classes.formGroup, classes.halfPageFormGroup)}>
        <AppTypography variant="h4">Retreat arrival trip info</AppTypography>
        {formik.values.travel.arr_trip ? (
          <RetreatAttendeeTripForm
            trip={formik.values.travel.arr_trip}
            setFieldValue={formik.setFieldValue}
            textFieldProps={textFieldProps}
            tripType="arr_trip"
          />
        ) : (
          <Button
            fullWidth={false}
            variant="outlined"
            color="primary"
            onClick={() => {
              formik.setFieldValue("travel.arr_trip", {
                confirmation_number: null,
                trip_legs: [],
              })
            }}>
            Create Arriving Trip
          </Button>
        )}
      </Paper>
      <Paper className={clsx(classes.formGroup, classes.halfPageFormGroup)}>
        <AppTypography variant="h4">Retreat departure trip info</AppTypography>
        {formik.values.travel.dep_trip ? (
          <RetreatAttendeeTripForm
            trip={formik.values.travel.dep_trip}
            setFieldValue={formik.setFieldValue}
            textFieldProps={textFieldProps}
            tripType="dep_trip"
          />
        ) : (
          <Button
            fullWidth={false}
            variant="outlined"
            color="primary"
            onClick={() => {
              formik.setFieldValue("travel.dep_trip", {
                confirmation_number: null,
                trip_legs: [],
              })
            }}>
            Create Departing Trip
          </Button>
        )}
      </Paper>
      <Box display="flex" flexDirection="row-reverse" width="100%">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={_.isEqual(
            nullifyForm(formik.values),
            nullifyForm(formik.initialValues)
          )}>
          Save Changes
        </Button>
      </Box>
    </form>
  )
}

let useTripStyles = makeStyles((theme) => ({
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

type RetreatAttendeeTripFormProps = {
  trip: AdminRetreatTripModel
  tripType: "arr_trip" | "dep_trip"
  setFieldValue: (fieldName: string, fieldValue: any) => void
  textFieldProps: TextFieldProps
}
export function RetreatAttendeeTripForm(props: RetreatAttendeeTripFormProps) {
  let classes = useTripStyles(props)
  return (
    <>
      <TextField
        {...props.textFieldProps}
        id={`travel.${props.tripType}.confirmation_number`}
        value={props.trip.confirmation_number ?? ""}
        label="Confirmation #"
      />
      <AppTypography variant="h4" fontWeight="medium">
        Flight(s)
      </AppTypography>
      {props.trip.trip_legs.map((leg, i) => (
        <div className={classes.tripLeg} key={i}>
          <div className={classes.tripLegRow}>
            <TextField
              {...props.textFieldProps}
              id={`travel.${props.tripType}.trip_legs[${i}].dep_airport`}
              value={props.trip.trip_legs[i].dep_airport ?? ""}
              label="Departing Airport"
            />
            <ArrowForward />
            <TextField
              {...props.textFieldProps}
              id={`travel.${props.tripType}.trip_legs.${i}.arr_airport`}
              value={props.trip.trip_legs[i].arr_airport}
              label="Arriving Airport"
            />
          </div>
          <div className={classes.tripLegRow}>
            <TextField
              {...props.textFieldProps}
              type="datetime-local"
              id={`travel.${props.tripType}.trip_legs.${i}.dep_datetime`}
              value={props.trip.trip_legs[i].dep_datetime}
              helperText="Departing airport timezone"
              label="Departing Date & Time"
            />
            <TextField
              {...props.textFieldProps}
              type="datetime-local"
              id={`travel.${props.tripType}.trip_legs.${i}.arr_datetime`}
              value={props.trip.trip_legs[i].arr_datetime}
              helperText="Arriving airport timezone"
              label="Arriving Date & Time"
            />
          </div>
          <div className={classes.tripLegRow}>
            <TextField
              {...props.textFieldProps}
              id={`travel.${props.tripType}.trip_legs.${i}.flight_num`}
              value={props.trip.trip_legs[i].flight_num}
              label="Flight #"
            />
            <TextField
              {...props.textFieldProps}
              id={`travel.${props.tripType}.trip_legs.${i}.airline`}
              value={props.trip.trip_legs[i].airline}
              label="Airline"
            />
          </div>
          <Box flexDirection="row-reverse" className={classes.tripLegRow}>
            <IconButton
              onClick={() =>
                props.setFieldValue(
                  `travel.${props.tripType}.trip_legs`,
                  props.trip.trip_legs.filter((o, j) => i !== j)
                )
              }>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </div>
      ))}
      <AppTypography
        variant="body2"
        underline
        style={{cursor: "pointer"}}
        onClick={() => {
          props.setFieldValue(`travel.${props.tripType}.trip_legs`, [
            ...props.trip.trip_legs,
            {
              airline: null,
              dep_airport: null,
              arr_airport: null,
              flight_num: null,
              dep_datetime: null,
              arr_datetime: null,
              duration: null,
            },
          ])
        }}>
        + add flight
      </AppTypography>
    </>
  )
}
