import {makeStyles, StandardProps} from "@material-ui/core"
import {Timeline} from "@material-ui/lab"
import clsx from "clsx"
import AppTimelineItem from "./AppTimelineItem"

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  content: {
    marginTop: "auto",
    marginBottom: "auto",
  },

  alignLeft: {
    "& .MuiTimelineItem-root::before": {
      padding: 0,
      content: "none",
      flex: "none",
    },
  },
}))

interface AppTimelineProps extends StandardProps<{}, "root"> {}

export default function AppTimeline(props: AppTimelineProps) {
  const classes = useStyles(props)
  return (
    <Timeline
      align="left"
      {...props}
      classes={{...props.classes, alignLeft: classes.alignLeft}}
      className={clsx(classes.root, props.className)}>
      <AppTimelineItem
        order={1}
        state="completed"
        title="Flok onboarding call"
      />
      <AppTimelineItem
        order={2}
        state="in-progress"
        title="Enter employee locations"
      />
      <AppTimelineItem
        order={3}
        state="todo"
        title="Receive proposals (free)"
      />
      <AppTimelineItem
        order={4}
        state="todo"
        title="Confirm your destination"
      />
      <AppTimelineItem
        order={5}
        state="todo"
        title="Flok helps you plan your retreat"
      />
      <AppTimelineItem
        order={5}
        state="todo"
        title="Flok helps you plan your retreat"
      />
      <AppTimelineItem
        order={5}
        state="todo"
        title="Flok helps you plan your retreat"
      />
      <AppTimelineItem
        order={5}
        state="todo"
        title="Flok helps you plan your retreat"
      />
      <AppTimelineItem
        order={5}
        state="todo"
        title="Flok helps you plan your retreat"
      />
      <AppTimelineItem
        order={5}
        state="todo"
        title="Flok helps you plan your retreat"
      />
      <AppTimelineItem
        order={6}
        state="todo"
        title="Enjoy retreat! 🎊 🏠 🦅"
        customIcon={<>🤗</>}
        lastItem
      />
    </Timeline>
  )
}
