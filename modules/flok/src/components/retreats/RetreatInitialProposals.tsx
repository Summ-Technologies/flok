import {
  Box,
  Button,
  Card,
  Grid,
  ListItem,
  makeStyles,
  StandardProps,
  TextField,
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
import {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {RetreatEmployeeLocationItem} from "../../models/retreat"
import RetreatGetters from "../../store/getters/retreat"
import AppList from "../AppList"
import AppLocationFinder from "../AppLocationFinder"
import AppLocationList from "../AppLocationList"

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
  submitButton: {
    marginTop: theme.spacing(2),
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
  textField: {
    "& *:disabled": {
      cursor: "not-allowed",
      pointerEvents: "unset",
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

  let [editLocations, setEditLocations] = useState(false)
  let [employeeLocations, setEmployeeLocations] = useState<
    RetreatEmployeeLocationItem[]
  >([])
  let employeeLocationSubmission = useSelector(
    RetreatGetters.getEmployeeLocationSubmission
  )

  useEffect(() => {
    if (!editLocations && employeeLocationSubmission) {
      setEmployeeLocations(employeeLocationSubmission.locationItems)
    }
  }, [employeeLocationSubmission, setEmployeeLocations, editLocations])

  // Optional form + submit button only show when location is added
  //  they stay stay sticky event when locations are all removed
  let [showSubmit, setShowSubmit] = useState(false)

  function addEmployeeLocation(location: RetreatEmployeeLocationItem): void {
    if (
      !employeeLocations
        .map((loc) => loc.googlePlaceId)
        .includes(location.googlePlaceId)
    ) {
      setEmployeeLocations([
        ...employeeLocations,
        {...location, employeeCount: 1},
      ])
    }
    if (!showSubmit) setShowSubmit(true)
  }
  function removeEmployeeLocation(location: RetreatEmployeeLocationItem): void {
    setEmployeeLocations(employeeLocations.filter((loc) => location !== loc))
  }
  function setEmployeeLocationNumber(
    location: RetreatEmployeeLocationItem,
    number: number
  ): void {
    setEmployeeLocations(
      employeeLocations.map((loc) =>
        location.googlePlaceId === loc.googlePlaceId
          ? {...loc, employeeCount: number}
          : loc
      )
    )
  }

  return (
    <Grid item container className={clsx(classes.root, props.className)}>
      <Grid item md={6} xs={10} className={classes.body}>
        <Grid item container alignItems="center" wrap="nowrap">
          <Box paddingRight={2} paddingLeft={2}>
            <TimelineDot className={classes.checkIcon}>
              <CheckRounded />
            </TimelineDot>
          </Box>
          <Typography variant="h2">Enter team locations</Typography>
        </Grid>
        <Card elevation={0} className={classes.nextStepsCard}>
          <Grid item container className={classes.nextStepsCardBody}>
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
                  <span aria-label="sunglasses emoji">📩</span> We’ll email you
                  when they’re ready
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
        <Grid
          item
          container
          alignItems="center"
          justify="space-between"
          wrap="nowrap">
          <Typography variant="h2">Your team locations</Typography>
          <Typography variant="h2">
            {editLocations ? (
              <Button variant="text" onClick={() => setEditLocations(false)}>
                Cancel
              </Button>
            ) : (
              <Button variant="text" onClick={() => setEditLocations(true)}>
                Edit
              </Button>
            )}
          </Typography>
        </Grid>
        {editLocations ? (
          <AppLocationFinder onSelectLocation={addEmployeeLocation} />
        ) : undefined}
        {employeeLocations ? (
          <AppLocationList
            locations={employeeLocations}
            onRemoveLocation={
              editLocations ? removeEmployeeLocation : undefined
            }
            onSetLocationNumber={
              editLocations ? setEmployeeLocationNumber : undefined
            }
          />
        ) : undefined}
        <Box marginTop={2}>
          <AppList>
            <ListItem>
              <Typography variant="body1">
                <Box component="span" fontWeight="fontWeightMedium">
                  (Optional) provide additional details
                </Box>
              </Typography>
            </ListItem>
            <ListItem>
              <TextField
                className={classes.textField}
                disabled={!editLocations}
                multiline
                fullWidth
                variant="outlined"
                rows={3}
                rowsMax={8}
                placeholder="E.g. we still aren’t sure if 2 people from NY and 1 person from SF can make it. We are giving them a deadline of [2 weeks from now] to decide"
              />
            </ListItem>
          </AppList>
        </Box>
        {editLocations ? (
          <Button
            onClick={() => props.postEmployeeLocations(employeeLocations)}
            className={classes.submitButton}
            variant="contained"
            color="primary"
            fullWidth>
            Update team
          </Button>
        ) : undefined}
      </Grid>
    </Grid>
  )
}
