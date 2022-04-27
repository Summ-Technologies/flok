import {Button, makeStyles, Typography} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RetreatAttendeeModel} from "../../models/retreat"
import {RootState} from "../../store"
import {getTrip, instantiateAttendeeTrips} from "../../store/actions/retreat"
import EditFlightModal from "./EditFlightModal"
import FlightCardContainer from "./FlightCardContainer"

type AttendeeFlightTabProps = {
  attendee: RetreatAttendeeModel
}

function AttendeeFlightTab(props: AttendeeFlightTabProps) {
  let {attendee} = props
  let travel = attendee.travel
  let dispatch = useDispatch()

  let arrivalFlights = useSelector((state: RootState) => {
    if (travel?.arr_trip && travel?.arr_trip.id) {
      return state.retreat.trips[travel?.arr_trip.id]
    }
  })
  let departureFlights = useSelector((state: RootState) => {
    if (travel?.dep_trip && travel?.dep_trip.id) {
      return state.retreat.trips[travel?.dep_trip.id]
    }
  })

  useEffect(() => {
    travel?.arr_trip &&
      travel?.arr_trip.id &&
      !arrivalFlights &&
      dispatch(getTrip(travel?.arr_trip.id))
    travel?.dep_trip &&
      travel?.dep_trip.id &&
      !departureFlights &&
      dispatch(getTrip(travel?.dep_trip.id))
  }, [
    dispatch,

    travel?.arr_trip,
    travel?.dep_trip,
    arrivalFlights,
    departureFlights,
  ])
  let useStyles = makeStyles((theme) => ({
    flightCardContainer: {
      marginLeft: theme.spacing(2),
      cursor: "auto",
    },
    tripHeader: {
      marginLeft: theme.spacing(1),
      padding: theme.spacing(2),
    },
    header: {
      padding: theme.spacing(1),
      fontWeight: 700,
    },
    headerLine: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    editButton: {},
    noFlightsWords: {
      paddingLeft: theme.spacing(3),
    },
    noFlightsButton: {
      marginLeft: theme.spacing(3),
    },
    instantiateButton: {
      margin: theme.spacing(2),
    },
  }))

  let classes = useStyles()
  const [openEditArrival, setOpenEditArrival] = useState(false)
  const [openEditDeparture, setOpenEditDeparture] = useState(false)
  return (
    <div>
      {attendee && arrivalFlights && (
        <EditFlightModal
          open={openEditArrival}
          setOpen={setOpenEditArrival}
          type="Arrival"
          flights={arrivalFlights}
        />
      )}
      {attendee && departureFlights && (
        <EditFlightModal
          open={openEditDeparture}
          setOpen={setOpenEditDeparture}
          type="Departure"
          flights={departureFlights}
        />
      )}
      {attendee && (
        <Typography variant="h3" className={classes.header}>
          {attendee.first_name + " " + attendee.last_name}'s Flights
        </Typography>
      )}
      {arrivalFlights ? (
        <div>
          <div className={classes.headerLine}>
            {" "}
            <Typography variant="h4" className={classes.tripHeader}>
              Arrival Trip
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.editButton}
              onClick={() => setOpenEditArrival(true)}>
              Edit
            </Button>
          </div>

          {arrivalFlights?.trip_legs.length ? (
            <div className={classes.flightCardContainer}>
              <FlightCardContainer flights={arrivalFlights} />
            </div>
          ) : (
            <div className={classes.noFlightsWords}>No Scheduled Flights</div>
          )}
          <div className={classes.headerLine}>
            {" "}
            <Typography variant="h4" className={classes.tripHeader}>
              Departure Trip
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.editButton}
              onClick={() => setOpenEditDeparture(true)}>
              Edit
            </Button>
          </div>
          {departureFlights?.trip_legs.length ? (
            <div className={classes.flightCardContainer}>
              <FlightCardContainer flights={departureFlights} />
            </div>
          ) : (
            <div className={classes.noFlightsWords}> No Scheduled flights</div>
          )}
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className={classes.instantiateButton}
          onClick={() => {
            dispatch(instantiateAttendeeTrips(attendee.id))
          }}>
          No Flights Yet, Create Flights?
        </Button>
      )}
    </div>
  )
}
export default AttendeeFlightTab
