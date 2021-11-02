import {Chip, makeStyles} from "@material-ui/core"
import {ToggleButtonGroup} from "@material-ui/lab"
import React from "react"

let useMultiSelectStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
}))

type AppMultiSelectProps = {
  options: {value: string; label: string}[]
  selectedValues: string[]
  onSelect: (value: string) => void
}
export function AppMultiSelect(props: AppMultiSelectProps) {
  let classes = useMultiSelectStyles(props)
  return (
    <div className={classes.root}>
      {props.options.map((option) => {
        let selected = props.selectedValues.includes(option.value)
        return (
          <Chip
            label={option.label}
            clickable
            variant={selected ? "default" : "outlined"}
            color={selected ? "primary" : "default"}
            onClick={() => props.onSelect(option.value)}
          />
        )
      })}
    </div>
  )
}

let useSingleSelectStyles = makeStyles((theme) => ({
  root: {},
}))

type AppSingleSelectProps = {
  options: {value: string; label: string}[]
  selectedValue: string
  onSelect: (value: string) => void
}

export function AppSingleSelect(props: AppSingleSelectProps) {
  let classes = useSingleSelectStyles(props)
  return (
    <ToggleButtonGroup className={classes.root}>
      {props.options.map((option) => {
        let selected = props.selectedValue === option.value
        return (
          <Chip
            label={option.label}
            clickable
            variant={selected ? "default" : "outlined"}
            color={selected ? "primary" : "default"}
            onClick={() => props.onSelect(option.value)}
          />
        )
      })}
    </ToggleButtonGroup>
  )
}
