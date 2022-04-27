import {IconButton, makeStyles, TextField} from "@material-ui/core"
import {ArrowForward, Delete} from "@material-ui/icons"
import {RetreatTripLeg} from "../../models/retreat"

type EditFlightFormProps = {
  idPrefix: string
  flightLegValues: RetreatTripLeg
  index: number
  onFlightDelete: (idx: number) => void
  textFieldProps: {
    fullWidth: boolean
    InputLabelProps: {shrink: boolean}
    onChange: (ChangeEvent: any) => void
  }
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
  trashDiv: {
    textAlign: "right",
  },
}))

function EditFlightForm(props: EditFlightFormProps) {
  let {idPrefix, flightLegValues, index, onFlightDelete, textFieldProps} = props

  let classes = useTripStyles(props)

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
        <IconButton onClick={() => onFlightDelete(index)}>
          <Delete />
        </IconButton>
      </div>
    </div>
  )
}
export default EditFlightForm
