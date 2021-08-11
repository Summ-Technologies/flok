import {ButtonBase, Grid, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    "& > *:first-child > $card": {
      [theme.breakpoints.up("md")]: {
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderTopLeftRadius: theme.shape.borderRadius,
      },
      [theme.breakpoints.down("sm")]: {
        borderTopRightRadius: theme.shape.borderRadius,
        borderTopLeftRadius: theme.shape.borderRadius,
      },
    },
    "& > *:last-child > $card": {
      [theme.breakpoints.up("md")]: {
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
      },
      [theme.breakpoints.down("sm")]: {
        borderBottomRightRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
      },
    },
  },
  card: {
    height: "100%",
    width: "100%",
    padding: theme.spacing(2),
    border: `solid 1px ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    justifyContent: "flex-start",
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

type RoomType = "singles" | "doubles" | "either"

type AppRoomTypeInputProps = {
  value?: RoomType
  onChange: (newVal: RoomType) => void
}
export default function AppRoomTypeInput(props: AppRoomTypeInputProps) {
  let classes = useStyles(props)
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md={4}>
        <ButtonBase
          className={clsx(
            classes.card,
            props.value === "singles" && classes.active
          )}
          onClick={() => props.onChange("singles")}
          disableTouchRipple
          disableRipple>
          <AppTypography variant="h2">Singles Only</AppTypography>
          <AppTypography variant="body1" color="textSecondary">
            Increased cost but recommended if it’s your team’s first retreat.
          </AppTypography>
        </ButtonBase>
      </Grid>
      <Grid item xs={12} md={4}>
        <ButtonBase
          className={clsx(
            classes.card,
            props.value === "doubles" && classes.active
          )}
          onClick={() => props.onChange("doubles")}
          disableTouchRipple
          disableRipple>
          <AppTypography variant="h2">Doubles Okay</AppTypography>
          <AppTypography variant="body1" color="textSecondary">
            Doubles help reduce cost but can increase complexity.
          </AppTypography>
        </ButtonBase>
      </Grid>
      <Grid item xs={12} md={4}>
        <ButtonBase
          className={clsx(
            classes.card,
            props.value === "either" && classes.active
          )}
          onClick={() => props.onChange("either")}
          disableTouchRipple
          disableRipple>
          <AppTypography variant="h2">Either works!</AppTypography>
          <AppTypography variant="body1" color="textSecondary">
            Depending on the location you may have one type or a mix.
          </AppTypography>
        </ButtonBase>
      </Grid>
    </Grid>
  )
}
