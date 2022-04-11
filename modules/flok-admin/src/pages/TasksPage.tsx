import {makeStyles, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBase from "../components/page/PageBase"
import TasksTable, {TasksTableRow} from "../components/tasks/TasksTable"
import {RetreatTask} from "../models"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getTasksList} from "../store/actions/admin"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  table: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

type TasksPageProps = RouteComponentProps<{}>

function TasksPage(props: TasksPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTasksList())
  }, [dispatch])

  function transformToRows(tasks: RetreatTask[]): {
    [id: number]: TasksTableRow
  } {
    let rowsDict: {
      [id: number]: TasksTableRow
    } = {}
    tasks.forEach((task) => {
      rowsDict[task.id] = {
        id: task.id,
        title: task.title,
        description: task.description,
        link: task.link,
      }
    })
    return rowsDict
  }

  let tasks = useSelector((state: RootState) => {
    return transformToRows(
      Object.values(state.admin.tasks).filter((task) => task) as RetreatTask[]
    )
  })

  return (
    <PageBase>
      <div className={classes.body}>
        <Typography variant="h1">Tasks Page</Typography>

        <div className={classes.table}>
          <TasksTable
            rows={Object.values(tasks)}
            onSelect={(id) =>
              dispatch(
                push({
                  pathname: AppRoutes.getPath("TaskPage", {
                    taskId: id.toString(),
                  }),
                })
              )
            }
          />
        </div>
      </div>
    </PageBase>
  )
}

export default withRouter(TasksPage)
