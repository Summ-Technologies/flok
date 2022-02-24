import {Button, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppExpandableTable from "../components/base/AppExpandableTable"
import AppTypography from "../components/base/AppTypography"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
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
}))

function currencyFormat(num: Number) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function dateFormat(date: Date | undefined) {
  if (date === undefined) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

type RetreatFlightsProps = RouteComponentProps<{retreatIdx: string}>
function RetreatFlightsPage(props: RetreatFlightsProps) {
  let dispatch = useDispatch()
  let classes = useStyles()

  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  let attendeeTravelInfo = useRetreatAttendees(retreat.id)

  return (
    <PageContainer>
      <PageSidenav
        activeItem="flights"
        retreatIdx={retreatIdx}
        companyName={retreat?.company_name}
      />
      <PageBody>
        <div className={classes.section}>
          <AppTypography variant="h1" paragraph>
            Flights
          </AppTypography>
          <AppExpandableTable
            headers={[
              {
                name: "Employee",
                comparator: (r1, r2) =>
                  r1[0].toString().localeCompare(r2[0].toString()),
              },
              {name: "Retreat Arrival"},
              {name: "Retreat Departure"},
              {name: "Cost"},
              {
                name: "Status",
                comparator: (r1, r2) => {
                  let comp = 0
                  if (r1[4].toString().toLowerCase() === "pending") {
                    comp += 1
                  }
                  if (r2[4].toString().toLowerCase() === "pending") {
                    comp -= 1
                  }
                  return comp
                },
              },
            ]}
            rows={
              attendeeTravelInfo !== "RESOURCE_NOT_FOUND" &&
              attendeeTravelInfo !== undefined
                ? attendeeTravelInfo.map((info) => ({
                    id: info.id,
                    cols: [
                      info.name,
                      info.travel?.arr_trip?.arr_datetime ? (
                        dateFormat(
                          new Date(info.travel?.arr_trip?.arr_datetime!)
                        )
                      ) : (
                        <></>
                      ),
                      info.travel?.dep_trip?.dep_datetime ? (
                        dateFormat(
                          new Date(info.travel?.dep_trip?.dep_datetime!)
                        )
                      ) : (
                        <></>
                      ),
                      info.travel ? currencyFormat(info.travel.cost) : "",
                      info.travel ? info.travel.status : "PENDING",
                    ],
                  }))
                : []
            }
          />
          <div className={classes.addBtn}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                dispatch(
                  push(
                    AppRoutes.getPath("RetreatAttendeesPage", {
                      retreatId: retreatIdx.toString(),
                    })
                  )
                )
              }}>
              Add Attendee
            </Button>
          </div>
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatFlightsPage)
