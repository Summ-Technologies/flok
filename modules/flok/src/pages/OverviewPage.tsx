import {Button, Divider, makeStyles} from "@material-ui/core"
import {CheckRounded, PriorityHighRounded} from "@material-ui/icons"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppAvatar from "../components/base/AppAvatar"
import AppProgressStepper from "../components/base/AppProgressStepper"
import AppTypography from "../components/base/AppTypography"
import AppSnapshotCardGroup from "../components/overview/AppSnapshotCardGroup"
import AppTodolist from "../components/overview/AppTodolist"
import AppTodolistItem from "../components/overview/AppTodolistItem"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

let useStyles = makeStyles((theme) => ({
  section: {
    "&:not(:first-child)": {
      marginTop: theme.spacing(6),
    },
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    "& > *:first-child": {
      marginRight: theme.spacing(1),
    },
    marginBottom: theme.spacing(2),
  },
  listItemBody: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
}))

type OverviewPageProps = RouteComponentProps<{}>
function OverviewPage(props: OverviewPageProps) {
  let classes = useStyles()
  return (
    <PageContainer>
      <PageSidenav activeItem="overview" />
      <PageBody
        HeaderProps={{
          header: "Overview",
          subheader: "GameStop Summer 2021 Retreat",
        }}>
        <div className={classes.section}>
          <AppSnapshotCardGroup />
        </div>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <AppAvatar size="md" color="warning">
              <PriorityHighRounded fontSize="small" />
            </AppAvatar>
            <AppTypography variant="h4">To Do List</AppTypography>
          </div>
          <AppTodolist>
            <AppTodolistItem
              header="Add attendees to your retreat"
              subheader="Let's hook up Slack so we can help coordinate everyone's flights."
              body={
                <div className={classes.listItemBody}>
                  <AppProgressStepper
                    steps={[
                      {
                        name: "Add attendees to Slack channel",
                        progress: "IN-PROGRESS",
                      },
                      {
                        name: "Add Flok with Slack Connect",
                        progress: "TODO",
                      },
                      {
                        name: "View and manage attendees",
                        progress: "TODO",
                      },
                    ]}
                  />
                  <Button color="primary" variant="contained">
                    See instructions
                  </Button>
                </div>
              }
            />
            <Divider />
            <AppTodolistItem
              state="LOCKED"
              header="Coordinate employee flights"
              subheader="Get your employees to your destination on time!"
            />
            <Divider />
            <AppTodolistItem
              state="LOCKED"
              header="Plan your itinerary"
              subheader="We'll help you plan the perfect itinerary for your trip!"
            />
          </AppTodolist>
        </div>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <AppAvatar size="md" color="success">
              <CheckRounded fontSize="small" />
            </AppAvatar>
            <AppTypography variant="h4">Completed</AppTypography>
          </div>
          <AppTodolist>
            <AppTodolistItem
              state="COMPLETED"
              header="Destination confirmed"
              subheader="Selected: Berlin, Germany"
              cta={
                <Button color="primary" variant="outlined">
                  Edit
                </Button>
              }
            />
            <Divider />
            <AppTodolistItem
              state="COMPLETED"
              header="Lodging confirmed"
              subheader="Selected: The Ritz-Carlton"
              cta={
                <Button color="primary" variant="outlined">
                  View Contact
                </Button>
              }
            />
          </AppTodolist>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(OverviewPage)
