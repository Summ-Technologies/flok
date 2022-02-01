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
  new Date(date).toLocaleDateString("en-US", {month: "short", day: "numeric"})

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
  desc: {
    paddingLeft: 42,
    paddingBottom: 12,
  },
  iconExpanded: {
    transform: "rotateZ(180deg)",
  },
  dueDate: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    width: "30%",
    maxWidth: 200,
    marginBottom: 12,
  },
}))

function TodoListItem(props: {
  task: RetreatToTask
  handleCheckboxClick: (task: RetreatToTask) => void
}) {
  let classes = useItemStyles(props)
  let {task} = props
  let [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={classes.root}>
      <div className={classes.summary}>
        <Checkbox
          disabled={!task.task.user_complete}
          checked={task.state === "COMPLETED"}
          onClick={() => props.handleCheckboxClick(task)}
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
          <IconButton
            onClick={handleExpandClick}
            className={expanded ? classes.iconExpanded : ""}>
            <ExpandMore />
          </IconButton>
        ) : (
          <div style={{padding: 24}}></div>
        )}
      </div>
      <Collapse in={expanded}>
        <div className={classes.desc}>
          {task.due_date ? (
            <>
              <div className={classes.dueDate}>
                <AppTypography variant="body2" color="textSecondary">
                  Task due date:{"  "}
                </AppTypography>
                <Chip
                  label={dateFormatShort(task.due_date)}
                  icon={<CalendarToday />}
                  size="small"
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <AppTypography fontWeight="bold" style={{lineHeight: "2em"}}>
            {task.task.title}
          </AppTypography>
          <AppTypography>{task.task.description}</AppTypography>
        </div>
      </Collapse>
    </div>
  )
}

let useListStyles = makeStyles((theme) => ({}))
export default function AppTodoList(props: {
  retreatToTasks: RetreatToTask[]
  handleCheckboxClick: (task: RetreatToTask) => void
}) {
  let classes = useListStyles(props)

  return (
    <div>
      {props.retreatToTasks.map((t) => (
        <TodoListItem
          task={t}
          handleCheckboxClick={props.handleCheckboxClick}
        />
      ))}
    </div>
  )
}
