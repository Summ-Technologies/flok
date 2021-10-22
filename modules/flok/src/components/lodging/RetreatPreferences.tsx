import {Chip, Grid, makeStyles} from "@material-ui/core"
import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ResourceNotFound} from "../../models"
import {RetreatPreferencesModel} from "../../models/retreat"
import {RootState} from "../../store"
import {updateRetreatFilterPreferences} from "../../store/actions/retreat"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {},
  sidebar: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
  preferencesButtonGroup: {
    "& .MuiToggleButton-label": {
      minWidth: "16ch",
    },
    "& .MuiToggleButton-root.Mui-selected": {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
  },
  pillButton: {
    marginBottom: theme.spacing(1),
  },
  considerationsButtonGroup: {
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  sectionName: {
    minWidth: 250,
  },
}))

type RetreatPreferencesProps = {
  retreatGuid: string
}
export default function RetreatPreferences(props: RetreatPreferencesProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatPreferences: RetreatPreferencesModel | undefined = useSelector(
    (state: RootState) => {
      let retreat = state.retreat.retreats[props.retreatGuid]
      if (retreat && retreat !== ResourceNotFound) {
        return retreat.retreat_preferences
      }
    }
  )
  let [retreatPreferencesState, setRetreatPreferenceState] =
    useState<RetreatPreferencesModel>({
      convenient_filter: 0,
      work_filter: 0,
      budget_filter: 0,
      hotel_size_filter: 0,
      other_considerations: [],
    })
  useEffect(() => {
    if (retreatPreferences) {
      setRetreatPreferenceState(retreatPreferences)
    }
  }, [retreatPreferences])
  function considerationActive(label: string) {
    return retreatPreferences
      ? retreatPreferences.other_considerations.includes(label)
      : false
  }
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="space-between">
      <Grid item xs={12} container spacing={4}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          alignContent="space-between"
          justify="space-between"
          item
          xs={12}>
          <Grid xs={12} md={3} item className={classes.sectionName}>
            <AppTypography variant="h4">Convenient vs. Exotic</AppTypography>
          </Grid>
          <Grid item xs={12} md="auto">
            <ToggleButtonGroup
              color="primary"
              exclusive
              value={retreatPreferencesState.convenient_filter}
              onChange={(event, value: number) => {
                if (value !== null) {
                  dispatch(
                    updateRetreatFilterPreferences(props.retreatGuid, {
                      ...retreatPreferencesState,
                      convenient_filter: value,
                    })
                  )
                }
              }}
              className={classes.preferencesButtonGroup}>
              <ToggleButton value={-1}>Convenience</ToggleButton>
              <ToggleButton value={0}>No Preference</ToggleButton>
              <ToggleButton value={1}>Exotic</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="space-between"
          item
          xs={12}>
          <Grid item xs={12} md={3} className={classes.sectionName}>
            <AppTypography variant="h4">Work vs. Play</AppTypography>
          </Grid>
          <Grid item xs={12} md="auto">
            <ToggleButtonGroup
              value={retreatPreferencesState.work_filter}
              onChange={(event, value: number) => {
                if (value !== null) {
                  dispatch(
                    updateRetreatFilterPreferences(props.retreatGuid, {
                      ...retreatPreferencesState,
                      work_filter: value,
                    })
                  )
                }
              }}
              exclusive
              className={classes.preferencesButtonGroup}>
              <ToggleButton value={-1}>Work</ToggleButton>
              <ToggleButton value={0}>No Preference</ToggleButton>
              <ToggleButton value={1}>Social</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="space-between"
          item
          xs={12}>
          <Grid item xs={12} md={3} className={classes.sectionName}>
            <AppTypography variant="h4">Budget</AppTypography>
          </Grid>
          <Grid item xs={12} md="auto">
            <ToggleButtonGroup
              value={retreatPreferencesState?.budget_filter}
              onChange={(event, value: number) => {
                if (value !== null) {
                  dispatch(
                    updateRetreatFilterPreferences(props.retreatGuid, {
                      ...retreatPreferencesState,
                      budget_filter: value,
                    })
                  )
                }
              }}
              exclusive
              className={classes.preferencesButtonGroup}>
              <ToggleButton value={-1}>Budget Conscious</ToggleButton>
              <ToggleButton value={0}>No Preference</ToggleButton>
              <ToggleButton value={1}>5 star</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="space-between"
          item
          xs={12}>
          <Grid item xs={12} md={3} className={classes.sectionName}>
            <AppTypography variant="h4">Hotel Size</AppTypography>
          </Grid>
          <Grid item xs={12} md="auto">
            <ToggleButtonGroup
              value={retreatPreferencesState.hotel_size_filter}
              onChange={(event, value: number) => {
                if (value !== null) {
                  dispatch(
                    updateRetreatFilterPreferences(props.retreatGuid, {
                      ...retreatPreferencesState,
                      hotel_size_filter: value,
                    })
                  )
                }
              }}
              exclusive
              color="primary"
              className={classes.preferencesButtonGroup}>
              <ToggleButton value={-1}>Small</ToggleButton>
              <ToggleButton value={0}>No Preference</ToggleButton>
              <ToggleButton value={1}>Large</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="space-between"
          item
          xs={12}>
          <Grid item xs={12} className={classes.sectionName}>
            <AppTypography variant="h4">Other considerations</AppTypography>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justify="center"
            wrap="wrap"
            className={classes.considerationsButtonGroup}>
            <Chip
              className={classes.pillButton}
              label="Warm"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "warm"
                  )
                if (!considerationActive("warm")) {
                  considerations.push("warm")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={considerationActive("warm") ? "default" : "outlined"}
              color={considerationActive("warm") ? "primary" : "default"}
              clickable
            />
            <Chip
              className={classes.pillButton}
              label="Beach"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "beach"
                  )
                if (!considerationActive("beach")) {
                  considerations.push("beach")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={considerationActive("beach") ? "default" : "outlined"}
              color={considerationActive("beach") ? "primary" : "default"}
              clickable
            />
            <Chip
              className={classes.pillButton}
              label="Urban"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "urban"
                  )
                if (!considerationActive("urban")) {
                  considerations.push("urban")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={considerationActive("urban") ? "default" : "outlined"}
              color={considerationActive("urban") ? "primary" : "default"}
              clickable
            />
            <Chip
              className={classes.pillButton}
              label="Ranch"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "ranch"
                  )
                if (!considerationActive("ranch")) {
                  considerations.push("ranch")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={considerationActive("ranch") ? "default" : "outlined"}
              color={considerationActive("ranch") ? "primary" : "default"}
              clickable
            />
            <Chip
              className={classes.pillButton}
              label="Mountains"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "mountains"
                  )
                if (!considerationActive("mountains")) {
                  considerations.push("mountains")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={
                considerationActive("mountains") ? "default" : "outlined"
              }
              color={considerationActive("mountains") ? "primary" : "default"}
              clickable
            />
            <Chip
              className={classes.pillButton}
              label="Peaceful"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "peaceful"
                  )
                if (!considerationActive("peaceful")) {
                  considerations.push("peaceful")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={considerationActive("peaceful") ? "default" : "outlined"}
              color={considerationActive("peaceful") ? "primary" : "default"}
              clickable
            />
            <Chip
              className={classes.pillButton}
              label="Social"
              onClick={() => {
                let considerations =
                  retreatPreferencesState.other_considerations.filter(
                    (val) => val !== "social"
                  )
                if (!considerationActive("social")) {
                  considerations.push("social")
                }
                dispatch(
                  updateRetreatFilterPreferences(props.retreatGuid, {
                    ...retreatPreferencesState,
                    other_considerations: considerations,
                  })
                )
              }}
              variant={considerationActive("social") ? "default" : "outlined"}
              color={considerationActive("social") ? "primary" : "default"}
              clickable
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export function RetreatPreferencesSidebar(props: RetreatPreferencesProps) {
  let classes = useStyles()
  return (
    <div className={classes.sidebar}>
      <AppTypography variant="h2">Retreat Preferences</AppTypography>
      <RetreatPreferences {...props} />
    </div>
  )
}
