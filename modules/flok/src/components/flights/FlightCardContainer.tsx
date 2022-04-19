import {makeStyles} from "@material-ui/core"
import {useState} from "react"
import FlightCard from "./FlightCard"

function FlightCardContainer(props: any) {
  let {flights} = props

  let totalFlights = flights?.trip_legs.length

  let useStyles = makeStyles((theme) => ({
    subFlights: {
      marginLeft: "4vw",
    },
    overall: {
      marginBottom: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
    },
  }))
  let classes = useStyles()
  const [showFlights, setShowFlights] = useState(false)

  let earliestFlight = {
    airline: "Jet Blue",
    arr_airport: "JFK",
    arr_datetime: "2222-04-15T16:45:00",
    dep_airport: "LAX",
    dep_datetime: "2222-04-15T10:45:00",
    duration: null,
    flight_num: "12345",
  }
  let latestFlight = {
    airline: "Jet Blue",
    arr_airport: "JFK",
    arr_datetime: "2000-04-15T16:45:00",
    dep_airport: "LAX",
    dep_datetime: "2000-04-15T10:45:00",
    duration: null,
    flight_num: "12345",
  }

  for (let i = 0; i < flights.trip_legs.length; i++) {
    let testEarliest = new Date(earliestFlight.dep_datetime)
    let testCurrent = new Date(flights.trip_legs[i].dep_datetime)
    let testLatest = new Date(latestFlight.dep_datetime)
    if (testCurrent < testEarliest) {
      earliestFlight = flights.trip_legs[i]
    }
    if (testCurrent > testLatest) {
      latestFlight = flights.trip_legs[i]
    }
  }
  let overallFlight = {
    airline: earliestFlight.airline,
    dep_datetime: earliestFlight.dep_datetime,
    arr_datetime: latestFlight.arr_datetime,
    dep_airport: earliestFlight.dep_airport,
    arr_airport: latestFlight.arr_airport,
    duration: null,
    flight_num: null,
  }

  return (
    <div>
      <div className={classes.overall}>
        {" "}
        {flights && (
          <FlightCard
            flight={overallFlight}
            overall={totalFlights}
            showFlights={showFlights}
            setShowFlights={setShowFlights}
          />
        )}
      </div>

      {totalFlights > 1 && showFlights && (
        <div className={classes.subFlights}>
          {flights &&
            totalFlights > 1 &&
            flights.trip_legs.map((leg: any) => {
              return <FlightCard flight={leg} />
            })}
        </div>
      )}
    </div>
  )
}
export default FlightCardContainer
