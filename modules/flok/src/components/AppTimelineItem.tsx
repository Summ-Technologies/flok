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
    minHeight: "inherit",
  },
  dot: {
    borderColor: theme.palette.common.black,
    height: 30,
    width: 30,
    marginTop: 0,
    marginBottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: (props: AppTimelineItemProps) =>
      props.state === "completed"
        ? theme.palette.common.white
        : props.state === "in-progress"
        ? theme.palette.common.white
        : theme.palette.common.black,
    backgroundColor: (props: AppTimelineItemProps) =>
      props.state === "in-progress"
        ? theme.palette.common.black
        : props.state === "completed"
        ? theme.palette.common.black
        : theme.palette.common.white,
  },
  connector: {
    height: 20,
    backgroundColor: theme.palette.common.black,
    width: 3,
  },
}))

export interface AppTimelineItemProps
  extends StandardProps<{}, "root" | "missingOppositeContent"> {
  title: string
  state: "todo" | "in-progress" | "completed"
  order: number
  customIcon?: ReactFragment
  lastItem?: boolean
}

export default function AppTimelineItem(props: AppTimelineItemProps) {
  const classes = useStyles(props)
  const {title, state, order, customIcon, lastItem, ...muiProps} = props
  var timelineDotBody: ReactFragment = <>{order}</>
  timelineDotBody =
    state === "completed" ? (
      <CheckRounded fontSize="inherit" />
    ) : (
      timelineDotBody
    )
  timelineDotBody = customIcon ? customIcon : timelineDotBody
  return (
    <TimelineItem {...muiProps} className={clsx(classes.root, props.className)}>
      <TimelineSeparator>
        <TimelineDot className={classes.dot} variant="outlined">
          <Typography variant="body2">
            <Box
              component="span"
              fontWeight="fontWeightMedium"
              textAlign="center">
              {timelineDotBody}
            </Box>
          </Typography>
        </TimelineDot>
        {lastItem ? undefined : (
          <TimelineConnector className={`${classes.connector}`} />
        )}
      </TimelineSeparator>
      <TimelineContent style={{paddingTop: 0}}>
        <Typography variant="body2">
          <Box
            component="span"
            fontWeight={state === "in-progress" ? "fontWeightBold" : undefined}>
            {props.title}
          </Box>
        </Typography>
      </TimelineContent>
    </TimelineItem>
  )
}
