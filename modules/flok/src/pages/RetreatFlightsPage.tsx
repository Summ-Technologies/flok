import {makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppExpandableTable from "../components/base/AppExpandableTable"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import UnderConstructionView from "../components/page/UnderConstructionView"
import {RetreatModel} from "../models/retreat"
import {useRetreat, useRetreatFlightInfo} from "../utils/lodgingUtils"

const UNDER_CONSTRUCTION = true

let useStyles = makeStyles((theme) => ({
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
  let classes = useStyles()

  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat(retreatIdx) as RetreatModel | undefined

  let attendeeTravelInfo = useRetreatFlightInfo(retreatIdx)

  return (
    <RetreatRequired retreatIdx={retreatIdx}>
      <PageContainer>
        <PageSidenav
          activeItem="flights"
          retreatIdx={retreatIdx}
          companyName={retreat?.company_name}
        />
        <PageBody>
          {UNDER_CONSTRUCTION ? (
            <UnderConstructionView />
          ) : (
            <>
              <AppTypography variant="h1" paragraph>
                Flights
              </AppTypography>
              <AppExpandableTable
                headers={[
                  {
                    name: "Employee",
                    comparator: (r1, r2) => r1[0].localeCompare(r2[0]),
                  },
                  {name: "Retreat Arrival"},
                  {name: "Retreat Departure"},
                  {name: "Cost"},
                  {
                    name: "Status",
                    comparator: (r1, r2) => {
                      let comp = 0
                      if (r1[4].toLowerCase() === "pending") {
                        comp += 1
                      }
                      if (r2[4].toLowerCase() === "pending") {
                        comp -= 1
                      }
                      return comp
                    },
                  },
                ]}
                rows={
                  attendeeTravelInfo !== "RESOURCE_NOT_FOUND" &&
                  attendeeTravelInfo !== undefined
                    ? attendeeTravelInfo.map((info) => [
                        info.name,
                        dateFormat(info.travel?.arr_trip?.arr_datetime),
                        dateFormat(info.travel?.dep_trip?.dep_datetime),
                        info.travel ? currencyFormat(info.travel.cost) : "",
                        info.travel ? info.travel.status : "PENDING",
                      ])
                    : []
                }
              />
            </>
          )}
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(RetreatFlightsPage)
