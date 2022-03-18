import {
  Badge,
  Button,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Link,
  makeStyles,
  TextField,
} from "@material-ui/core"
import {CalendarToday, ExpandMore} from "@material-ui/icons"
import {useFormik} from "formik"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RetreatToTask, RetreatToTaskStateOptions} from "../../models"
import {patchRetreatTask} from "../../store/actions/admin"
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
    textDecoration: "strikethrough",
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
  disabled: boolean
  retreatId: number
}) {
  let classes = useItemStyles(props)
  let {task, retreatId} = props
  let [expanded, setExpanded] = useState(false)

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
    },
    onSubmit: (values) => {
      dispatch(
        patchRetreatTask(
          retreatId,
          values.order,
          values.state,
          new Date(values.dueDate)
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
          <form onSubmit={formik.handleSubmit}>
            <TextField
              id="state"
              select
              SelectProps={{native: true}}
              onChange={formik.handleChange}
              label="State"
              value={formik.values.state}>
              {RetreatToTaskStateOptions.map((o, i) => (
                <option key={i} value={o} label={o} />
              ))}
            </TextField>
            <TextField
              id="dueDate"
              type="date"
              value={formik.values.dueDate}
              label="Due Date"
              onChange={formik.handleChange}
            />
            <TextField
              disabled
              id="order"
              type="number"
              value={formik.values.order}
              onChange={formik.handleChange}
              label="Order"
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </div>
      </Collapse>
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
