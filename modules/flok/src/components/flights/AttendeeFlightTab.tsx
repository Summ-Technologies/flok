import {Button, makeStyles, Typography} from "@material-ui/core"
import {useState} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../store"
import EditFlightModal from "./EditFlightModal"
import FlightCardContainer from "./FlightCardContainer"

function AttendeeFlightTab(props: any) {
  let {flights, attendee} = props
  let useStyles = makeStyles((theme) => ({
    flightCardContainer: {
      marginLeft: theme.spacing(2),
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
      marginRight: "15vw",
    },
    editButton: {
      height: "40px",
    },
    noFlightsWords: {
      paddingLeft: theme.spacing(300),
    },
  }))

  let arrivalFlights = useSelector((state: RootState) => {
    if (flights?.arr_trip.id) {
      return state.retreat.trips[flights?.arr_trip.id]
    }
  })
  let departureFlights = useSelector((state: RootState) => {
    if (flights?.dep_trip.id) {
      return state.retreat.trips[flights?.dep_trip.id]
    }
  })

  let classes = useStyles()
  const [openEditArrival, setOpenEditArrival] = useState(false)
  const [openEditDeparture, setOpenEditDeparture] = useState(false)
  return (
    <div>
      <EditFlightModal
        open={openEditArrival}
        setOpen={setOpenEditArrival}
        type="Arrival"
        flights={arrivalFlights}
      />
      <EditFlightModal
        open={openEditDeparture}
        setOpen={setOpenEditDeparture}
        type="Departure"
        flights={departureFlights}
      />
      {attendee && (
        <Typography variant="h3" className={classes.header}>
          {attendee.name}'s Flights
        </Typography>
      )}
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

      {flights?.arr_trip.trip_legs.length ? (
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
        <div> No Scheduled flights</div>
      )}
    </div>
  )
}
export default AttendeeFlightTab
