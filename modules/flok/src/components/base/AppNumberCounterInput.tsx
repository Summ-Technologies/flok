import {Button, makeStyles} from "@material-ui/core"
import React from "react"
import AppTypography from "./AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: (props: AppNumberCounterInputProps) =>
      props.size === "small" ? 10 : 20,
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  btn: {
    borderRadius: (props: AppNumberCounterInputProps) =>
      props.size === "small" ? 10 : 20,
    fontSize: theme.typography.body1.fontSize,
    height: (props: AppNumberCounterInputProps) =>
      props.size === "small" ? 20 : 40,
    width: (props: AppNumberCounterInputProps) =>
      props.size === "small" ? 20 : 40,
    minWidth: 0,
  },
}))

type AppNumberCounterInputProps = {
  value: number
  onChange: (val: number) => void
  max?: number
  min?: number
  size?: "default" | "small"
}
export default function AppNumberCounterInput(
  props: AppNumberCounterInputProps
) {
  let classes = useStyles(props)
  function increment() {
    let newValue = props.value + 1
    if (props.max !== undefined && newValue <= props.max) {
      props.onChange(newValue)
    }
  }
  function decrement() {
    let newValue = props.value - 1
    if (props.min !== undefined && newValue >= props.min) {
      props.onChange(newValue)
    }
  }
  return (
    <div className={classes.root}>
      <Button
        className={classes.btn}
        disableFocusRipple
        color="inherit"
        onClick={decrement}>
        -
      </Button>
      <AppTypography variant="body1" fontWeight="bold">
        {props.value}
      </AppTypography>
      <Button
        className={classes.btn}
        disableFocusRipple
        color="inherit"
        onClick={increment}>
        +
      </Button>
    </div>
  )
}
