import {IconButton, makeStyles, TextField} from "@material-ui/core"
import {ArrowForward, Delete} from "@material-ui/icons"
import {RetreatTripLeg} from "../../models/retreat"

type EditFlightFormProps = {
  idPrefix: string
  formik: any
  flightLegValues: RetreatTripLeg
  index: number
}

function EditFlightForm(props: EditFlightFormProps) {
  let {idPrefix, formik, flightLegValues, index} = props

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
  const textFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  let classes = useTripStyles(props)
  function handleDelete() {
    formik.setFieldValue("trip_legs", [
      ...formik.values.trip_legs.filter(
        (leg: RetreatTripLeg, i: number) => i !== index
      ),
    ])
  }
  return (
    <div>
      <div className={classes.tripLegRow}>
        <TextField
          {...textFieldProps}
          required
          id={`${idPrefix}.dep_airport`}
          value={flightLegValues.dep_airport}
          label="Departing Airport"
        />
        <ArrowForward />
        <TextField
          {...textFieldProps}
          required
          id={`${idPrefix}.arr_airport`}
          value={flightLegValues.arr_airport}
          label="Arriving Airport"
        />
      </div>
      <div className={classes.tripLegRow}>
        <TextField
          {...textFieldProps}
          required
          type="datetime-local"
          id={`${idPrefix}.dep_datetime`}
          value={flightLegValues.dep_datetime}
          helperText="Departing airport timezone"
          label="Departing Date & Time"
        />
        <TextField
          {...textFieldProps}
          required
          type="datetime-local"
          id={`${idPrefix}.arr_datetime`}
          value={flightLegValues.arr_datetime}
          helperText="Arriving airport timezone"
          label="Arriving Date & Time"
        />
      </div>
      <div className={classes.tripLegRow}>
        <TextField
          {...textFieldProps}
          id={`${idPrefix}.flight_num`}
          value={flightLegValues.flight_num}
          label="Flight #"
        />
        <TextField
          {...textFieldProps}
          id={`${idPrefix}.airline`}
          value={flightLegValues.airline}
          label="Airline"
        />
      </div>
      <div className={classes.trashDiv}>
        <IconButton onClick={handleDelete}>
          <Delete />
        </IconButton>
      </div>
    </div>
  )
}
export default EditFlightForm
