import {
  Badge,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Link,
  makeStyles,
} from "@material-ui/core"
import {CalendarToday, ExpandMore} from "@material-ui/icons"
import {useState} from "react"
import ReactMarkdown from "react-markdown"
import config from "../../config"
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
          disabled={props.disabled}
          checked={task.state === "COMPLETED"}
          onClick={() => props.handleCheckboxClick(task)}
          color="default"
        />
        <AppTypography className={classes.title}>
          {task.link_override ? (
            <Link
              href={task.link_override}
              target={task.link_override.startsWith(".") ? "_self" : "_blank"}>
              {task.task.title}
            </Link>
          ) : task.task.link ? (
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
          <ReactMarkdown>
            {task.task.description ? task.task.description : ""}
          </ReactMarkdown>
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
}))
export default function AppTodoList(props: {
  retreatToTasks: RetreatToTask[]
  handleCheckboxClick: (task: RetreatToTask) => void
  orderBadge: boolean
  showMore?: boolean
}) {
  let classes = useListStyles(props)
  let [expanded, setExpanded] = useState(false)

  if (!props.showMore) {
    return (
      <div>
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
              handleCheckboxClick={props.handleCheckboxClick}
            />
          </Badge>
        ))}
      </div>
    )
  }

  console.log(config.appConfig)
  return (
    <>
      <div>
        {props.retreatToTasks
          .slice(0, config.appConfig.max_tasks)
          .map((t, i) => (
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
                handleCheckboxClick={props.handleCheckboxClick}
              />
            </Badge>
          ))}
      </div>
      <Collapse in={expanded}>
        {props.retreatToTasks.slice(config.appConfig.max_tasks).map((t, i) => (
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
              handleCheckboxClick={props.handleCheckboxClick}
            />
          </Badge>
        ))}
      </Collapse>
      <AppTypography
        style={{
          textDecoration: "underline",
          color: "#505050",
          fontSize: ".8em",
          display: "inline",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}>
        {expanded ? "show less" : "show more"}
      </AppTypography>
    </>
  )
}
