import {makeStyles, Typography, useMediaQuery} from "@material-ui/core"
import {ExpandMore, Flight} from "@material-ui/icons"
import {RetreatTripLeg} from "../../models/retreat"
import {FlokTheme} from "../../theme"

type FlightCardProps = {
  flight: Partial<RetreatTripLeg>
  showFlights?: boolean
  setShowFlights?: React.Dispatch<React.SetStateAction<boolean>>
  overall?: number
}
function FlightCard(props: FlightCardProps) {
  let {flight, setShowFlights, overall} = props

  let useStyles = overall
    ? makeStyles((theme) => ({
        divCard: {
          display: "flex",
          paddingTop: theme.spacing(2.5),
          paddingBottom: theme.spacing(1.5),
          backgroundColor: "white",
          minWidth: "220px",
          [theme.breakpoints.down("sm")]: {
            width: "100%",
            gap: theme.spacing(2),
          },
          justifyContent: "space-around",
          width: "fit-content",
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
            borderBottom: "1.5px solid #BDBDBD",
          },
        },
        column: {
          flexDirection: "column",
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          width: "8vw",
          [theme.breakpoints.down("sm")]: {
            marginLeft: "0",
            marginRight: "0",
            width: "fit-content",
          },
        },
        rightColumn: {
          flexDirection: "column",
          marginLeft: theme.spacing(3),
          [theme.breakpoints.down("sm")]: {
            marginLeft: "0",
          },
          width: "8vw",
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
          width: "4vw",
          [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(3),
          },
        },
        expandColumn: {
          width: "2wv",
          [theme.breakpoints.down("sm")]: {
            marginLeft: theme.spacing(3),
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
          fontWeight: "bold",
        },
      }))
    : //not overall flight card styling below
      makeStyles((theme) => ({
        divCard: {
          display: "flex",
          paddingTop: theme.spacing(2.5),
          paddingBottom: theme.spacing(1.5),
          backgroundColor: "white",
          minWidth: "220px",
          [theme.breakpoints.down("sm")]: {
            width: "100%",
          },
          justifyContent: "space-around",
          width: "fit-content",
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
            borderBottom: "1.5px solid #BDBDBD",
          },
        },
        column: {
          flexDirection: "column",
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          width: "8vw",
          gap: theme.spacing(1),
          [theme.breakpoints.down("sm")]: {
            marginLeft: "0",
            marginRight: "0",
            width: "fit-content",
          },
        },
        rightColumn: {
          flexDirection: "column",
          marginLeft: theme.spacing(3),
          [theme.breakpoints.down("sm")]: {
            marginLeft: "0",
          },
          width: "8vw",
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
          width: "4vw",
          [theme.breakpoints.down("sm")]: {
            marginTop: theme.spacing(1),
            marginRight: theme.spacing(3),
          },
        },
        expandColumn: {
          width: "2wv",
          [theme.breakpoints.down("sm")]: {
            marginLeft: theme.spacing(3),
            display: "none",
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
            gap: theme.spacing(1),
          },
        },
        bold: {
          fontWeight: "bold",
        },
      }))
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  let classes = useStyles()
  const daysMap: any = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  }
  const monthsMap: any = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sept",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  }
  function suffixMap(date: number) {
    if (date >= 20) {
      date = parseInt(date.toString()[1])
    }
    switch (date) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      case 0:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
        return "th"
    }
  }
  let dep_datetime = new Date(flight.dep_datetime ?? 0)
  let arr_datetime = new Date(flight.arr_datetime ?? 0)

  return (
    <div
      className={classes.divCard}
      onClick={() => {
        if (overall && setShowFlights) {
          setShowFlights((showFlights: boolean) => !showFlights)
        }
      }}>
      {overall && (
        <div className={classes.totalFlightsColumn}>
          <Flight />
        </div>
      )}
      <div className={classes.twoColumns}>
        <div className={classes.column}>
          {flight?.dep_datetime ? (
            <Typography className={classes.bold}>
              {dep_datetime.getDay() > -1 &&
                (!isSmallScreen
                  ? daysMap[dep_datetime.getDay()]?.substring(0, 3)
                  : "") +
                  " " +
                  dep_datetime.getDate() +
                  suffixMap(dep_datetime.getDate()) +
                  "  " +
                  monthsMap[dep_datetime.getMonth()]}
            </Typography>
          ) : (
            "N/A"
          )}
          <hr className={classes.line}></hr>
        </div>
      </div>

      <div className={classes.twoColumns}>
        <div className={classes.column}>
          {flight?.dep_datetime ? (
            <Typography>
              {dep_datetime.getUTCHours() +
                ":" +
                (dep_datetime.getUTCMinutes() < 10 ? "0" : "") +
                dep_datetime.getUTCMinutes()}{" "}
              {dep_datetime.getDay() !== arr_datetime.getDay() &&
                "(" + daysMap[dep_datetime.getDay()]?.substring(0, 3) + ")"}
              {" - "}
              {arr_datetime.getUTCHours() +
                ":" +
                (dep_datetime.getUTCMinutes() < 10 ? "0" : "") +
                arr_datetime.getUTCMinutes()}{" "}
              {dep_datetime.getDay() !== arr_datetime.getDay() &&
                "(" + daysMap[arr_datetime.getDay()]?.substring(0, 3) + ")"}
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
        {overall && overall > 1 ? (
          <ExpandMore fontSize="large" />
        ) : (
          <ExpandMore className={classes.hidden} fontSize="large" />
        )}
      </div>
    </div>
  )
}
export default FlightCard
