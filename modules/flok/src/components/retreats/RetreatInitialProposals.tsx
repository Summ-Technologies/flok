import {
  Box,
  Card,
  Divider,
  Grid,
  makeStyles,
  Paper,
  StandardProps,
  Typography,
} from "@material-ui/core"
import {
  AlarmRounded,
  CheckRounded,
  CreateRounded,
  FormatListBulletedRounded,
} from "@material-ui/icons"
import {TimelineDot} from "@material-ui/lab"
import clsx from "clsx"
import {RetreatEmployeeLocationItem} from "../../models/retreat"
import AppRetreatInitialProposal from "./AppRetreatInitialProposal"
import RetreatEmployeeLocationList from "./RetreatEmployeeLocationList"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(4),
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  body: {
    "& > *:not(:first-child)": {marginTop: theme.spacing(1)},
  },
  nextStepsCard: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  nextStepsCardBody: {
    "& > *:not(:first-child)": {paddingTop: theme.spacing(1)},
  },
  checkIcon: {
    backgroundColor: theme.palette.success.main,
  },
  footerText: {
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
  uploadSection: {
    textAlign: "center",
    width: "100%",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
  },
}))

interface RetreatInitalProposalsProps extends StandardProps<{}, "root"> {
  postEmployeeLocations: (
    employeeLocations: RetreatEmployeeLocationItem[],
    extraInfo?: string
  ) => void
}

export default function RetreatInitalProposals(
  props: RetreatInitalProposalsProps
) {
  const classes = useStyles(props)
  let retreatInitialProposals = true

  return (
    <Grid item container className={clsx(classes.root, props.className)}>
      <Grid item md={6} xs={10} className={classes.body}>
        <Grid item container alignItems="center" wrap="nowrap">
          {retreatInitialProposals ? (
            <Typography variant="h2">Retreat proposals</Typography>
          ) : (
            <>
              <Box paddingRight={2} paddingLeft={2}>
                <TimelineDot className={classes.checkIcon}>
                  <CheckRounded />
                </TimelineDot>
              </Box>
              <Typography variant="h2">Enter team locations</Typography>
            </>
          )}
        </Grid>
        <Card elevation={0} className={classes.nextStepsCard}>
          <Grid item container className={classes.nextStepsCardBody}>
            {retreatInitialProposals ? (
              <>
                <Grid container item alignItems="flex-start" wrap="nowrap">
                  <Typography variant="h3">
                    A note from the Flok team
                  </Typography>
                </Grid>
                <Box width="100%">
                  <Divider variant="fullWidth" />
                </Box>
                <Grid>
                  <Typography variant="body1">
                    Based on your input, we think your team would really enjoy
                    Cancun or Jamaica. We can prepare a more formal estimate
                    that includes food, ground transportation etc. once we move
                    forward on dates and location. Then pay us! (more details on
                    this?)
                  </Typography>
                </Grid>
              </>
            ) : (
              <>
                <Grid container item alignItems="flex-start" wrap="nowrap">
                  <Box paddingRight={2}>
                    <CreateRounded />
                  </Box>
                  <Typography variant="body1">
                    <Box component="span" fontWeight="fontWeightMedium">
                      Next steps:
                    </Box>{" "}
                    Flok sends retreat proposals and cost estimations
                  </Typography>
                </Grid>
                <Grid container item alignItems="flex-start" wrap="nowrap">
                  <Box paddingRight={2}>
                    <AlarmRounded />
                  </Box>
                  <Typography variant="body1">
                    <Box component="span" fontWeight="fontWeightMedium">
                      ETA:
                    </Box>{" "}
                    {"< 24 hours"}
                  </Typography>
                </Grid>
                <Grid container item alignItems="flex-start" wrap="nowrap">
                  <Box paddingRight={2}>
                    <FormatListBulletedRounded />
                  </Box>
                  <Typography variant="body1">
                    <Box component="span" fontWeight="fontWeightMedium">
                      To-do:
                    </Box>{" "}
                    Nothing!
                  </Typography>
                </Grid>
                <Grid item>
                  <Box paddingLeft={1} paddingRight={1} paddingTop={1}>
                    <Typography variant="body2">
                      <span aria-label="sunglasses emoji">😎</span> Sit back and
                      relax. We’re working on 2-3 retreat destination and cost
                      estimation proposals.
                    </Typography>
                    <br />
                    <Typography variant="body2">
                      <span aria-label="sunglasses emoji">📩</span> We’ll email
                      you when they’re ready
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Card>
        <Paper elevation={0}>
          <Box className={classes.nextStepsCard}>
            <Typography variant="h3">2 proposals</Typography>
            <Divider />
            <AppRetreatInitialProposal />
            <Divider />
            <AppRetreatInitialProposal />
            <Divider />
            <AppRetreatInitialProposal />
          </Box>
        </Paper>
        <RetreatEmployeeLocationList
          postEmployeeLocations={props.postEmployeeLocations}
        />
      </Grid>
    </Grid>
  )
}
