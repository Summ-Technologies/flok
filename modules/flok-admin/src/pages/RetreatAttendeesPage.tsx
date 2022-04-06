import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  Link,
  makeStyles,
  Tab,
  Tabs,
} from "@material-ui/core"
import {push} from "connected-react-router"
import _ from "lodash"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTabPanel from "../components/base/AppTabPanel"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import AttendeesRegistrationFormIdForm from "../components/retreats/AttendeesRegistrationFormIdForm"
import NewRetreatAttendeeForm from "../components/retreats/NewRetreatAttendeeForm"
import RetreatAttendeesTable from "../components/retreats/RetreatAttendeesTable"
import RetreatStateTitle from "../components/retreats/RetreatStateTitle"
import {AppRoutes} from "../Stack"
import {theme} from "../theme"
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
  tabBody: {
    flex: "1 1 auto",
    minHeight: 0,
  },
}))

type RetreatAttendeesPageProps = RouteComponentProps<{
  retreatId: string
}>

function RetreatAttendeesPage(props: RetreatAttendeesPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404
  let [tabQuery, setTabQuery] = useQuery("tab")
  let [tabValue, setTabValue] = useState<string | undefined>(undefined)
  useEffect(() => {
    const TABS = ["other info", "attendees"]
    setTabValue(tabQuery && TABS.includes(tabQuery) ? tabQuery : "attendees")
  }, [tabQuery, setTabValue])

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

        {retreat && <RetreatStateTitle retreat={retreat} type="attendees" />}
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

        {retreat && (
          <>
            <Tabs
              value={tabValue}
              onChange={(e, newVal) =>
                setTabQuery(newVal === "attendees" ? null : newVal)
              }
              variant="fullWidth"
              indicatorColor="primary">
              <Tab value="attendees" label="Attendees" />
              <Tab value="other info" label="Other info" />
            </Tabs>
            <AppTabPanel
              show={tabValue === "attendees"}
              className={classes.tabBody}>
              <RetreatAttendeesTable
                rows={
                  retreatAttendees
                    ? retreatAttendees.map((a) =>
                        _.pick(a, [
                          "id",
                          "name",
                          "email_address",
                          "info_status",
                        ])
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
            </AppTabPanel>
            <AppTabPanel
              show={tabValue === "other info"}
              className={classes.tabBody}>
              <AttendeesRegistrationFormIdForm retreatId={retreat.id} />
            </AppTabPanel>
          </>
        )}
      </div>
    </PageBase>
  )
}

export default withRouter(RetreatAttendeesPage)
