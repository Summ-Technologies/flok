import {makeStyles, StandardProps} from "@material-ui/core"
import {CheckRounded} from "@material-ui/icons"
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@material-ui/lab"
import clsx from "clsx"
import AppTypography from "../AppTypography"

const useStyles = makeStyles((theme) => ({
  root: {},
  dot: {
    height: 30,
    width: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  dotTodo: {
    color: theme.palette.text.disabled,
    borderColor: theme.palette.text.disabled,
    backgroundColor: theme.palette.background.paper,
  },
  dotInProgress: {
    color: theme.palette.common.white,
    borderColor: theme.palette.common.black,
    backgroundColor: theme.palette.common.black,
  },
  dotCompleted: {
    color: theme.palette.common.white,
    borderColor: theme.palette.success.main,
    backgroundColor: theme.palette.success.main,
  },
  connector: {
    backgroundColor: theme.palette.common.black,
    width: 3,
  },
}))

export type AppTimelineItemState = "todo" | "in-progress" | "completed"

export interface AppTimelineItemProps extends StandardProps<{}, "root"> {
  body: JSX.Element
  state: AppTimelineItemState
  order: number
  lastItem?: boolean
}

export default function AppTimelineItem(props: AppTimelineItemProps) {
  const classes = useStyles(props)
  const {body, state, order, lastItem, ...muiProps} = props
  return (
    <TimelineItem {...muiProps} className={clsx(classes.root, props.className)}>
      <TimelineSeparator>
        <TimelineDot
          className={clsx(
            classes.dot,
            state === "todo"
              ? classes.dotTodo
              : state === "in-progress"
              ? classes.dotInProgress
              : classes.dotCompleted
          )}
          variant="outlined">
          <AppTypography bold variant="body2">
            {state === "completed" ? (
              <CheckRounded fontSize="inherit" />
            ) : (
              order
            )}
          </AppTypography>
        </TimelineDot>
        {!lastItem ? (
          <TimelineConnector className={`${classes.connector}`} />
        ) : undefined}
      </TimelineSeparator>
      <TimelineContent>{body}</TimelineContent>
    </TimelineItem>
  )
}
