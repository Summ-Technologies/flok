import {makeStyles} from "@material-ui/core"
import {useState} from "react"
import {RetreatTripModel} from "../../models/retreat"
import FlightCard from "./FlightCard"

type FlightCardContainerProps = {
  flights: RetreatTripModel
}
function FlightCardContainer(props: FlightCardContainerProps) {
  let {flights} = props

  let totalFlights: number | undefined = flights?.trip_legs.length

  let useStyles = makeStyles((theme) => ({
    subFlights: {
      marginLeft: "4%",
    },
    overall: {
      marginBottom: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
    },
  }))
  let classes = useStyles()
  const [showFlights, setShowFlights] = useState(false)

  let overallFlight = {
    airline: flights.trip_legs[0].airline,
    dep_datetime: flights.trip_legs[0].dep_datetime,
    arr_datetime: flights.trip_legs[flights.trip_legs.length - 1].arr_datetime,
    dep_airport: flights.trip_legs[0].dep_airport,
    arr_airport: flights.trip_legs[flights.trip_legs.length - 1].arr_airport,
    duration: undefined,
    flight_num: undefined,
  }

  return (
    <div>
      <div className={classes.overall}>
        {flights && (
          <FlightCard
            flight={overallFlight}
            overall={totalFlights}
            setShowFlights={setShowFlights}
            showFlights={showFlights}
          />
        )}
      </div>

      {totalFlights && totalFlights > 1 && showFlights && (
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
