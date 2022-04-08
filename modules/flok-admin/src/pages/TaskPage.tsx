import {Box, Breadcrumbs, Link, makeStyles, Typography} from "@material-ui/core"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import TaskForm from "../components/tasks/TaskForm"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getTasksList} from "../store/actions/admin"

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

type TaskPageProps = RouteComponentProps<{taskId: string}>

function TaskPage(props: TaskPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let taskId = parseInt(props.match.params.taskId) ?? -1 // -1 for an id that will always return 404

  useEffect(() => {
    dispatch(getTasksList())
  }, [dispatch])

  // Get task data
  let task = useSelector((state: RootState) => {
    return state.admin.tasks[taskId]
  })

  return (
    <PageBase>
      <div className={classes.body}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            to={AppRoutes.getPath("TasksPage")}
            component={ReactRouterLink}>
            All Tasks
          </Link>
          {task != null ? (
            <AppTypography color="textPrimary">{task.title}</AppTypography>
          ) : undefined}
        </Breadcrumbs>
        <Typography variant="h1">Task</Typography>
        {task != null && (
          <Box marginTop={2}>
            <TaskForm taskId={taskId} />
          </Box>
        )}
      </div>
    </PageBase>
  )
}

export default withRouter(TaskPage)
