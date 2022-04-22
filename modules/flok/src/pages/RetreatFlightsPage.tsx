import {Box, Chip, Link, makeStyles, Typography} from "@material-ui/core"
import _, {sortBy} from "lodash"
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppExpandableTable from "../components/base/AppExpandableTable"
import AppMoreInfoIcon from "../components/base/AppMoreInfoIcon"
import AppTypography from "../components/base/AppTypography"
import ExportButton from "../components/base/ExportButton"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageLockedModal from "../components/page/PageLockedModal"
import PageSidenav from "../components/page/PageSidenav"
import {SampleLockedAttendees} from "../models/retreat"
import {AppRoutes} from "../Stack"
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
  downloadButtonLink: {
    textDecoration: "none",
  },
  downloadButton: {
    marginLeft: theme.spacing(2),
  },
  titleDiv: {
    display: "flex",
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
  let rows =
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
          id: attendee.travel?.id ?? -1,
          item: {
            id: attendee.id ?? -1,
            name: attendee.name,
            arrival:
              attendee.travel &&
              attendee.travel.arr_trip &&
              attendee.travel.arr_trip.trip_legs.length
                ? attendee.travel.arr_trip.trip_legs[
                    attendee.travel.arr_trip.trip_legs.length - 1
                  ].arr_datetime
                : undefined,
            departure:
              attendee.travel &&
              attendee.travel.dep_trip &&
              attendee.travel.dep_trip.trip_legs.length
                ? attendee.travel.dep_trip.trip_legs[0].dep_datetime
                : undefined,
            cost: attendee.travel ? attendee.travel.cost : undefined,
            status: attendee.flight_status ? attendee.flight_status : "PENDING",
          },
        }))
      : []

  function dateToRead(date: Date) {
    let dateArray = date.toString().split(" ")
    dateArray.splice(5)
    dateArray[dateArray.length - 1] = dateArray[dateArray.length - 1].substring(
      0,
      5
    )
    return dateArray.join(" ")
  }
  let exportRows = rows.map((row) => {
    let newDep = new Date(row.item.departure ?? 0)
    let newArr = new Date(row.item.arrival ?? 0)
    return {
      ...row,
      item: {
        ...row.item,
        departure: _.isEqual(newDep, new Date(0))
          ? undefined
          : dateToRead(newDep),
        arrival: _.isEqual(newArr, new Date(0))
          ? undefined
          : dateToRead(newArr),
      },
    }
  })

  return (
    <PageContainer>
      <PageSidenav activeItem="flights" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.section}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end">
            <div className={classes.titleDiv}>
              <Typography variant="h1">Flights</Typography>
              {rows[0] && (
                <ExportButton
                  rows={exportRows}
                  fileName="Retreat-Attendee-Flights"
                />
              )}
            </div>

            {retreat.flights_state !== "BOOKING" && (
              <PageLockedModal pageDesc="This page will be unlocked when flight booking begins" />
            )}
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
                name: "Employee",
                colId: "name",
                comparator: (r1, r2) => {
                  if (!r1.item.name) {
                    return -1
                  }
                  if (!r2.item.name) {
                    return 1
                  }
                  return r1.item.name
                    .toString()
                    .localeCompare(r2.item.name.toString())
                },
              },
              {
                name: "Retreat Arrival",
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
                name: "Retreat Departure",
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
            rows={rows}
          />
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatFlightsPage)
