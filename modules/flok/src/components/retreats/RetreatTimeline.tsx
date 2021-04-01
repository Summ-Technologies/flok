import {Box, makeStyles, StandardProps} from "@material-ui/core"
import clsx from "clsx"
import {useEffect, useState} from "react"
import {RetreatToItemModel} from "../../models/retreat"
import AppTimeline from "../AppTimeline"
import {AppTimelineItemProps} from "../AppTimelineItem"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(2),
  },
  timeline: {},
}))

interface RetreatTimelineProps extends StandardProps<{}, "root"> {
  retreatItems: RetreatToItemModel[]
}

export default function RetreatTimeline(props: RetreatTimelineProps) {
  let {retreatItems, ...otherProps} = props
  const classes = useStyles(props)
  let [items, setItems] = useState<AppTimelineItemProps[]>([])

  useEffect(() => {
    let _items: AppTimelineItemProps[] = retreatItems.map((retreatToItem) => {
      const state =
        retreatToItem.state === "DONE"
          ? "completed"
          : retreatToItem.state === "IN_PROGRESS"
          ? "in-progress"
          : retreatToItem.state === "TODO"
          ? "todo"
          : "todo"
      let _item: AppTimelineItemProps = {
        order: retreatToItem.order,
        state: state,
        title: retreatToItem.retreatItem.title,
      }
      return _item
    })
    setItems(_items)
  }, [retreatItems, setItems])

  return (
    <Box {...otherProps} className={clsx(classes.root, props.className)}>
      <Box className={classes.timeline}>
        <AppTimeline items={items} />
      </Box>
    </Box>
  )
}
