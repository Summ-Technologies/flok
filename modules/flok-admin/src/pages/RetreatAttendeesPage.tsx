import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {push} from "connected-react-router"
import _ from "lodash"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import NewRetreatAttendeeForm from "../components/retreats/NewRetreatAttendeeForm"
import RetreatAttendeesTable from "../components/retreats/RetreatAttendeesTable"
import {AppRoutes} from "../Stack"
import {theme} from "../theme"
import {useRetreat, useRetreatAttendees} from "../utils"

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
  let [retreat] = useRetreat(retreatId)
  let [retreatAttendees] = useRetreatAttendees(retreatId)
  let [newAttendeeOpen, setNewAttendeeOpen] = useState(false)

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
            onClick={() => setNewAttendeeOpen(true)}>
            Create New Attendee
          </Button>
          <Dialog
            fullWidth
            open={newAttendeeOpen}
            onClose={() => setNewAttendeeOpen(false)}>
            <NewRetreatAttendeeForm
              retreatId={retreatId}
              onSuccess={() => setNewAttendeeOpen(false)}
            />
          </Dialog>
        </Box>
        <RetreatAttendeesTable
          rows={
            retreatAttendees
              ? retreatAttendees.map((a) =>
                  _.pick(a, ["id", "name", "email_address", "city"])
                )
              : []
          }
          onSelect={(id: number) => {
            dispatch(
              push(
                AppRoutes.getPath("RetreatAttendeePage", {
                  retreatId: retreatId.toString(),
                  attendeeId: id.toString(),
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
