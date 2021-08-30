import {ButtonBase, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& $card:first-child": {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderTopLeftRadius: theme.shape.borderRadius,
    },
    "& $card:last-child": {
      borderBottomRightRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius,
    },
  },
  card: {
    padding: theme.spacing(2),
    width: "100%",
    border: `solid 1px ${theme.palette.grey[300]}`,
    borderColor: (props: AppRoomTypeInputProps) =>
      props.error ? theme.palette.error.main : theme.palette.grey[300],
    "&.active": {
      borderColor: (props: AppRoomTypeInputProps) =>
        props.error ? theme.palette.error.main : theme.palette.primary.main,

      borderWidth: 2,
      backgroundColor: theme.palette.common.white,
    },
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "center",
    flexDirection: "column",
    "&:hover": {
      boxShadow: theme.shadows[1],
    },
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(0.5),
    },
    "& > .MuiTypography-root": {
      width: "100%",
    },
  },
}))

type RoomType = "singles" | "doubles" | "either"

type AppRoomTypeInputProps = {
  value?: RoomType
  onChange: (newVal: RoomType) => void
  error?: boolean
}
export default function AppRoomTypeInput(props: AppRoomTypeInputProps) {
  let classes = useStyles(props)
  return (
    <div className={classes.root}>
      <ButtonBase
        className={clsx(classes.card, props.value === "singles" && "active")}
        onClick={() => props.onChange("singles")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">Singles</AppTypography>
      </ButtonBase>
      <ButtonBase
        className={clsx(classes.card, props.value === "doubles" && "active")}
        onClick={() => props.onChange("doubles")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">Doubles</AppTypography>
      </ButtonBase>
      <ButtonBase
        className={clsx(classes.card, props.value === "either" && "active")}
        onClick={() => props.onChange("either")}
        disableTouchRipple
        disableRipple>
        <AppTypography variant="h3">Both</AppTypography>
      </ButtonBase>
    </div>
  )
}
