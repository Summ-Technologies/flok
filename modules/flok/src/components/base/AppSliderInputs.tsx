import {makeStyles, Slider} from "@material-ui/core"
import React, {ChangeEvent} from "react"

let useStyles = makeStyles((theme) => ({
  root: {},
  thumb: {
    width: "auto",
    height: "auto",
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: 12,
    marginTop: -7,
    marginBottom: -7,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 2,
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
  active: {
    boxShadow: "unset",
  },
}))

type AppSliderInputProps = {
  value: number
  onChange: (value: number) => void
  max: number
  min: number
}
export function AppSliderInput(props: AppSliderInputProps) {
  let classes = useStyles(props)
  function handleChange(e: ChangeEvent<{}>, val: number | number[]) {
    props.onChange(val as unknown as number)
  }
  return (
    <Slider
      className={classes.root}
      classes={{thumb: classes.thumb, active: classes.active}}
      value={props.value}
      onChange={handleChange}
      min={props.min}
      max={props.max}
      ThumbComponent={SliderThumb}
    />
  )
}

type AppSliderRangeInputProps = {
  value: [number, number]
  onChange: (value: [number, number]) => void
  max: number
  min: number
}
export function AppSliderRangeInput(props: AppSliderRangeInputProps) {
  let classes = useStyles(props)
  function handleChange(e: ChangeEvent<{}>, val: number | number[]) {
    let newRange = val as unknown as [number, number]
    if (newRange[0] <= newRange[1]) {
      props.onChange(newRange)
    }
  }
  return (
    <Slider
      className={classes.root}
      classes={{thumb: classes.thumb, active: classes.active}}
      value={props.value}
      onChange={handleChange}
      min={props.min}
      max={props.max}
      ThumbComponent={SliderThumb}
    />
  )
}

function SliderThumb(props: any) {
  return <span {...props}>{props["aria-valuenow"]}</span>
}
