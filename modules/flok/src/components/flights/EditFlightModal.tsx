import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {useFormik} from "formik"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RetreatTripLeg} from "../../models/retreat"
import {patchTrip} from "../../store/actions/retreat"
import EditFlightForm from "./EditFlightForm"
import FlightCard from "./FlightCard"

function EditFlightModal(props: any) {
  let {open, setOpen, type, flights} = props
  function handleClose() {
    setOpen(false)
  }

  let useStyles = makeStyles((theme) => ({
    line: {
      border: "2px solid black",
      margin: theme.spacing(1),
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
    cardLine: {
      display: "flex",
    },
    editButton: {
      height: "35px",
      top: "10px",
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
    trashDiv: {
      textAlign: "right",
    },
  }))
  let classes = useStyles()
  let dispatch = useDispatch()
  const [selectedFlight, setSelectedFlight] = useState(100)

  function handleCancel() {
    setSelectedFlight(100)
    handleClose()
  }
  function handleAdd() {
    formik.setFieldValue(`trip_legs`, [
      ...formik.values.trip_legs,
      {
        airline: "",
        dep_airport: "",
        arr_airport: "",
        flight_num: "",
        dep_datetime: "",
        arr_datetime: "",
        duration: "",
      },
    ])
    setSelectedFlight(formik.values.trip_legs.length)
  }

  let formik = useFormik({
    initialValues: {
      trip_legs: flights?.trip_legs,
    },
    onSubmit: (values: any) => {
      let updatedValues = formik.values.trip_legs.map((leg: any) => {
        delete leg.duration
        return leg
      })
      console.log({trip_legs: updatedValues})
      dispatch(patchTrip(flights.id, {trip_legs: updatedValues}))
      setOpen(false)
    },
    enableReinitialize: true,
  })
  const textFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Edit {type} Flights </DialogTitle>
        <DialogContent>
          {formik.values.trip_legs?.map((leg: RetreatTripLeg, i: number) => {
            if (i === selectedFlight) {
              return (
                <>
                  <hr className={classes.line}></hr>
                  {/* Bug must be fixed below */}

                  <EditFlightForm
                    idPrefix={`trip_legs[${i}]`}
                    flightLegValues={leg}
                    formik={formik}
                    index={i}
                  />

                  <hr className={classes.line}></hr>
                </>
              )
            }
            return (
              <div className={classes.cardLine}>
                <FlightCard flight={leg} />
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.editButton}
                  onClick={() => setSelectedFlight(i)}>
                  Edit
                </Button>
              </div>
            )
          })}

          {!formik.values.trip_legs?.length && (
            <Typography>No Flights Currently</Typography>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button color="primary" onClick={handleAdd}>
            Add Flight
          </Button>
          <div>
            {" "}
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default EditFlightModal
