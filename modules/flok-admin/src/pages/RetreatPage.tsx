import {Breadcrumbs, Link, makeStyles, Typography} from "@material-ui/core"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import {AdminRetreatAttendeeModel} from "../models"
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

type RetreatPageProps = RouteComponentProps<{retreatId: string}>

function RetreatPage(props: RetreatPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404

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
      return {} as AdminRetreatAttendeeModel
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
        <Typography variant="h1">{retreat?.company_name}</Typography>
        <ul>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("RetreatSalesIntakePage", {
                retreatId: retreatId.toString(),
              })}>
              Sales/Intake
            </Link>
          </Typography>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("RetreatLodgingPage", {
                retreatId: retreatId.toString(),
              })}>
              Lodging
            </Link>
          </Typography>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("RetreatAttendeesPage", {
                retreatId: retreatId.toString(),
              })}>
              Attendees
            </Link>
          </Typography>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("RetreatFlightsPage", {
                retreatId: retreatId.toString(),
              })}>
              Flights
            </Link>
          </Typography>
          <Typography variant="body1" component="li">
            <Link
              component={ReactRouterLink}
              to={AppRoutes.getPath("RetreatItineraryPage", {
                retreatId: retreatId.toString(),
              })}>
              Itinerary
            </Link>
          </Typography>
        </ul>
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatPage)
