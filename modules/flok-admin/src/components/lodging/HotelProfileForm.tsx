import {
  Box,
  Button,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {Autocomplete} from "@material-ui/lab"
import {useFormik} from "formik"
import _ from "lodash"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import * as yup from "yup"
import {AdminHotelDetailsModel} from "../../models"
import {RootState} from "../../store"
import {getLodgingTags, patchHotel} from "../../store/actions/admin"
import {
  getTextFieldErrorProps,
  nullifyEmptyString,
  useDestinations,
} from "../../utils"
import AppLoadingScreen from "../base/AppLoadingScreen"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: theme.spacing(-2),
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  },
  formGroup: {
    position: "relative",
    padding: theme.spacing(2),
    display: "flex",
    width: "100%",
    flexDirection: "column",
    "& > *:nth-child(n+3)": {marginTop: theme.spacing(2)},
  },
}))

type HotelProfileFormProps = {
  hotel: AdminHotelDetailsModel
}
export default function HotelProfileForm(props: HotelProfileFormProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let [destinations, destinationsLoading] = useDestinations()
  let [loadingUpdate, setLoadingUpdate] = useState(false)
  let lodgingTags = useSelector((state: RootState) => {
    return Object.values(state.admin.lodgingTags)
  })

  useEffect(() => {
    !lodgingTags[0] && dispatch(getLodgingTags())
  }, [])
  async function updateHotelProfile(values: Partial<AdminHotelDetailsModel>) {
    setLoadingUpdate(true)
    await dispatch(patchHotel(props.hotel.id, values))
    setLoadingUpdate(false)
  }
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: nullifyEmptyString({
      name: props.hotel.name,
      destination_id: props.hotel.destination_id,
      airport: props.hotel.airport,
      airport_travel_time: props.hotel.airport_travel_time,
      description_short: props.hotel.description_short,
      website_url: props.hotel.website_url,
      sub_location: props.hotel.sub_location,
      lodging_tags: props.hotel.lodging_tags,
    }),
    validationSchema: yup.object({website_url: yup.string().url().nullable()}),
    onSubmit: updateHotelProfile,
  })
  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
    disabled: loadingUpdate,
  }
  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <div>{loadingUpdate ? <AppLoadingScreen /> : undefined}</div>
        <Typography variant="h4">Hotel Profile</Typography>
        <TextField
          {...commonTextFieldProps}
          id="name"
          label="Hotel name"
          value={formik.values.name ?? ""}
          fullWidth
        />
        <TextField
          {...commonTextFieldProps}
          id="destination_id"
          label="Destination"
          value={formik.values.destination_id ?? ""}
          select
          SelectProps={{native: true}}
          fullWidth
          onChange={(e) => {
            formik.setFieldValue("destination_id", parseInt(e.target.value))
          }}>
          {destinationsLoading ? (
            <option>Loading destinations...</option>
          ) : undefined}
          {Object.values(destinations)
            .sort((destA, destB) =>
              ("" + destA!.location).localeCompare(destB!.location)
            )
            .map((dest) => {
              return (
                <option value={dest!.id} key={dest!.id}>
                  {dest!.location}
                </option>
              )
            })}
        </TextField>
        <TextField
          {...commonTextFieldProps}
          id="sub_location"
          label="Sub Location"
          value={formik.values.sub_location ?? ""}
          fullWidth
          helperText='Only add if it should be different from the "main" destination'
        />
        <TextField
          {...commonTextFieldProps}
          id="website_url"
          type="url"
          label="Website URL"
          value={formik.values.website_url ?? ""}
          fullWidth
          {...getTextFieldErrorProps(formik, "website_url")}
        />
        <TextField
          {...commonTextFieldProps}
          id="description_short"
          label="Description (short)"
          value={formik.values.description_short ?? ""}
          fullWidth
          multiline
          maxRows={3}
        />
        <TextField
          {...commonTextFieldProps}
          id="airport"
          label="Closest major airport (3-letter code)"
          value={formik.values.airport ?? ""}
          inputProps={{maxLength: 3}}
          fullWidth
        />
        <TextField
          {...commonTextFieldProps}
          id="airport_travel_time"
          type="number"
          label="Aiport travel time (in mins)"
          value={formik.values.airport_travel_time ?? ""}
          fullWidth
        />
        <Autocomplete
          id="retreatIds"
          value={formik.values.lodging_tags}
          multiple
          getOptionLabel={(tag) => tag.name}
          filterSelectedOptions
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderInput={(params) => (
            <TextField
              {...params}
              {...commonTextFieldProps}
              inputProps={{
                ...params.inputProps,
                onKeyPress: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    return false
                  }
                },
              }}
              onChange={undefined}
              label="Hotel Tags"
              placeholder="Select Hotel Tags"
            />
          )}
          options={lodgingTags}
          onChange={async (e, newVals) => {
            formik.setFieldValue("lodging_tags", newVals)
          }}
        />
      </Paper>
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button
          disabled={
            _.isEqual(
              nullifyEmptyString(formik.values),
              nullifyEmptyString(formik.initialValues)
            ) ||
            loadingUpdate ||
            !formik.isValid
          }
          type="submit"
          color="primary"
          variant="contained">
          Save Changes
        </Button>
      </Box>
    </form>
  )
}
