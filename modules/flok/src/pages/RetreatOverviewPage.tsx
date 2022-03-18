import {Box, makeStyles, Typography} from "@material-ui/core"
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
import config, {MAX_TASKS} from "../config"
import {RetreatToTask} from "../models/retreat"
import {putRetreatTask} from "../store/actions/retreat"
import {parseTaskTemplates} from "../utils/retreatUtils"
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
  expandButtons: {
    textDecoration: "underline",
    cursor: "pointer",
  },
}))

type RetreatOverviewProps = RouteComponentProps<{retreatIdx: string}>
function RetreatOverviewPage(props: RetreatOverviewProps) {
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

  let [todoTasksCollapsed, setTodoTasksCollapsed] = useState(true)
  let [completedTasksCollapsed, setCompletedTasksCollapsed] = useState(true)
  const MAX_TASKS_SHOWN =
    parseInt(config.get(MAX_TASKS)) > 0
      ? parseInt(config.get(MAX_TASKS))
      : undefined
  let [todoTasks, setTodoTasks] = useState<RetreatToTask[]>([])
  let [todoTasksExtra, setTodoTasksExtra] = useState<RetreatToTask[]>([])

  useEffect(() => {
    if (MAX_TASKS_SHOWN === undefined) {
      setTodoTasksExtra([])
      setTodoTasks(parseTaskTemplates(retreat, retreatIdx).tasks_todo)
    } else {
      setTodoTasksExtra(
        parseTaskTemplates(retreat, retreatIdx)
          .tasks_todo.slice(MAX_TASKS_SHOWN)
          .sort((a, b) => a.order - b.order)
      )
      setTodoTasks(
        parseTaskTemplates(retreat, retreatIdx)
          .tasks_todo.slice(0, MAX_TASKS_SHOWN)
          .sort((a, b) => a.order - b.order)
      )
    }
  }, [MAX_TASKS_SHOWN, setTodoTasksExtra, setTodoTasks, retreat, retreatIdx])

  return (
    <PageContainer>
      <PageSidenav
        activeItem="overview"
        retreatIdx={retreatIdx}
        companyName={retreat?.company_name}
      />
      <PageBody appBar>
        <div className={classes.section}>
          <Typography variant="h1">Overview</Typography>
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
          <AppTodoList
            retreatToTasks={todoTasks}
            handleCheckboxClick={handleTaskClick}
            orderBadge={true}
          />
          {todoTasksExtra.length > 0 ? (
            <>
              <AppTodoList
                retreatToTasks={todoTasksExtra}
                handleCheckboxClick={handleTaskClick}
                orderBadge={true}
                collapsed={todoTasksCollapsed}
              />
              <Box marginTop={2}>
                <Typography
                  className={classes.expandButtons}
                  component="span"
                  color="textSecondary"
                  variant="body2"
                  onClick={() => setTodoTasksCollapsed(!todoTasksCollapsed)}>
                  {todoTasksCollapsed ? "show more" : "show less"}
                </Typography>
              </Box>
            </>
          ) : undefined}
        </div>
        <div className={classes.section}>
          <AppTypography variant="h4" paragraph>
            Completed{" "}
            <CheckCircle
              color="inherit"
              className={`${classes.headerIcon} completed`}
              fontSize="small"
            />
            {retreat.tasks_completed.length > 0 && (
              <Typography
                component="span"
                className={classes.expandButtons}
                variant="body2"
                onClick={() =>
                  setCompletedTasksCollapsed(!completedTasksCollapsed)
                }>
                {completedTasksCollapsed ? "show completed" : "hide"}
              </Typography>
            )}
          </AppTypography>
          <AppTodoList
            retreatToTasks={parseTaskTemplates(
              retreat,
              retreatIdx
            ).tasks_completed.sort((a, b) => b.order - a.order)}
            handleCheckboxClick={handleTaskClick}
            orderBadge={false}
            collapsed={completedTasksCollapsed}
          />
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatOverviewPage)
