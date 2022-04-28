import {makeStyles, Typography, useMediaQuery} from "@material-ui/core"
import {ExpandMore, Flight} from "@material-ui/icons"
import clsx from "clsx"
import {RetreatTripLeg} from "../../models/retreat"
import {FlokTheme} from "../../theme"

type FlightCardProps = {
  flight: Partial<RetreatTripLeg>
  showFlights?: boolean
  setShowFlights?: (value: boolean) => void
  overall?: number
  isEditing?: boolean
}

let useStyles = makeStyles((theme) => ({
  divCard: {
    display: "flex",

    cursor: (props: FlightCardProps) =>
      props.overall && props.overall > 1 ? "pointer" : "auto",
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(1.5),
    backgroundColor: "white",
    minWidth: "220px",
    [theme.breakpoints.down("sm")]: {
      width: (props: FlightCardProps) => (props.isEditing ? "80%" : "100%"),
      gap: (props: FlightCardProps) => (props.overall ? theme.spacing(2) : "0"),
    },
    width: (props: FlightCardProps) => (props.isEditing ? "100%" : "65%"),
    justifyContent: "space-around",
    overflow: "scroll",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    "&:first-child": {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    },
    "&:last-child": {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    "&:not(:last-child)": {
      borderBottomStyle: "solid",
      borderBottomColor: theme.palette.grey[100],
      borderBottomWidth: "2px",
    },
  },
  column: {
    flexDirection: "column",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0",
      marginRight: "0",
      width: "fit-content",
    },
    gap: (props: FlightCardProps) => (props.overall ? "0" : theme.spacing(1)),
  },
  rightColumn: {
    flexDirection: "column",
    marginLeft: theme.spacing(3),
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0",
    },
  },
  line: {
    width: "100%",
    border: "3.5px solid",
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    borderRadius: "3px",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  totalFlights: {
    width: "30px",
    height: "30px",
  },
  totalFlightsColumn: {
    width: "10%",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(3),
      width: "8%",
    },
  },
  expandColumn: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(3),
      display: (props: FlightCardProps) => (props.overall ? "" : "none"),
    },
  },
  hidden: {
    opacity: "0",
  },
  twoColumns: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      whiteSpace: "nowrap",
    },
    gap: theme.spacing(1),
  },
  bold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  doubleColumnContainer: {
    width: "50%",
  },
  singleColumnContainer: {
    width: "30%",
  },
  columnInSingle: {
    width: "fit-content",
    whiteSpace: "nowrap",
  },
  columnInDouble: {
    width: "60%",
    [theme.breakpoints.down("sm")]: {
      width: "35%",
    },
  },
}))
function FlightCard(props: FlightCardProps) {
  let {flight, setShowFlights, showFlights, overall} = props

  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  let classes = useStyles(props)

  function chop(string: string) {
    //removes the last character from a string
    return string.substring(0, string.length - 1)
  }

  let dep_datetime = new Date(flight.dep_datetime ?? 0)
  let arr_datetime = new Date(flight.arr_datetime ?? 0)

  return (
    <div
      className={classes.divCard}
      onClick={() => {
        if (overall && setShowFlights) {
          setShowFlights(!showFlights)
        }
      }}>
      {overall && (
        <div className={classes.totalFlightsColumn}>
          <Flight />
        </div>
      )}
      <div className={`${classes.twoColumns} ${classes.singleColumnContainer}`}>
        <div className={`${classes.column} ${classes.columnInSingle}`}>
          {flight?.dep_datetime ? (
            <Typography className={classes.bold}>
              {(!isSmallScreen
                ? new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                    timeStyle: undefined,
                  })
                    .format(dep_datetime)
                    .split(" ")[0]
                    .substring(0, 3)
                : "") +
                " " +
                chop(
                  new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                    timeStyle: undefined,
                  })
                    .format(dep_datetime)
                    .split(" ")
                    .slice(1, 3)
                    .join(" ")
                )}
            </Typography>
          ) : (
            "N/A"
          )}
          <hr className={classes.line}></hr>
        </div>
      </div>

      <div className={`${classes.twoColumns} ${classes.columnInDouble}`}>
        <div className={`${classes.column} ${classes.columnInDouble}`}>
          {flight?.dep_datetime ? (
            <Typography>
              {dep_datetime.getUTCHours() +
                ":" +
                (dep_datetime.getUTCMinutes() < 10 ? "0" : "") +
                dep_datetime.getUTCMinutes()}{" "}
              {dep_datetime.getDay() !== arr_datetime.getDay() &&
                "(" +
                  new Intl.DateTimeFormat("en-US", {dateStyle: "full"})
                    .format(dep_datetime)
                    .split(" ")[0]
                    .substring(0, 3) +
                  ")"}
              {" - "}
              {arr_datetime.getUTCHours() +
                ":" +
                (dep_datetime.getUTCMinutes() < 10 ? "0" : "") +
                arr_datetime.getUTCMinutes()}{" "}
              {dep_datetime.getDay() !== arr_datetime.getDay() &&
                "(" +
                  new Intl.DateTimeFormat("en-US", {dateStyle: "full"})
                    .format(arr_datetime)
                    .split(" ")[0]
                    .substring(0, 3) +
                  ")"}
            </Typography>
          ) : (
            "N/A"
          )}
        </div>

        <div className={classes.rightColumn}>
          <Typography>
            {flight?.dep_airport} to {flight?.arr_airport}
          </Typography>
        </div>
      </div>

      <div className={classes.expandColumn}>
        {" "}
        <ExpandMore
          className={clsx(overall && overall > 1 ? undefined : classes.hidden)}
          fontSize="large"
        />
      </div>
    </div>
  )
}
export default FlightCard
