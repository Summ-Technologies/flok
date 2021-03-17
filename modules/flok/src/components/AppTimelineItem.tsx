import {Box, makeStyles, StandardProps, Typography} from "@material-ui/core"
import {CheckRounded} from "@material-ui/icons"
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@material-ui/lab"
import clsx from "clsx"
import {ReactFragment} from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 100,
  },
  dot: {
    height: 50,
    width: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 700,
    color: (props: AppTimelineItemProps) =>
      props.state === "completed"
        ? theme.palette.common.white
        : props.state === "in-progress"
        ? theme.palette.common.white
        : theme.palette.common.black,
    backgroundColor: (props: AppTimelineItemProps) =>
      props.state === "completed"
        ? theme.palette.success.main
        : props.state === "in-progress"
        ? theme.palette.common.black
        : theme.palette.common.white,
    border: "none",
  },
}))

interface AppTimelineItemProps
  extends StandardProps<{}, "root" | "missingOppositeContent"> {
  title: string
  body?: string
  state: "todo" | "in-progress" | "completed"
  order: number
  customIcon?: ReactFragment
  lastItem?: boolean
}

export default function AppTimelineItem(props: AppTimelineItemProps) {
  const classes = useStyles(props)
  const {title, body, state, order, customIcon, lastItem, ...muiProps} = props
  var timelineDotBody: ReactFragment = <>{order}</>
  timelineDotBody = state === "completed" ? <CheckRounded /> : timelineDotBody
  timelineDotBody = customIcon ? customIcon : timelineDotBody
  return (
    <TimelineItem {...muiProps} className={clsx(classes.root, props.className)}>
      <TimelineSeparator>
        <TimelineDot className={classes.dot} variant="outlined">
          {timelineDotBody}
        </TimelineDot>
        {lastItem ? undefined : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="body1">
          <Box fontWeight="fontWeightBold">{props.title}</Box>
        </Typography>
        <Typography variant="body1">{props.body}</Typography>
      </TimelineContent>
    </TimelineItem>
  )
}
