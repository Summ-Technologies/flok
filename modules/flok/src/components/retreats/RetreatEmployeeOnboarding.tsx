import {
  Button,
  Grid,
  makeStyles,
  StandardProps,
  TextField,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {useState} from "react"
import {EmployeeLocation} from "../../data/locations"
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
}))

interface RetreatEmployeeOnboardingProps extends StandardProps<{}, "root"> {}

export default function RetreatEmployeeOnboarding(
  props: RetreatEmployeeOnboardingProps
) {
  const classes = useStyles(props)

  let [employeeLocations, setEmployeeLocations] = useState<
    {
      location: EmployeeLocation
      number: number
    }[]
  >([])

  function addEmployeeLocation(location: EmployeeLocation): void {
    if (
      !employeeLocations.map((loc) => loc.location.id).includes(location.id)
    ) {
      setEmployeeLocations([
        ...employeeLocations,
        {location: location, number: 1},
      ])
    }
  }
  function removeEmployeeLocation(location: EmployeeLocation): void {
    setEmployeeLocations(
      employeeLocations.filter((loc) => location !== loc.location)
    )
  }
  function setEmployeeLocationNumber(
    location: EmployeeLocation,
    number: number
  ): void {
    setEmployeeLocations(
      employeeLocations.map((loc) =>
        location === loc.location ? {...loc, number} : loc
      )
    )
  }

  return (
    <Grid item container className={clsx(classes.root, props.className)}>
      <Grid item md={6} xs={10}>
        <Typography variant="h3">
          Where are your team members located?
        </Typography>
        <AppLocationFinder onSelectLocation={addEmployeeLocation} />
        {employeeLocations.length ? (
          <>
            <AppLocationList
              locations={employeeLocations}
              onRemoveLocation={removeEmployeeLocation}
              onSetLocationNumber={setEmployeeLocationNumber}
            />
            <TextField type="textarea" />
            <Button
              className={classes.submitButton}
              variant="outlined"
              fullWidth>
              Continue to retreat proposals
            </Button>
            <Typography className={classes.footerText} variant="body1">
              {employeeLocations
                .map((loc) => loc.number)
                .reduce((prev, curr) => prev + curr)}{" "}
              people going on the trip
            </Typography>
          </>
        ) : undefined}
      </Grid>
      <Grid
        item
        container
        md={5}
        sm={6}
        xs={12}
        className={classes.uploadSection}>
        <Typography
          component="span"
          variant="h2"
          style={{verticalAlign: "middle"}}>
          or
        </Typography>
        <Button variant="contained" style={{verticalAlign: "middle"}}>
          Upload CSV
        </Button>
      </Grid>
    </Grid>
  )
}
