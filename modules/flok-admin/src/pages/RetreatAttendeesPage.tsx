import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import RetreatAttendeesTable from "../components/retreats/RetreatAttendeesTable"
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
}))

type RetreatAttendeesPageProps = RouteComponentProps<{
  retreatId: string
}>

function RetreatAttendeesPage(props: RetreatAttendeesPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404

  // Get retreat data
  let retreat = useSelector((state: RootState) => {
    return state.admin.retreatsDetails[retreatId]
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
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatPage", {
              retreatId: retreatId.toString(),
            })}
            component={ReactRouterLink}>
            {retreat?.company_name}
          </Link>
          <AppTypography color="textPrimary">Attendees</AppTypography>
        </Breadcrumbs>
        <Typography variant="h1">
          {retreat?.company_name} - Attendees
        </Typography>
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
          onSelect={(id: number) => {
            dispatch(
              push(
                AppRoutes.getPath("RetreatAttendeePage", {
                  retreatId: retreatId.toString(),
                })
              )
            )
          }}
        />
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatAttendeesPage)
