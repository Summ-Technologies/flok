import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core"
import {useFormik} from "formik"
import NumberFormat from "react-number-format"
import {useDispatch} from "react-redux"
import {patchAttendee, patchAttendeeTravel} from "../../store/actions/retreat"

let useStyles = makeStyles((theme) => ({
  textField: {
    width: 200,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  form: {
    display: "flex",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))

type EditAttendeeTravelModalProps = {
  open: boolean
  flightStatus: "PENDING" | "OPT_OUT" | "BOOKED"
  flightCost: number
  attendeeId: number
  handleClose: () => void
}
const attendeeFlightStateOptions = [
  {value: "PENDING", text: "Not Booked"},
  {value: "OPT_OUT", text: "Opted Out"},
  {value: "BOOKED", text: "Booked"},
]
function EditAttendeeTravelModal(props: EditAttendeeTravelModalProps) {
  let dispatch = useDispatch()
  let classes = useStyles()
  let formikAttendee = useFormik({
    initialValues: {
      flight_status: props.flightStatus ?? "PENDING",
    },
    onSubmit: (values) => {
      dispatch(patchAttendee(props.attendeeId, values))
    },
    enableReinitialize: true,
  })
  let formikTravel = useFormik({
    initialValues: {
      cost: props.flightCost,
    },
    onSubmit: (values) => {
      dispatch(patchAttendeeTravel(props.attendeeId, values))
    },
    enableReinitialize: true,
  })
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Edit Trip Details</DialogTitle>
      <DialogContent>
        <form className={classes.form}>
          <TextField
            select
            variant="outlined"
            value={formikAttendee.values.flight_status}
            id="flight_status"
            onChange={formikAttendee.handleChange}
            className={classes.textField}
            label="Flights Status"
            size="small">
            {attendeeFlightStateOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.text}
              </option>
            ))}
          </TextField>
        </form>
        <form onSubmit={formikTravel.handleSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            value={formikTravel.values.cost}
            id="cost"
            onChange={(e) =>
              formikTravel.setFieldValue(
                "cost",
                isNaN(parseInt(e.target.value)) ? "" : parseInt(e.target.value)
              )
            }
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            label="Flights Cost"
            InputProps={{
              inputComponent: CurrencyNumberFormat as any,
            }}
            size="small"></TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <div>
          <Button
            color="primary"
            onClick={() => {
              formikAttendee.resetForm()
              formikTravel.resetForm()
              props.handleClose()
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              formikAttendee.handleSubmit()
              formikTravel.handleSubmit()
              props.handleClose()
            }}
            color="primary">
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
export default EditAttendeeTravelModal

type CurrencyNumberFormatProps = {
  onChange: (e: {target: {name: string; value: string}}) => void
}

function CurrencyNumberFormat(props: CurrencyNumberFormatProps) {
  const {onChange, ...other} = props
  return (
    <NumberFormat
      {...other}
      onValueChange={(values) => {
        props.onChange({
          target: {name: (other as any).id, value: values.value},
        })
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  )
}
