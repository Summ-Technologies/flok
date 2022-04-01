import {
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Link,
  makeStyles,
  Modal,
  Paper,
} from "@material-ui/core"
import {CalendarToday, ExpandMore} from "@material-ui/icons"
import {useFormik} from "formik"
import {useState} from "react"
import ReactMarkdown from "react-markdown"
import {useDispatch} from "react-redux"
import {RetreatToTask} from "../../models"
import {patchRetreatTask} from "../../store/actions/admin"
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
  input: {
    margin: theme.spacing(0.5),
  },
  submitButton: {
    display: "block",
    marginTop: theme.spacing(0.5),
  },
  subtitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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

  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      state: task.state,
      dueDate: task.due_date ?? "",
      order: task.order,
      taskVars: task.task_vars,
    },
    onSubmit: (values) => {
      dispatch(
        patchRetreatTask(
          retreatId,
          task.task.id,
          values.order,
          values.state,
          new Date(values.dueDate),
          values.taskVars
        )
      )
    },
  })

  return (
    <div className={classes.root}>
      <div className={classes.summary}>
        <Checkbox
          disabled
          checked={task.state === "COMPLETED"}
          color="default"
        />
        <AppTypography className={classes.title}>
          {task.task.link ? (
            <Link
              href={task.task.link}
              target={task.task.link.startsWith(".") ? "_self" : "_blank"}>
              {task.task.title}
            </Link>
          ) : (
            <>{task.task.title}</>
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
        <IconButton
          onClick={handleExpandClick}
          className={expanded ? classes.iconExpanded : ""}>
          <ExpandMore />
        </IconButton>
      </div>
      <Collapse in={expanded}>
        <div className={classes.desc}>
          {task.task.description ? (
            <>
              <AppTypography variant="h4">Description</AppTypography>
              <ReactMarkdown>{task.task.description}</ReactMarkdown>
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="fixed"
          top="50%"
          left="50%"
          style={{
            transform: "translate(-50%, -50%)",
          }}>
          <Paper elevation={1} style={{padding: 12}}>
            <RetreatTaskForm retreatId={retreatId} task={task} />
          </Paper>
        </Box>
      </Modal>
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
