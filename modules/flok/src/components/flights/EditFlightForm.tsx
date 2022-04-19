import {IconButton, makeStyles, TextField} from "@material-ui/core"
import {ArrowForward, Delete} from "@material-ui/icons"
import {useFormik} from "formik"
import _ from "lodash"

function EditFlightForm(props: any) {
  let {flightIdx, flightsState, setFlightsState, setSelectedFlight} = props
  let flight = flightsState && flightsState[flightIdx]

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
    trashDiv: {
      textAlign: "right",
    },
  }))
  let formik = useFormik({
    initialValues: {
      dep_airport: flight.dep_airport ?? "",
      arr_airport: flight.arr_airport ?? "",
      dep_datetime: flight.dep_datetime ?? "",
      arr_datetime: flight.arr_datetime ?? "",
      flight_num: flight.flight_num ?? "",
      airline: flight.airline ?? "",
    },
    onSubmit: (values) => {
      // dispatch(patchAttendee(attendeeIdx, values))
    },

    enableReinitialize: true,
  })
  const textFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: customChange,
  }

  function customChange(e: any) {
    formik.handleChange(e)
    let customObj = {...formik.values}
    for (let field in customObj) {
      if (field === e.target.id) {
        customObj[field as keyof typeof customObj] = e.target.value
      }
    }
    setFlightsState((flightsState: any) => {
      return [
        ...flightsState.slice(0, flightIdx),
        customObj,
        ...flightsState.slice(flightIdx + 1, flightsState.length),
      ]
    })
  }
  let classes = useTripStyles(props)

  function handleDelete() {
    setFlightsState((flightsState: any) => {
      return [
        ...flightsState.filter((flightI: any) => !_.isEqual(flightI, flight)),
      ]
    })
    setSelectedFlight(100)
  }
  return (
    <form>
      <div className={classes.tripLegRow}>
        <TextField
          {...textFieldProps}
          id={"dep_airport"}
          value={formik.values.dep_airport}
          label="Departing Airport"
        />
        <ArrowForward />
        <TextField
          {...textFieldProps}
          id={"arr_airport"}
          value={formik.values.arr_airport}
          label="Arriving Airport"
        />
      </div>
      <div className={classes.tripLegRow}>
        <TextField
          {...textFieldProps}
          type="datetime-local"
          id={"dep_datetime"}
          value={formik.values.dep_datetime}
          helperText="Departing airport timezone"
          label="Departing Date & Time"
        />
        <TextField
          {...textFieldProps}
          type="datetime-local"
          id={"arr_datetime"}
          value={formik.values.arr_datetime}
          helperText="Arriving airport timezone"
          label="Arriving Date & Time"
        />
      </div>
      <div className={classes.tripLegRow}>
        <TextField
          {...textFieldProps}
          id={"flight_num"}
          value={formik.values.flight_num}
          label="Flight #"
        />
        <TextField
          {...textFieldProps}
          id={"airline"}
          value={formik.values.airline}
          label="Airline"
        />
      </div>
      <div className={classes.trashDiv}>
        <IconButton onClick={handleDelete}>
          <Delete />
        </IconButton>
      </div>
    </form>
  )
}
export default EditFlightForm
