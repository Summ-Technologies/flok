import {makeStyles, Select, SelectProps} from "@material-ui/core"
import clsx from "clsx"
import React from "react"

let useStyles = makeStyles((theme) => ({
  root: {},
  select: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
}))

interface AppInputDropdownProps extends SelectProps {
  options: {value: string; label: string}[]
}
export default function AppInputDropdown(props: AppInputDropdownProps) {
  let classes = useStyles(props)
  let {options, defaultValue, ...otherProps} = {...props}
  return (
    <Select
      classes={{select: clsx(classes.select, otherProps.classes?.select)}}
      native={true}
      variant="outlined"
      {...otherProps}
      className={clsx(classes.root, props.className)}>
      {props.options.map((option) => (
        <option key={option.value} value={option.value} label={option.label} />
      ))}
    </Select>
  )
}
