import {Button, makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: "8px 6px",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "content-box",
    "& .AppInputToggle-activeButton": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  option: {
    paddingTop: 9.5,
    paddingBottom: 9.5,
    width: "50%",
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
            color="inherit"
            disableElevation
            disableFocusRipple
            onClick={() => props.onChange(optionValue)}
            key={index}
            className={clsx(
              classes.option,
              isActive ? "AppInputToggle-activeButton" : undefined
            )}>
            <div className={"MuiInputBase-root"}>{option}</div>
          </Button>
        )
      })}
    </div>
  )
}
