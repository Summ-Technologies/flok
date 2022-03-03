import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  makeStyles,
  Tab,
  Tabs,
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
import RetreatAttendeesTable from "../components/retreats/RetreatAttendeesTable"
import RetreatOverviewForm from "../components/retreats/RetreatInfoForm"
import RetreatLodgingDetails from "../components/retreats/RetreatLodgingDetails"
import {AdminRetreatAttendeeModel} from "../models"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatAttendees, getRetreatDetails} from "../store/actions/admin"
import {theme} from "../theme"
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

  let [attendeeQuery, setAttendeeQuery] = useQuery("attendee")
  let attendee = useSelector((state: RootState) => {
    if (attendeeQuery === "new") {
      return {id: -1} as AdminRetreatAttendeeModel
    }
    return state.admin.attendeesByRetreat[retreatId]?.find(
      (o) => o.id === parseInt(attendeeQuery || "-1")
    )
  })

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
            <AppTypography color="textPrimary">
              {retreat.company_name}
            </AppTypography>
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
              ) : attendee === undefined ? (
                <>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    width="100%"
                    marginBottom={theme.spacing(0.25)}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setAttendeeQuery("new")}>
                      Create New Attendee
                    </Button>
                  </Box>
                  <RetreatAttendeesTable
                    rows={
                      retreatAttendees
                        ? retreatAttendees.map((a) => ({
                            id: a.id,
                            city: a.city,
                            email: a.email_address,
                            name: a.name,
                            dietaryPrefs: a.dietary_prefs,
                            notes: a.notes,
                            infoStatus: a.info_status,
                            flightStatus: a.flight_status,
                          }))
                        : []
                    }
                    onSelect={function (id: number): void {
                      setAttendeeQuery(id.toString())
                      // setAttendee(retreatAttendees.find((obj) => obj.id === id))
                    }}
                  />
                </>
              ) : attendee ? (
                <RetreatAttendeeInfoForm
                  attendee={attendee}
                  onBack={() => setAttendeeQuery("")}
                  retreatId={retreatId}
                />
              ) : undefined
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
