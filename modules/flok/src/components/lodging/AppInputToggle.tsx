import {makeStyles} from "@material-ui/core"
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@material-ui/lab"
import clsx from "clsx"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {},
  option: {
    width: (props: AppInputToggleProps) => {
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

interface AppInputToggleProps extends ToggleButtonGroupProps {
  trueOption: string
  falseOption: string
}
export default function AppInputToggle(props: AppInputToggleProps) {
  let classes = useStyles(props)
  let {trueOption, falseOption, ...otherProps} = {...props}
  return (
    <ToggleButtonGroup
      {...otherProps}
      className={clsx(otherProps.className, classes.root)}>
      {[trueOption, falseOption].map((option, index) => {
        return (
          <ToggleButton
            key={index === 0 ? "true" : "false"}
            value={index === 0 ? true : false}
            className={classes.option}>
            <div className={"MuiInputBase-root"}>{option}</div>
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}
