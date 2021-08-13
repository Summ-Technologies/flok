import {Button, makeStyles} from "@material-ui/core"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.grey[200],
    boxSizing: "content-box",
  },
  option: {
    width: "50%",
    borderRadius: theme.shape.borderRadius,
    minWidth: (props: AppInputToggleProps) => {
      return `calc(${Math.max(
        props.trueOption.length,
        props.falseOption.length
      )}ch + ${theme.spacing(1 * 2)}px)`
    },

    "& .MuiInputBase-root": {
      cursor: "unset", //pointer set by button
    },
  },
}))

type AppInputToggleProps = {
  value: boolean
  onChange: (val: boolean) => void
  trueOption: string
  falseOption: string
}
export default function AppInputToggle(props: AppInputToggleProps) {
  let classes = useStyles(props)
  return (
    <div className={`${classes.root} MuiOutlinedInput-notchedOutline`}>
      {[props.trueOption, props.falseOption].map((option, index) => {
        let optionValue = index === 0 ? true : false
        let isActive = optionValue === props.value
        return (
          <Button
            variant={isActive ? "contained" : "text"}
            color={isActive ? "primary" : "default"}
            disableElevation
            disableFocusRipple
            onClick={() => props.onChange(optionValue)}
            key={index}
            className={classes.option}>
            {option}
          </Button>
        )
      })}
    </div>
  )
}
