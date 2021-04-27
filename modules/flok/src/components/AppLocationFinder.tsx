import {
  Box,
  makeStyles,
  Paper,
  StandardProps,
  Typography,
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import {Search} from "@material-ui/icons"
import LocationOnIcon from "@material-ui/icons/LocationOn"
import Autocomplete from "@material-ui/lab/Autocomplete"
import parse from "autosuggest-highlight/parse"
import throttle from "lodash/throttle"
import React, {useEffect, useMemo} from "react"
import config, {GOOGLE_API_KEY} from "../config"
import {GooglePlaceType} from "../models"
import {RetreatEmployeeLocationItem} from "../models/retreat"
import {useScript} from "../utils"
import {apiToModel} from "../utils/apiUtils"

let autocompleteService = {current: undefined}

const useStyles = makeStyles((theme) => ({
  root: {marginBottom: theme.spacing(2)},
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

interface AppLocationFinderProps extends StandardProps<{}, "root"> {
  onSelectLocation: (location: RetreatEmployeeLocationItem) => void
}
export default function AppLocationFinder(props: AppLocationFinderProps) {
  const classes = useStyles()

  const [value, setValue] = React.useState<GooglePlaceType | null>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState<GooglePlaceType[]>([])
  let [googleMapScript] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${config.get(
      GOOGLE_API_KEY
    )}&libraries=places`
  )

  function getLabel(place: GooglePlaceType) {
    return place.description
  }

  const fetch = useMemo(
    () =>
      throttle(
        (
          request: {input: string},
          callback: (results?: GooglePlaceType[]) => void
        ) => {
          ;(autocompleteService.current as any).getPlacePredictions(
            {...request, types: ["(cities)"]},
            (results: any) => callback(apiToModel(results))
          )
        },
        500
      ),
    []
  )
  function googlePlaceTypeToLocationType(
    place: GooglePlaceType
  ): RetreatEmployeeLocationItem {
    return {
      id: -1,
      submissionId: -1,
      employeeCount: 1,
      googlePlaceId: place.placeId,
      mainText: place.structuredFormatting.mainText,
      secondaryText: place.structuredFormatting.secondaryText,
    }
  }

  useEffect(() => {
    let active = true
    if (!autocompleteService.current && googleMapScript) {
      let google: any = (window as any).google
      autocompleteService.current = new google.maps.places.AutocompleteService()
    }

    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValue === "") {
      setOptions(value ? [value] : [])
      return undefined
    }

    fetch({input: inputValue}, (results?: GooglePlaceType[]) => {
      if (active) {
        let newOptions = [] as GooglePlaceType[]

        if (value) {
          newOptions = [value]
        }

        if (results) {
          newOptions = [...newOptions, ...results]
        }

        setOptions(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [value, inputValue, fetch, googleMapScript])

  return (
    <Autocomplete
      className={`${classes.root} ${props.className}`}
      getOptionLabel={getLabel}
      options={options}
      autoComplete
      inputValue={inputValue}
      value={value}
      onChange={(event, newValue, reason) => {
        switch (reason) {
          case "select-option":
            if (newValue)
              props.onSelectLocation(googlePlaceTypeToLocationType(newValue))
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
            variant="standard"
            InputProps={{
              ...params.InputProps,
              endAdornment: <Search className="MuiAutocomplete-endAdornment" />,
            }}
            fullWidth
          />
        </Paper>
      )}
      renderOption={(option) => {
        const matches = option.structuredFormatting.mainTextMatchedSubstrings
        const parts = parse(
          option.structuredFormatting.mainText,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ])
        )
        let label = (
          <Typography component="span" variant="body1">
            {parts.map((part: any, i) => (
              <Box
                component="span"
                key={i}
                fontWeight={part.highlight ? "fontWeightMedium" : undefined}>
                {part.text}
              </Box>
            ))}
          </Typography>
        )

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {label}
              <Typography variant="body2" color="textSecondary">
                {option.structuredFormatting.secondaryText}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}
