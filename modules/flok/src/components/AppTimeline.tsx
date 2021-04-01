import {makeStyles, StandardProps} from "@material-ui/core"
import {Timeline} from "@material-ui/lab"
import clsx from "clsx"
import AppTimelineItem, {AppTimelineItemProps} from "./AppTimelineItem"

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
  lastItem: {},
}))

interface AppTimelineProps extends StandardProps<{}, "root"> {
  items: AppTimelineItemProps[]
}

export default function AppTimeline(props: AppTimelineProps) {
  let {items, ...otherProps} = props
  const classes = useStyles(props)
  return (
    <Timeline
      align="left"
      {...otherProps}
      classes={{...props.classes, alignLeft: classes.alignLeft}}
      className={clsx(classes.root, props.className)}>
      {items.map((item, i) => {
        return <AppTimelineItem key={item.order} {...item} order={i} />
      })}
      <AppTimelineItem
        classes={{root: classes.lastItem}}
        order={items.length + 1}
        state="todo"
        title="Enjoy retreat! 🎊 🏠 🦅"
        lastItem
      />
    </Timeline>
  )
}
