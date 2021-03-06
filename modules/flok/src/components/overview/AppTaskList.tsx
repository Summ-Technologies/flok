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
import {RetreatToTask} from "../../models/retreat"
import {parseRetreatTask} from "../../utils/retreatUtils"
import AppMoreInfoIcon from "../base/AppMoreInfoIcon"
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
  chip: {
    marginLeft: theme.spacing(1),
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

  function getExtraLinkProps(url: string) {
    if (url.startsWith("http")) {
      return {
        target: "_blank",
      }
    } else {
      return {}
    }
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
        <AppTypography
          className={classes.title}
          fontWeight={expanded ? "bold" : "regular"}>
          {task.link ? (
            <Link href={task.link} {...getExtraLinkProps(task.link)}>
              {task.title}
            </Link>
          ) : (
            task.title
          )}
        </AppTypography>
        {task.is_flok_task && (
          <Chip
            className={classes.chip}
            label={
              <>
                Flok Task{" "}
                <AppMoreInfoIcon tooltipText="Don't worry about completing this task. We'll handle it for you, and mark the item as completed when we're finished" />
              </>
            }></Chip>
        )}
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
        {task.description ? (
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
                  label={dateFormatShort(new Date(task.due_date))}
                  icon={<CalendarToday />}
                  size="small"
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <ReactMarkdown linkTarget="_blank">
            {task.description ? task.description : ""}
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
  retreatToTasks: RetreatToTask[]
  retreatBaseUrl: string // used for relative links to other pages
  handleCheckboxClick: (task: RetreatToTask) => void
  orderBadge: boolean
  collapsed?: boolean
  noComplete?: boolean
}) {
  let classes = useListStyles(props)
  return (
    <Collapse in={!props.collapsed}>
      {props.retreatToTasks.map((t, i) => {
        let task: RetreatToTask = parseRetreatTask(t, props.retreatBaseUrl)
        return (
          <Badge
            className={classes.wrapper}
            anchorOrigin={{vertical: "top", horizontal: "left"}}
            badgeContent={<>&nbsp;{`${t.order}`}&nbsp;</>}
            overlap="rectangle"
            invisible={!props.orderBadge}
            color="primary">
            <TodoListItem
              task={task}
              disabled={i !== 0 || !!props.noComplete}
              handleCheckboxClick={props.handleCheckboxClick}
            />
          </Badge>
        )
      })}
    </Collapse>
  )
}
