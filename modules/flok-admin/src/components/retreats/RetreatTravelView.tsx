import {makeStyles} from "@material-ui/core"
import {AdminRetreatTravelModel} from "../../models"
import AppTypography from "../base/AppTypography"
import RetreatTripView from "./RetreatTripView"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: -theme.spacing(2),
    marginLeft: -theme.spacing(2),
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      padding: theme.spacing(2),
    },
  },
  formGroup: {
    overflowY: "scroll",
    display: "flex",
    alignContent: "flex-start",
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
    flexDirection: "row",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
  },
  trip: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: theme.spacing(1),
    height: "100%",
  },
}))

export default function RetreatTravelView(props: {
  travel: AdminRetreatTravelModel
}) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <div className={classes.trip}>
        <AppTypography variant="h3" fontWeight="bold">
          Arriving Trip
          {props.travel.arr_trip?.cost
            ? " - $" + props.travel.arr_trip.cost
            : ""}
        </AppTypography>
        {props.travel.arr_trip ? (
          <RetreatTripView trip={props.travel.arr_trip} />
        ) : (
          <AppTypography variant="body2">No flights booked</AppTypography>
        )}
      </div>
      <div className={classes.trip}>
        <AppTypography variant="h3" fontWeight="bold">
          Returning Trip
          {props.travel.dep_trip?.cost
            ? " - $" + props.travel.dep_trip.cost
            : ""}
        </AppTypography>
        {props.travel.dep_trip ? (
          <RetreatTripView trip={props.travel.dep_trip} />
        ) : (
          <AppTypography variant="body2">No trip booked</AppTypography>
        )}
      </div>
    </div>
  )
}
