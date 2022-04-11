import {
  Badge,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Dialog,
  IconButton,
  Link,
  makeStyles,
  Paper,
  Tooltip,
} from "@material-ui/core"
import {CalendarToday, Error, ExpandMore} from "@material-ui/icons"
import {useState} from "react"
import ReactMarkdown from "react-markdown"
import {RetreatToTask} from "../../models"
import AppTypography from "../base/AppTypography"
import RetreatTaskForm from "./RetreatTaskForm"

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
    textDecoration: "strikethrough",
  },
  desc: {
    paddingLeft: 42,
    paddingBottom: 12,
    "& > *": {
      marginBottom: theme.spacing(2),
    },
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
  submitButton: {
    display: "block",
    marginTop: theme.spacing(0.5),
  },
  subtitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  taskFormModal: {
    padding: theme.spacing(2),
    width: "100%",
  },
  chip: {
    marginLeft: theme.spacing(1),
  },
}))

function TodoListItem(props: {
  task: RetreatToTask
  disabled: boolean
  retreatId: number
}) {
  let classes = useItemStyles(props)
  let {task, retreatId} = props
  let [expanded, setExpanded] = useState(false)
  let [open, setOpen] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={classes.root}>
      <div className={classes.summary}>
        <Checkbox
          disabled
          checked={task.state === "COMPLETED"}
          color="default"
        />
        <AppTypography className={classes.title}>
          {task.link ? (
            <Tooltip title={<>{`Link to: ${task.link}`}</>}>
              <Link
                href={task.link.startsWith("http") ? task.link : undefined}
                target={task.link.startsWith("http") ? "_blank" : undefined}>
                {task.title}
              </Link>
            </Tooltip>
          ) : (
            <>{task.title}</>
          )}

          {task.is_flok_task && (
            <Chip className={classes.chip} label="Flok Task"></Chip>
          )}
        </AppTypography>
        <div style={{flexGrow: 1}}></div>
        {task.due_date ? (
          <Chip
            label={dateFormatShort(new Date(task.due_date))}
            icon={<CalendarToday />}
            size="small"
          />
        ) : (
          <></>
        )}
        {task.task_vars &&
        Object.values(task.task_vars).filter((v) => v).length ? (
          <Tooltip
            title={
              'This task is missing required input variables. Please "Edit task" to update those variables.'
            }>
            <Chip
              style={{backgroundColor: "red", color: "white"}}
              label={"Requires input"}
              icon={<Error style={{color: "white"}} />}
              color="default"
              size="small"
            />
          </Tooltip>
        ) : (
          <></>
        )}
        <IconButton
          onClick={handleExpandClick}
          className={expanded ? classes.iconExpanded : ""}>
          <ExpandMore />
        </IconButton>
      </div>
      <Collapse in={expanded}>
        <div className={classes.desc}>
          {task.description ? (
            <>
              <AppTypography variant="h4">Description</AppTypography>
              <ReactMarkdown>{task.description}</ReactMarkdown>
            </>
          ) : undefined}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}>
            Edit Task
          </Button>
        </div>
      </Collapse>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg">
        <Paper elevation={1} className={classes.taskFormModal}>
          <RetreatTaskForm retreatId={retreatId} retreatToTask={task} />
        </Paper>
      </Dialog>
    </div>
  )
}

let useListStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    "& > .MuiBadge-anchorOriginTopLeftRectangle": {
      top: 12,
    },
  },
  expandCollapseText: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    textDecoration: "underline",
    color: "#505050",
    fontSize: ".8em",
    cursor: "pointer",
  },
}))
export default function AppTodoList(props: {
  retreatId: number
  retreatToTasks: RetreatToTask[]
  orderBadge: boolean
  collapsed?: boolean
}) {
  let classes = useListStyles(props)
  return (
    <Collapse in={!props.collapsed}>
      {props.retreatToTasks.map((t, i) => (
        <Badge
          className={classes.wrapper}
          anchorOrigin={{vertical: "top", horizontal: "left"}}
          badgeContent={t.order}
          overlap="rectangle"
          invisible={!props.orderBadge}
          color="primary">
          <TodoListItem
            task={t}
            disabled={i !== 0}
            retreatId={props.retreatId}
          />
        </Badge>
      ))}
    </Collapse>
  )
}
