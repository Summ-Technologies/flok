import {Box, makeStyles, StandardProps} from "@material-ui/core"
import clsx from "clsx"
import AppTimeline from "./AppTimeline"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(2),
  },
  timeline: {},
}))

interface RetreatTimelineProps extends StandardProps<{}, "root"> {}

export default function RetreatTimeline(props: RetreatTimelineProps) {
  const classes = useStyles(props)

  return (
    <Box {...props} className={clsx(classes.root, props.className)}>
      <Box className={classes.timeline}>
        <AppTimeline />
      </Box>
    </Box>
  )
}
