import {makeStyles} from "@material-ui/core"
import {ArrowDownward} from "@material-ui/icons"
import {AdminRetreatTripModel} from "../../models"
import {theme} from "../../theme"
import AppTypography from "../base/AppTypography"
let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  leg: {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      marginTop: 6,
    },
    "& > :last-child": {marginTop: 3},
    borderBottomWidth: "2px",
    borderBottomStyle: "dashed",
    borderBottomColor: theme.palette.primary.light,
    marginTop: 6,
  },
  legConnector: {
    display: "flex",
    alignItems: "center",
  },
}))

type RetreatTripViewProps = {trip: AdminRetreatTripModel}
export default function RetreatTripView(props: RetreatTripViewProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      {props.trip.trip_legs.map((leg, i) => {
        console.log(leg)
        return (
          <div className={classes.leg}>
            <AppTypography>
              {leg.dep_airport +
                "  |  " +
                new Date(leg.dep_datetime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
            </AppTypography>
            <div className={classes.legConnector}>
              <ArrowDownward fontSize="large" fontWeight="light" />
              <AppTypography
                style={{
                  fontSize: ".9em",
                  fontWeight: theme.typography.fontWeightLight,
                }}>
                {"  duration: " +
                  new Date(leg.duration * 1000).toISOString().slice(11, 19)}
              </AppTypography>
            </div>
            <AppTypography>
              {leg.arr_airport +
                " | " +
                new Date(leg.arr_datetime).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
            </AppTypography>
            <AppTypography
              style={{
                fontSize: ".9em",
                fontWeight: theme.typography.fontWeightLight,
              }}>
              {leg.airline + "  |  " + leg.flight_num}
            </AppTypography>
          </div>
        )
      })}
    </div>
  )
}
