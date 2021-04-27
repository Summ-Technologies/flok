import {
  Box,
  Grid,
  Hidden,
  Link,
  makeStyles,
  StandardProps,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {useSelector} from "react-redux"
import RetreatGetters from "../../store/getters/retreat"
import AppLocationList from "../AppLocationList"
import AppList, {AppListItem} from "../base/AppList"
import AppNumberCounter from "../base/AppNumberCounter"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}))

interface RetreatDetailsProps extends StandardProps<{}, "root"> {}

export default function RetreatDetails(props: RetreatDetailsProps) {
  const classes = useStyles(props)
  let userRetreat = useSelector(RetreatGetters.getRetreat)
  let employeeLocations =
    userRetreat && userRetreat.employeeLocationSubmission
      ? userRetreat.employeeLocationSubmission.locationItems
      : []

  return (
    <Grid container spacing={1} className={clsx(classes.root, props.className)}>
      <Grid item xs={12}>
        <Typography variant="h3">Retreat Details</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <AppLocationList locations={employeeLocations} />
        <Box marginTop={1} marginLeft={2}>
          <Typography variant="body1">
            <Link onClick={() => undefined}>+ Add location</Link>
          </Typography>
        </Box>
      </Grid>
      <Hidden xsDown>
        <Grid item sm={6}></Grid>
      </Hidden>
      <Grid item xs={12} sm={6}>
        <Box marginTop={2}>
          <AppList elevation={2}>
            <AppListItem
              header={
                <Typography variant="body1">
                  <Box fontWeight="fontWeightMedium"># of days</Box>
                </Typography>
              }
              body={
                <AppNumberCounter
                  count={5}
                  onUpdateCount={() => undefined}
                  min={1}
                />
              }
            />
          </AppList>
        </Box>
      </Grid>
    </Grid>
  )
}
