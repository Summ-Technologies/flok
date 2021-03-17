import {Box, makeStyles, StandardProps, Typography} from "@material-ui/core"
import clsx from "clsx"
import {useSelector} from "react-redux"
import UserGetters from "../store/getters/user"
import AppLogo from "./AppLogo"
import AppTimeline from "./AppTimeline"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(2),
  },
  header: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
  timeline: {},
}))

interface RetreatTimelineProps extends StandardProps<{}, "root"> {}

export default function RetreatTimeline(props: RetreatTimelineProps) {
  const classes = useStyles(props)

  let userEmail = useSelector(UserGetters.getUserEmail)

  return (
    <Box {...props} className={clsx(classes.root, props.className)}>
      <Box className={classes.header}>
        <AppLogo withText height={40} noBackground />
        <Typography variant="body1">{userEmail}</Typography>
        <hr />
      </Box>
      <Box className={classes.timeline}>
        <AppTimeline />
      </Box>
    </Box>
  )
}
