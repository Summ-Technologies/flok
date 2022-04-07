import {makeStyles, Typography} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBase from "../components/page/PageBase"
import {TasksTableRow} from "../components/retreats/RetreatsTable"
import TasksTable from "../components/tasks/TasksTable"
import {AdminRetreatListType, RetreatTask} from "../models"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getRetreatsList, getTasksList} from "../store/actions/admin"
import {useQuery} from "../utils"

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

type RetreatsPageProps = RouteComponentProps<{}>

function TasksPage(props: RetreatsPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let [retreatsType, setRetreatsType] = useState<
    AdminRetreatListType | undefined
  >(undefined)
  let [retreatsTypeQuery, setRetreatsTypeQuery] = useQuery("type")

  useEffect(() => {
    dispatch(getTasksList())
  }, [dispatch])

  useEffect(() => {
    if (
      retreatsTypeQuery == null ||
      retreatsTypeQuery.toLowerCase() === "active" ||
      !["inactive", "complete"].includes(retreatsTypeQuery.toLowerCase())
    ) {
      setRetreatsType("active")
    } else {
      setRetreatsType(retreatsTypeQuery.toLowerCase() as AdminRetreatListType)
    }
  }, [retreatsTypeQuery, setRetreatsTypeQuery, setRetreatsType])

  useEffect(() => {
    if (retreatsType) {
      dispatch(getRetreatsList(retreatsType))
    }
  }, [retreatsType, dispatch])

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
