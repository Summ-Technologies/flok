import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core"
import _ from "lodash"
import {useEffect, useState} from "react"
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
  }))
  let classes = useStyles()
  let dispatch = useDispatch()
  const [selectedFlight, setSelectedFlight] = useState(100)
  const [flightsState, setFlightsState] = useState(flights?.trip_legs)
  let initialFlightsState = flights?.trip_legs

  useEffect(() => {
    flights && setFlightsState(flights.trip_legs)
  }, [flights])

  useEffect(() => {
    initialFlightsState = flights?.trip_legs
  }, [flights?.trip_legs])

  function handleCancel() {
    setFlightsState(initialFlightsState)
    setSelectedFlight(100)
    handleClose()
  }
  function handleAdd() {
    setFlightsState((flightsState: any) => [
      ...flightsState,
      {
        dep_airport: "",
        arr_airport: "",
        dep_datetime: "",
        arr_datetime: "",
        flight_num: "",
        airline: "",
      },
    ])
    setSelectedFlight(flightsState.length)
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit {type} Flights </DialogTitle>
      <DialogContent>
        {flightsState?.map((leg: RetreatTripLeg, i: number) => {
          if (i === selectedFlight) {
            return (
              <>
                <hr className={classes.line}></hr>
                {/* Bug must be fixed below */}
                {flightsState && (
                  <EditFlightForm
                    flightsState={flightsState}
                    setFlightsState={setFlightsState}
                    flightIdx={selectedFlight}
                    setSelectedFlight={setSelectedFlight}
                  />
                )}

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

        {!flightsState?.length && <Typography>No Flights Currently</Typography>}
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
          <Button
            onClick={() => {
              dispatch(patchTrip(flights.id, {trip_legs: flightsState}))
              setFlightsState((flightsState: any) =>
                flightsState.filter(
                  (leg: any) =>
                    !_.isEqual(leg, {
                      dep_airport: "",
                      arr_airport: "",
                      dep_datetime: "",
                      arr_datetime: "",
                      flight_num: "",
                      airline: "",
                    })
                )
              )
              setSelectedFlight(100)
              handleClose()
            }}
            color="primary">
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
export default EditFlightModal
