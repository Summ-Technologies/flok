import {
  Box,
  makeStyles,
  Paper,
  StandardProps,
  Typography,
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import {FlightRounded, Search} from "@material-ui/icons"
import LocationOnIcon from "@material-ui/icons/LocationOn"
import Autocomplete from "@material-ui/lab/Autocomplete"
import React, {useEffect, useState} from "react"
import {EmployeeLocation, EMPLOYEE_LOCATIONS, getLabel} from "../data/locations"

const useStyles = makeStyles((theme) => ({
  root: {marginBottom: theme.spacing(2)},
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

interface AppLocationFinderProps extends StandardProps<{}, "root"> {
  onSelectLocation: (location: EmployeeLocation) => void
}
export default function AppLocationFinder(props: AppLocationFinderProps) {
  const classes = useStyles()
  const [value, setValue] = useState<EmployeeLocation | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [options, setOptions] = useState<EmployeeLocation[]>([])

  useEffect(() => {
    let newOptions: EmployeeLocation[] = []

    if (value) {
      newOptions = [value]
    }

    let results = EMPLOYEE_LOCATIONS.filter((loc) => {
      const inputLower = inputValue.toLowerCase()
      let valid = false
      valid = loc.country.toLowerCase().includes(inputLower)
      valid = loc.city ? loc.city.toLowerCase().includes(inputLower) : valid
      valid = loc.name ? loc.name.toLowerCase().includes(inputLower) : valid
      valid = getLabel(loc).toLowerCase().includes(inputLower) ? true : valid
      return valid
    })

    if (results) {
      newOptions = [...newOptions, ...results]
    }

    setOptions(newOptions)
  }, [value, inputValue])

  return (
    <Autocomplete
      className={classes.root}
      getOptionLabel={getLabel}
      options={options}
      autoComplete
      filterSelectedOptions
      inputValue={inputValue}
      value={value}
      onChange={(event, newValue, reason) => {
        switch (reason) {
          case "select-option":
            if (newValue) props.onSelectLocation(newValue)
            setValue(null)
            setInputValue("")
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => (
        <Paper elevation={0}>
          <TextField
            {...params}
            label="Add a location"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: <Search className="MuiAutocomplete-endAdornment" />,
            }}
            fullWidth
          />
        </Paper>
      )}
      renderOption={(option) => {
        let labelStr = getLabel(option)
        let highlightIndex = getLabel(option)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase())
        let label = (
          <Typography component="span" variant="body1">
            {highlightIndex !== -1
              ? labelStr.substring(0, highlightIndex)
              : undefined}
            <Box component="span" fontWeight="fontWeightMedium">
              {labelStr.substring(
                highlightIndex,
                highlightIndex + inputValue.length
              )}
            </Box>
            {labelStr.substring(highlightIndex + inputValue.length)}
          </Typography>
        )

        return (
          <Grid container alignItems="center">
            <Grid item>
              {option.type === "AIRPORT" ? (
                <FlightRounded className={classes.icon} />
              ) : (
                <LocationOnIcon className={classes.icon} />
              )}
            </Grid>
            <Grid item xs>
              {label}
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
