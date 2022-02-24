import {Collapse, makeStyles} from "@material-ui/core"
import {
  Apartment,
  CalendarToday,
  CheckCircle,
  Error,
  Flight,
  People,
} from "@material-ui/icons"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router"
import AppTypography from "../components/base/AppTypography"
import AppOverviewCard, {
  AppOverviewCardList,
} from "../components/overview/AppOverviewCard"
import AppTodoList from "../components/overview/AppTaskList"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {RetreatToTask} from "../models/retreat"
import {putRetreatTask} from "../store/actions/retreat"
import {useRetreat} from "./misc/RetreatProvider"

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
  todoIcon: {},
  iconExpanded: {
    transform: "rotateZ(180deg)",
  },
}))

type RetreatOverviewProps = RouteComponentProps<{retreatIdx: string}>
function RetreatOverview(props: RetreatOverviewProps) {
  let classes = useStyles()
  // Path and query params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  let [datesOverview, setDatesOverview] = useState<string | undefined>(
    undefined
  )
  let [flightsOverview, setFlightsOverview] = useState<string | undefined>(
    undefined
  )
  useEffect(() => {
    setFlightsOverview(undefined)
    setDatesOverview(undefined)
  }, [setDatesOverview, setFlightsOverview])

  let [attendeesOverview, setAttendeesOverview] = useState<string | undefined>(
    undefined
  )
  useEffect(() => {
    setAttendeesOverview(
      retreat.preferences_num_attendees_lower?.toString() ?? ""
    )
  }, [retreat.preferences_num_attendees_lower])

  let [lodgingOverview, setLodgingOverview] = useState<string | undefined>(
    undefined
  )
  useEffect(() => {
    let newVal = undefined
    switch (retreat.state_lodging) {
      case "NOT_STARTED":
        break
      case "PROPOSALS_WAITING":
        newVal = "Gathering proposals"
        break
      case "PROPOSALS_VIEW":
        newVal = "Reviewing venues"
        break
      case "CONTRACT_NEGOTIATION":
        newVal = "Negotiating contract"
        break
      case "BOOKED":
        newVal = "Booked"
        break
    }
    setLodgingOverview(newVal)
  }, [retreat.state_lodging])

  let dispatch = useDispatch()
  const handleTaskClick = (task: RetreatToTask) => {
    dispatch(
      putRetreatTask(
        task.task.id,
        retreat.id,
        task.state === "COMPLETED" ? "TODO" : "COMPLETED"
      )
    )
  }

  let [tasksExpanded, setTasksExpanded] = useState(false)

  return (
    <PageContainer>
      <PageSidenav
        activeItem="overview"
        retreatIdx={retreatIdx}
        companyName={retreat?.company_name}
      />
      <PageBody>
        <div className={classes.section}>
          <AppTypography variant="h1" paragraph>
            Overview
          </AppTypography>
          <AppOverviewCardList>
            <AppOverviewCard
              label="Dates"
              Icon={CalendarToday}
              value={datesOverview}
            />
            <AppOverviewCard
              label="Attendees"
              Icon={People}
              value={attendeesOverview}
            />
            <AppOverviewCard
              label="Lodging"
              Icon={Apartment}
              value={lodgingOverview}
            />
            <AppOverviewCard
              label="Flights"
              Icon={Flight}
              value={flightsOverview}
            />
          </AppOverviewCardList>
        </div>
        <div className={classes.section}>
          <AppTypography variant="h4" paragraph>
            To Do List{" "}
            <Error
              color="inherit"
              className={`${classes.headerIcon} todo`}
              fontSize="small"
            />
          </AppTypography>
          {retreat && (
            <AppTodoList
              retreatToTasks={
                retreat.tasks_todo.sort((a, b) => a.order - b.order) || []
              }
              handleCheckboxClick={handleTaskClick}
              orderBadge={true}
              showMore
            />
          )}
        </div>
        <div className={classes.section}>
          <AppTypography variant="h4" paragraph>
            Completed{" "}
            <CheckCircle
              color="inherit"
              className={`${classes.headerIcon} completed`}
              fontSize="small"
            />
            {retreat && retreat.tasks_completed.length > 0 && (
              <AppTypography
                style={{
                  textDecoration: "underline",
                  color: "#505050",
                  fontSize: ".75em",
                  display: "inline",
                  cursor: "pointer",
                }}
                onClick={() => setTasksExpanded(!tasksExpanded)}>
                {tasksExpanded ? "hide" : "show completed"}
              </AppTypography>
            )}
            {/* <IconButton
                style={{padding: 0}}
                onClick={() => setTasksExpanded(!tasksExpanded)}
                className={tasksExpanded ? classes.iconExpanded : ""}>
                <ExpandMore />
              </IconButton> */}
          </AppTypography>
          {retreat && (
            <Collapse in={tasksExpanded}>
              <AppTodoList
                retreatToTasks={
                  retreat.tasks_completed.sort((a, b) => b.order - a.order) ||
                  []
                }
                handleCheckboxClick={handleTaskClick}
                orderBadge={false}
              />
            </Collapse>
          )}
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatOverview)
