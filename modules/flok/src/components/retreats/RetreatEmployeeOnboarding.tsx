import {
  Box,
  Grid,
  ListItem,
  makeStyles,
  StandardProps,
  TextField,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {useState} from "react"
import {RetreatEmployeeLocationItem} from "../../models/retreat"
import AppLocationFinder from "../AppLocationFinder"
import AppLocationList from "../AppLocationList"
import AppButton from "../base/AppButton"
import AppList from "../base/AppList"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  footerText: {
    marginTop: theme.spacing(1),
    textAlign: "center",
  },
  textFieldNoOutline: {},
}))

interface RetreatEmployeeOnboardingProps extends StandardProps<{}, "root"> {
  postEmployeeLocations: (
    employeeLocations: RetreatEmployeeLocationItem[],
    extraInfo?: string
  ) => void
}

export default function RetreatEmployeeOnboarding(
  props: RetreatEmployeeOnboardingProps
) {
  const classes = useStyles(props)

  let [employeeLocations, setEmployeeLocations] = useState<
    RetreatEmployeeLocationItem[]
  >([])
  let [extraInfo, setExtraInfo] = useState("")

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
      <Grid item sm={6} xs={12}>
        <Typography variant="h3">
          Where are your team members located?
        </Typography>
        <AppLocationFinder onSelectLocation={addEmployeeLocation} />
        {employeeLocations.length ? (
          <AppLocationList
            locations={employeeLocations}
            onRemoveLocation={removeEmployeeLocation}
            onSetLocationNumber={setEmployeeLocationNumber}
          />
        ) : undefined}
        {showSubmit ? (
          <>
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
                    multiline
                    fullWidth
                    variant="standard"
                    rows={3}
                    rowsMax={8}
                    placeholder="E.g. we still aren’t sure if 2 people from NY and 1 person from SF can make it. We are giving them a deadline of [2 weeks from now] to decide"
                    value={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                  />
                </ListItem>
              </AppList>
            </Box>
            <AppButton
              onClick={() =>
                props.postEmployeeLocations(employeeLocations, extraInfo)
              }
              className={classes.submitButton}
              variant="contained"
              color="primary"
              fullWidth>
              Continue to retreat proposals
            </AppButton>
            {employeeLocations.length ? (
              <Typography className={classes.footerText} variant="body1">
                {employeeLocations
                  .map((loc) => (loc.employeeCount ? loc.employeeCount : 0))
                  .reduce((prev, curr) => prev + curr)}{" "}
                people going on the trip
              </Typography>
            ) : undefined}
          </>
        ) : undefined}
      </Grid>
    </Grid>
  )
}
