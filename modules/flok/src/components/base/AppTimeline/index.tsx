import {makeStyles} from "@material-ui/core"
import {Timeline} from "@material-ui/lab"
import {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  alignLeft: {
    "& .MuiTimelineItem-root::before": {
      padding: 0,
      content: "none",
      flex: "none",
    },
  },
}))

type AppTimelineProps = PropsWithChildren<{}>

export default function AppTimeline(props: AppTimelineProps) {
  const classes = useStyles(props)
  return (
    <Timeline
      align="left"
      classes={{root: classes.root, alignLeft: classes.alignLeft}}>
      {props.children}
    </Timeline>
  )
}
