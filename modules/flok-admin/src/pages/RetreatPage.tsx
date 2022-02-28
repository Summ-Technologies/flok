import {
  Breadcrumbs,
  Link,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import {RetreatAttendeeInfoForm} from "../components/retreats/RetreatAttendeeInfoForm"
import RetreatOverviewForm from "../components/retreats/RetreatInfoForm"
import RetreatLodgingDetails from "../components/retreats/RetreatLodgingDetails"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatAttendees, getRetreatDetails} from "../store/actions/admin"
import {useQuery} from "../utils"
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
  retreatHeader: {
    marginBottom: theme.spacing(2),
  },
}))

type RetreatPageProps = RouteComponentProps<{id: string}>

function RetreatPage(props: RetreatPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.id) || -1 // -1 for an id that will always return 404

  // Get retreat data
  let retreat = useSelector((state: RootState) => {
    return state.admin.retreatsDetails[retreatId]
  })
  let retreatApiCall = useSelector((state: RootState) => {
    return state.admin.api.retreatsDetails[retreatId]
  })
  let retreatAttendees = useSelector((state: RootState) => {
    return state.admin.attendeesByRetreat[retreatId]
  })

  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreatDetails(retreatId))
    }
    if (retreatAttendees === undefined) {
      dispatch(getRetreatAttendees(retreatId))
    }
  }, [retreat, dispatch, retreatId, retreatAttendees])

  // Editing
  let [tabQuery, setTabQuery] = useQuery("tab")
  const validTabs = ["overview", "lodging", "attendees"]

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
          {retreat != null ? (
            <Typography color="textPrimary">{retreat.company_name}</Typography>
          ) : undefined}
        </Breadcrumbs>
        {retreat == null &&
        retreatApiCall &&
        retreatApiCall.loading === true ? (
          <AppTypography variant="body1">Loading...</AppTypography>
        ) : retreat == null &&
          retreatApiCall &&
          retreatApiCall.status === 404 ? (
          <AppTypography variant="body1">Retreat Not Found</AppTypography>
        ) : retreat ? (
          <>
            <div className={classes.retreatHeader}>
              <AppTypography variant="h1">{retreat.company_name}</AppTypography>
              <AppTypography variant="body1">ID: {retreat.id}</AppTypography>
              <AppTypography variant="body1">
                GUID: {retreat.guid}
              </AppTypography>
              <Tabs
                value={
                  tabQuery && validTabs.includes(tabQuery)
                    ? tabQuery
                    : "overview"
                }
                onChange={(e, val) =>
                  setTabQuery(
                    val !== "overview" && validTabs.includes(val) ? val : null
                  )
                }
                variant="fullWidth"
                indicatorColor="primary">
                <Tab label="Overview" id="overview" value="overview" />
                <Tab label="Lodging" id="lodging" value="lodging" />
                <Tab label="Attendees" id="attendees" value="attendees" />
              </Tabs>
            </div>
            {tabQuery === "lodging" ? (
              <RetreatLodgingDetails retreat={retreat} />
            ) : tabQuery === "attendees" ? (
              retreatAttendees === undefined ? (
                <AppTypography variant="body1">Loading...</AppTypography>
              ) : (
                // <RetreatAttendeesTable
                //   rows={
                //     retreatAttendees
                //       ? retreatAttendees.map((a) => ({
                //           id: a.id,
                //           city: a.city,
                //           email: a.email_address,
                //           name: a.name,
                //           dietaryPrefs: a.dietary_prefs,
                //           notes: a.notes,
                //           infoStatus: a.info_status,
                //           flightStatus: a.flight_status,
                //         }))
                //       : []
                //   }
                //   onSelect={function (id: number): void {
                //     throw new Error("Function not implemented.")
                //   }}
                //   onTravelSelect={function (id: number): void {
                //     throw new Error("Function not implemented.")
                //   }}
                // />
                <RetreatAttendeeInfoForm attendee={retreatAttendees[0]} />
              )
            ) : (
              <RetreatOverviewForm retreat={retreat} />
            )}
          </>
        ) : undefined}
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatPage)
