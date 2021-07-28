import {FormControl, InputLabel, makeStyles, Select} from "@material-ui/core"
import React from "react"
import AppTypography from "../base/AppTypography"

const useStyles = makeStyles((theme) => ({
  inputHeader: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: theme.spacing(2),
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
    "& *": {
      lineHeight: 1,
    },
  },
  inputSelect: {
    minWidth: "30ch",
  },
}))

type AppNightsSelectProps = {
  value: number | ""
  handleChange: any
  handleBlur: any
  handleError: any
}
export default function AppNightsSelect(props: AppNightsSelectProps) {
  let classes = useStyles(props)
  return (
    <>
      <div className={classes.inputHeader}>
        <AppTypography variant="h2">Number of nights</AppTypography>
      </div>
      <FormControl variant="outlined" className={classes.inputSelect}>
        <InputLabel htmlFor="numNights"># nights</InputLabel>
        <Select
          label="# nights"
          id="numNights"
          required
          value={props.value}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          error={props.handleError}>
          {[
            {label: "", value: ""},
            {label: "1 night", value: 1},
            {label: "2 nights", value: 2},
            {label: "3 nights", value: 3},
            {label: "4 nights", value: 4},
            {label: "5 nights", value: 5},
            {label: "6 nights", value: 6},
            {label: "7 nights", value: 7},
            {label: "8+ nights", value: 8},
          ].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
