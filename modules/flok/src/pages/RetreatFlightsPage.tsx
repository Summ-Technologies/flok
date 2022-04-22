import {
  Box,
  Chip,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core"
import {useState} from "react"
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
  searchBar: {
    margin: theme.spacing(1),
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

  const [searchTerm, setSearchTerm] = useState("")

  return (
    <PageContainer>
      <PageSidenav activeItem="flights" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.section}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end">
            <Typography variant="h1">Flights</Typography>
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
          <TextField
            name="search"
            label="Search Flights"
            variant="outlined"
            value={searchTerm}
            className={classes.searchBar}
            size="small"
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
          />
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
                comparator: (r1, r2) => {
                  if (!r1.item.arrival) {
                    return 1
                  }
                  if (!r2.item.arrival) {
                    return -1
                  }
                  return new Date(r1.item.arrival) > new Date(r2.item.arrival)
                    ? -1
                    : 1
                },
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
                comparator: (r1, r2) => {
                  if (!r1.item.departure) {
                    return 1
                  }
                  if (!r2.item.departure) {
                    return -1
                  }
                  return new Date(r1.item.departure) >
                    new Date(r2.item.departure)
                    ? -1
                    : 1
                },
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
                comparator: (r1, r2) => {
                  if (!r1.item.cost) {
                    return 1
                  }
                  if (!r2.item.cost) {
                    return -1
                  }
                  return r1.item.cost > r2.item.cost ? -1 : 1
                },
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
            rows={}
          />
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatFlightsPage)
