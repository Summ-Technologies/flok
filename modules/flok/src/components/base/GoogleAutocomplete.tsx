import {Box, Grid, makeStyles, Typography} from "@material-ui/core"
import {LocationOn} from "@material-ui/icons"
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from "@material-ui/lab/Autocomplete"
import parse from "autosuggest-highlight/parse"
import throttle from "lodash/throttle"
import React, {ReactNode, useEffect, useMemo} from "react"
import config, {GOOGLE_API_KEY} from "../../config"
import {GooglePlaceType} from "../../models"
import {useScript} from "../../utils"
import {apiToModel} from "../../utils/apiUtils"

let autocompleteService = {current: undefined}

const useStyles = makeStyles((theme) => ({
  root: {},
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}))

interface GoogleAutocompleteProps
  extends Omit<
    AutocompleteProps<GooglePlaceType, false, undefined, undefined>,
    "options"
  > {
  onSelectLocation: (location: GooglePlaceType) => boolean | void // return true if clear input on select
  renderInput: (params: AutocompleteRenderInputParams) => ReactNode
  placesType?: string
  value?: GooglePlaceType
}
export default function GoogleAutocomplete(props: GoogleAutocompleteProps) {
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
            {
              ...request,
              types: [
                props.placesType !== undefined ? props.placesType : "(cities)",
              ],
            },
            (results: any) => callback(apiToModel(results))
          )
        },
        500
      ),
    [props.placesType]
  )

  useEffect(() => {
    if (props.value) setValue(props.value)
  }, [props.value])

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
      filterSelectedOptions
      filterOptions={(x) => x}
      inputValue={inputValue}
      value={value}
      onChange={(event, newValue, reason) => {
        switch (reason) {
          case "select-option":
            if (newValue) {
              let clearInput = props.onSelectLocation(newValue)
              if (clearInput) {
                setInputValue("")
                setValue(null)
              }
            }
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        if ("input" === reason) {
          setInputValue(newInputValue)
        } else if ("reset" === reason) {
          if (newInputValue) {
            setInputValue(newInputValue)
          } else {
            if (value) {
              setInputValue(getLabel(value))
            }
          }
        }
      }}
      renderInput={props.renderInput}
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
              <LocationOn className={classes.icon} />
            </Grid>
            <Grid item>
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
