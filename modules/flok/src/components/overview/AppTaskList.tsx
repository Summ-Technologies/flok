import {
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Link,
  makeStyles,
} from "@material-ui/core"
import {CalendarToday, ExpandMore} from "@material-ui/icons"
import {useState} from "react"
import {RetreatToTask} from "../../models/retreat"
import AppTypography from "../base/AppTypography"

const dateFormatShort = (date: Date) =>
  date.toLocaleDateString("en-US", {month: "short", day: "numeric"})

let useItemStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "12px",
    backgroundColor: theme.palette.background.paper,
    padding: 6,
    borderRadius: 5,
  },
  summary: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    lineHeight: "1em",
  },
}))

function TodoListItem(props: {task: RetreatToTask}) {
  let classes = useItemStyles(props)
  let {task} = props
  let [taskComplete, setTaskComplete] = useState(task.state === "COMPLETED")
  let [expanded, setExpanded] = useState(false)

  //TODO: handle backend changes to task state as well
  const handleCheckboxClick = () => {
    if (task.task.user_complete && !taskComplete) {
      setTaskComplete(true)
    } else if (task.task.user_complete && taskComplete) {
      setTaskComplete(false)
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={classes.root}>
      <div className={classes.summary}>
        <Checkbox
          disabled={!task.task.user_complete || task.state === "COMPLETED"}
          checked={taskComplete}
          onClick={handleCheckboxClick}
        />
        <AppTypography className={classes.title}>
          <Link
            href={task.task.link}
            target={task.task.user_complete ? "_blank" : "_self"}>
            {task.task.title}
          </Link>
        </AppTypography>
        <div style={{flexGrow: 1}}></div>
        {task.due_date ? (
          <Chip
            label={dateFormatShort(task.due_date)}
            icon={<CalendarToday />}
            size="small"
          />
        ) : (
          <></>
        )}
        {task.task.description ? (
          <IconButton onClick={handleExpandClick}>
            <ExpandMore />
          </IconButton>
        ) : (
          <div style={{padding: 24}}></div>
        )}
      </div>
      <Collapse in={expanded}>
        <AppTypography>{task.task.description}</AppTypography>
      </Collapse>
    </div>
  )
}

let useListStyles = makeStyles((theme) => ({}))
export default function AppTodoList(props: {retreatToTasks: RetreatToTask[]}) {
  let classes = useListStyles(props)

  console.log(props)

  return (
    <div>
      {props.retreatToTasks.map((t) => (
        <TodoListItem task={t} />
      ))}
    </div>
  )
}
