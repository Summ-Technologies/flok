import {Box, makeStyles, StandardProps, Typography} from "@material-ui/core"
import clsx from "clsx"
import {Link} from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(4),
    textAlign: "center",
  },
  header: {},
  body: {},
}))

interface RetreatOnboardingCallProps extends StandardProps<{}, "root"> {}

export default function RetreatOnboardingCall(
  props: RetreatOnboardingCallProps
) {
  const classes = useStyles(props)

  return (
    <Box {...props} className={clsx(classes.root, props.className)}>
      <Typography variant="h2" className={classes.header}>
        Welcome! We're gonna Flok!
      </Typography>
      <Typography variant="body1" className={classes.body}>
        Let's Flok together, signup for an intro call <Link to="/">here</Link>
      </Typography>
    </Box>
  )
}
