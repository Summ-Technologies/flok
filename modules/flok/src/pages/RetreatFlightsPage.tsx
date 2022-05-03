import {
  Box,
  Chip,
  Link,
  makeStyles,
  MenuItem,
  Typography,
} from "@material-ui/core"
import {Flight} from "@material-ui/icons"
import {push} from "connected-react-router"
import {sortBy} from "lodash"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppExpandableTable from "../components/base/AppExpandableTable"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {SampleLockedAttendees} from "../models/retreat"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getTrip} from "../store/actions/retreat"
import {useRetreatAttendees} from "../utils/retreatUtils"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  addBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
  },
  headerIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: "top",
    "&.todo": {
      color: theme.palette.error.main,
    },
    "&.next": {
      color: theme.palette.warning.main,
    },
    "&.completed": {
      color: theme.palette.success.main,
    },
  },
  infoChip: {
    borderColor: theme.palette.text.secondary,
    color: theme.palette.text.secondary,
  },
  successChip: {
    borderColor: theme.palette.success.main,
    color: theme.palette.success.main,
  },
  warningChip: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
  },
}))

function currencyFormat(num: Number) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function dateFormat(date: Date | undefined) {
  if (date === undefined) {
    return ""
  }
  let dateFormatter = Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  })
  return dateFormatter.format(date)
}

type RetreatFlightsProps = RouteComponentProps<{retreatIdx: string}>
function RetreatFlightsPage(props: RetreatFlightsProps) {
  let classes = useStyles()

  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  let [attendeeTravelInfo] = useRetreatAttendees(retreat.id)

  if (retreat.flights_state !== "BOOKING") {
    attendeeTravelInfo = SampleLockedAttendees
  }

  let dispatch = useDispatch()
  let trips = useSelector((state: RootState) => {
    return state.retreat.trips
  })
  useEffect(() => {
    attendeeTravelInfo.forEach((attendee) => {
      if (
        attendee.travel &&
        attendee.travel.arr_trip?.id &&
        attendee.travel.dep_trip?.id
      ) {
        !trips[attendee.travel.arr_trip?.id] &&
          dispatch(getTrip(attendee.travel.arr_trip?.id))
        !trips[attendee.travel.dep_trip?.id] &&
          dispatch(getTrip(attendee.travel.dep_trip?.id))
      }
    })
  }, [dispatch, attendeeTravelInfo, trips])

  return (
    <PageContainer>
      <PageSidenav activeItem="flights" retreatIdx={retreatIdx} />
      <PageBody
        appBar
        locked={retreat.flights_state !== "BOOKING"}
        lockedText="This page will be unlocked when flight booking begins">
        <div className={classes.section}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end">
            <Typography variant="h1">Flights</Typography>
            <Link
              variant="body1"
              underline="always"
              component={RouterLink}
              to={AppRoutes.getPath("RetreatAttendeesPage", {
                retreatIdx: retreatIdx.toString(),
              })}>
              Need to add an attendee?
            </Link>
          </Box>
          <AppExpandableTable
            headers={[
              {
                name: "Last Name",
                colId: "last_name",
                comparator: (r1, r2) => {
                  if (r1.item.last_name === "" || !r1.item.last_name) {
                    return 1
                  }
                  if (r2.item.last_name === "" || !r2.item.last_name) {
                    return -1
                  }
                  return r1.item.last_name
                    .toString()
                    .localeCompare(r2.item.last_name.toString())
                },
              },
              {
                name: "First Name",
                colId: "first_name",
                comparator: (r1, r2) => {
                  if (r1.item.first_name === "" || !r1.item.first_name) {
                    return 1
                  }
                  if (r2.item.first_name === "" || !r2.item.first_name) {
                    return -1
                  }
                  return r1.item.first_name
                    .toString()
                    .localeCompare(r2.item.first_name.toString())
                },
              },
              {
                name: "Flight Arrival",
                colId: "arrival",
                renderCell: (val) => (
                  <AppTypography>
                    {!isNaN(new Date(val as string).getTime())
                      ? dateFormat(new Date(val as string))
                      : undefined}
                  </AppTypography>
                ),
              },
              {
                name: "Flight Departure",
                colId: "departure",
                renderCell: (val) => (
                  <AppTypography>
                    {!isNaN(new Date(val as string).getTime())
                      ? dateFormat(new Date(val as string))
                      : undefined}
                  </AppTypography>
                ),
              },
              {
                name: "Cost",
                colId: "cost",
                renderCell: (val) => (
                  <AppTypography>
                    {val ? currencyFormat(val as number) : undefined}
                  </AppTypography>
                ),
              },
              {
                name: "Status",
                colId: "status",
                renderCell: (val) => {
                  if (val === "BOOKED") {
                    return (
                      <Chip
                        variant="outlined"
                        label={"Booked"}
                        className={classes.successChip}
                      />
                    )
                  } else if (val === "OPT_OUT") {
                    return (
                      <Chip
                        variant="outlined"
                        label={
                          <>
                            Opt'd Out&nbsp;
                            <AppMoreInfoIcon tooltipText="This attendee does not require flights to the retreat." />
                          </>
                        }
                        className={classes.infoChip}
                      />
                    )
                  } else {
                    return (
                      <Chip
                        variant="outlined"
                        label={"To Book"}
                        className={classes.warningChip}
                      />
                    )
                  }
                },
                comparator: (r1, r2) => {
                  let order = ["BOOKED", "OPT_OUT", "PENDING"]
                  let r1val = order.indexOf(r1.item.status ?? "")
                  let r2val = order.indexOf(r2.item.status ?? "")
                  if (r1val === r2val) {
                    return 0
                  } else if (r1val > r2val) {
                    return -1
                  } else {
                    return 1
                  }
                },
              },
            ]}
            rows={
              attendeeTravelInfo !== undefined
                ? sortBy(attendeeTravelInfo, (attendee) => {
                    if (attendee.flight_status === "BOOKED") {
                      return 0
                    } else if (attendee.flight_status === "OPT_OUT") {
                      return 1
                    } else {
                      return 2
                    }
                  }).map((attendee) => ({
                    id: attendee.id ?? -1,
                    item: {
                      id: attendee.id ?? -1,
                      first_name: attendee.first_name,
                      last_name: attendee.last_name ?? "",
                      arrival:
                        attendee.travel &&
                        attendee.travel.arr_trip &&
                        attendee.travel.arr_trip.trip_legs.length &&
                        trips[attendee.travel.arr_trip.id]
                          ? trips[attendee.travel.arr_trip.id].trip_legs[
                              trips[attendee.travel.arr_trip.id].trip_legs
                                .length - 1
                            ].arr_datetime
                          : undefined,
                      departure:
                        attendee.travel &&
                        attendee.travel.dep_trip &&
                        trips[attendee.travel.dep_trip.id] &&
                        trips[attendee.travel.dep_trip.id].trip_legs.length
                          ? trips[attendee.travel.dep_trip.id].trip_legs[0]
                              .dep_datetime
                          : undefined,
                      cost: attendee.travel ? attendee.travel.cost : undefined,
                      status: attendee.flight_status
                        ? attendee.flight_status
                        : "PENDING",
                    },
                  }))
                : []
            }
            menuItems={(row) => {
              let editMenuItem = (
                <MenuItem
                  onClick={() =>
                    dispatch(
                      push(
                        AppRoutes.getPath("AttendeeProfileFlightsPage", {
                          retreatIdx: retreatIdx.toString(),
                          attendeeId: row.item.id.toString(),
                        })
                      )
                    )
                  }>
                  <Flight />
                  Edit
                </MenuItem>
              )

              return [editMenuItem]
            }}
          />
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatFlightsPage)
