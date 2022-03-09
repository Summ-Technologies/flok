import {
  Breadcrumbs,
  Link,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core"
import {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTabPanel from "../components/base/AppTabPanel"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import {RetreatAttendeeInfoForm} from "../components/retreats/RetreatAttendeeInfoForm"
import RetreatAttendeeTravelForm from "../components/retreats/RetreatAttendeeTravelForm"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {useQuery, useRetreat, useRetreatAttendees} from "../utils"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

type RetreatAttendeePageProps = RouteComponentProps<{
  retreatId: string
  attendeeId: string
}>

function RetreatAttendeePage(props: RetreatAttendeePageProps) {
  let classes = useStyles(props)
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404

  // Get retreat data
  let [retreat] = useRetreat(retreatId)
  useRetreatAttendees(retreatId)

  let attendeeId = parseInt(props.match.params.attendeeId) || -1
  let attendee = useSelector((state: RootState) => {
    return state.admin.attendeesByRetreat[retreatId]?.find(
      (o) => o.id === attendeeId
    )
  })

  let [tabQuery, setTabQuery] = useQuery("tab")
  let [tabValue, setTabValue] = useState<string | undefined>(undefined)
  useEffect(() => {
    const TABS = ["info", "flights"]
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "info")
  }, [tabQuery, setTabValue])

  return (
    <PageBase>
      <div className={classes.body}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatsPage")}
            component={ReactRouterLink}>
            All Retreats
          </Link>
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatPage", {
              retreatId: retreatId.toString(),
            })}
            component={ReactRouterLink}>
            {retreat?.company_name}
          </Link>
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatAttendeesPage", {
              retreatId: retreatId.toString(),
            })}
            component={ReactRouterLink}>
            Attendees
          </Link>
          <AppTypography color="textPrimary">{attendee?.name}</AppTypography>
        </Breadcrumbs>
        <Typography variant="h1">{attendee?.name}</Typography>
        {attendee && (
          <>
            <Tabs
              className={classes.tabs}
              value={tabValue}
              onChange={(e, newVal) =>
                setTabQuery(newVal === "profile" ? null : newVal)
              }
              variant="fullWidth"
              indicatorColor="primary">
              <Tab value="info" label="Attendee info" />
              <Tab value="flights" label="Attendee flights" />
            </Tabs>
            <AppTabPanel show={tabValue === "info"}>
              <RetreatAttendeeInfoForm
                attendee={attendee}
                retreatId={retreatId}
              />
            </AppTabPanel>
            <AppTabPanel show={tabValue === "flights"}>
              <RetreatAttendeeTravelForm
                attendee={attendee}
                retreatId={retreatId}
              />
            </AppTabPanel>
          </>
        )}
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatAttendeePage)
