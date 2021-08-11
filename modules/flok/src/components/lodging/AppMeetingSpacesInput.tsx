import {ButtonBase, Grid, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppNumberCounterInput from "../base/AppNumberCounterInput"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    width: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    alignItems: "flex-start",
    textAlign: "left",
    flexDirection: "column",
    "&:hover": {
      boxShadow: theme.shadows[1],
    },
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(0.5),
    },
  },
  active: {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
    backgroundColor: theme.palette.common.white,
  },
}))

type MeetingSpaceType = "full-company" | "breakout" | "outdoor"

type AppMeetingSpacesInputProps = {
  values: MeetingSpaceType[]
  numBreakoutRooms: number
  onChange: (newVals: MeetingSpaceType[], numBreakoutRooms: number) => void
}
export default function AppMeetingSpacesInput(
  props: AppMeetingSpacesInputProps
) {
  let classes = useStyles(props)
  function toggleCard(val: MeetingSpaceType) {
    let newVals: MeetingSpaceType[] = []
    if (props.values.includes(val)) {
      newVals = props.values.filter((_v) => _v !== val)
    } else {
      newVals = [...props.values, val]
    }
    props.onChange(newVals, props.numBreakoutRooms)
  }
  function changeBreakoutRooms(val: number) {
    props.onChange(props.values, val)
  }
  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12} md={4}>
        <ButtonBase
          className={clsx(
            classes.card,
            props.values.includes("full-company") && classes.active
          )}
          onClick={() => toggleCard("full-company")}
          disableTouchRipple
          disableRipple>
          <AppTypography variant="h2">Full Company</AppTypography>
          <AppTypography variant="body1" color="textSecondary">
            Meeting space to fit your entire company
          </AppTypography>
        </ButtonBase>
      </Grid>
      <Grid item xs={12} md={4}>
        <ButtonBase
          className={clsx(
            classes.card,
            props.values.includes("breakout") && classes.active
          )}
          onClick={() => toggleCard("breakout")}
          disableTouchRipple
          disableRipple>
          <AppTypography variant="h2">Breakout Rooms</AppTypography>
          <AppTypography variant="body1" color="textSecondary">
            Meeting space to fit your entire company
          </AppTypography>
          {props.values.includes("breakout") ? (
            <AppNumberCounterInput
              value={props.numBreakoutRooms}
              onChange={changeBreakoutRooms}
              min={0}
              size="small"
            />
          ) : undefined}
        </ButtonBase>
      </Grid>
      <Grid item xs={12} md={4}>
        <ButtonBase
          className={clsx(
            classes.card,
            props.values.includes("outdoor") && classes.active
          )}
          onClick={() => toggleCard("outdoor")}
          disableTouchRipple
          disableRipple>
          <AppTypography variant="h2">Outdoor</AppTypography>
          <AppTypography variant="body1" color="textSecondary">
            Meeting space to fit your entire company
          </AppTypography>
        </ButtonBase>
      </Grid>
    </Grid>
  )
}
