import {makeStyles} from "@material-ui/core"
import {Timeline} from "@material-ui/lab"
import AppTimelineItem, {AppTimelineItemState} from "./AppTimelineItem"

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

type AppTimelineProps = {
  items: {body: JSX.Element; state: AppTimelineItemState}[]
}

export default function AppTimeline(props: AppTimelineProps) {
  let {items} = props
  const classes = useStyles(props)
  return (
    <Timeline
      align="left"
      classes={{root: classes.root, alignLeft: classes.alignLeft}}>
      {items.map((item, i) => {
        let order = i + 1
        return (
          <AppTimelineItem
            body={item.body}
            state={item.state}
            order={order}
            key={order}
            lastItem={order === items.length}
          />
        )
      })}
    </Timeline>
  )
}
