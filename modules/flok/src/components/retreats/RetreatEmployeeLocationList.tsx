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
import {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {RetreatEmployeeLocationItem} from "../../models/retreat"
import RetreatGetters from "../../store/getters/retreat"
import AppButton from "../AppButton"
import AppList from "../AppList"
import AppLocationFinder from "../AppLocationFinder"
import AppLocationList from "../AppLocationList"

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    "& *:disabled": {
      cursor: "not-allowed",
      pointerEvents: "unset",
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}))

interface RetreatEmployeeLocationListProps extends StandardProps<{}, "root"> {
  postEmployeeLocations: (
    employeeLocations: RetreatEmployeeLocationItem[],
    extraInfo?: string
  ) => void
}

export default function RetreatEmployeeLocationList(
  props: RetreatEmployeeLocationListProps
) {
  const classes = useStyles(props)
  let {postEmployeeLocations, ...otherProps} = props
  let [editLocations, setEditLocations] = useState(false)
  let [employeeLocations, setEmployeeLocations] = useState<
    RetreatEmployeeLocationItem[]
  >([])
  let employeeLocationSubmission = useSelector(
    RetreatGetters.getEmployeeLocationSubmission
  )
  let [extraInfo, setExtraInfo] = useState("")

  useEffect(() => {
    if (!editLocations && employeeLocationSubmission) {
      setEmployeeLocations(employeeLocationSubmission.locationItems)
    }
  }, [employeeLocationSubmission, setEmployeeLocations, editLocations])

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

  return (
    <Box {...otherProps} className={clsx(classes.root, props.className)}>
      <Grid
        item
        container
        alignItems="center"
        justify="space-between"
        wrap="nowrap">
        <Typography variant="h2">Your team locations</Typography>
        <Typography variant="h2">
          {editLocations ? (
            <AppButton variant="text" onClick={() => setEditLocations(false)}>
              Cancel
            </AppButton>
          ) : (
            <AppButton variant="text" onClick={() => setEditLocations(true)}>
              Edit
            </AppButton>
          )}
        </Typography>
      </Grid>
      {editLocations ? (
        <AppLocationFinder onSelectLocation={addEmployeeLocation} />
      ) : undefined}
      {employeeLocations ? (
        <AppLocationList
          locations={employeeLocations}
          onRemoveLocation={editLocations ? removeEmployeeLocation : undefined}
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
      {editLocations ? (
        <AppButton
          onClick={() => postEmployeeLocations(employeeLocations, extraInfo)}
          className={classes.submitButton}
          variant="contained"
          color="primary"
          fullWidth>
          Update team
        </AppButton>
      ) : undefined}
    </Box>
  )
}
