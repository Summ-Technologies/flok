import {
  Button,
  IconButton,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {Clear} from "@material-ui/icons"
import {useFormik} from "formik"
import _ from "lodash"
import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import sanitizeHtml from "sanitize-html"
import * as yup from "yup"
import {AdminRetreatModel} from "../../models"
import {RootState} from "../../store"
import {getHotelDetails, patchRetreatDetails} from "../../store/actions/admin"
import AppWysiwygEditor from "../base/AppWysiwygEditor"
import HotelSelectModal from "../lodging/HotelSelectModal"

let useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
    borderRadius: theme.shape.borderRadius,
  },

  datesRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  notesContainer: {
    width: "100%",
    "& > *:first-child": {
      marginLeft: theme.spacing(0.5),
      fontWeight: theme.typography.fontWeightMedium,
    },
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(0.5),
    },
  },
}))

type RetreatHotelContractFormProps = {retreat: AdminRetreatModel}
export default function RetreatHotelContractForm(
  props: RetreatHotelContractFormProps
) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let [hotelSearchOpen, setHotelSearchOpen] = useState(false)

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      lodging_final_hotel_id: props.retreat.lodging_final_hotel_id,
      lodging_final_start_date: props.retreat.lodging_final_start_date,
      lodging_final_end_date: props.retreat.lodging_final_end_date,
      lodging_final_destination: props.retreat.lodging_final_destination,
      lodging_final_contract_url: props.retreat.lodging_final_contract_url,
      lodging_final_contract_notes: props.retreat.lodging_final_contract_notes,
    },
    validationSchema: yup.object({
      lodging_final_contract_url: yup
        .string()
        .url("Valid URL is required.")
        .nullable(),
    }),
    onSubmit: async (vals, formikHelpers) => {
      formikHelpers.setSubmitting(true)
      await dispatch(patchRetreatDetails(props.retreat.id, sanitizeForm(vals)))
      formikHelpers.setSubmitting(false)
    },
  })

  let hotel = useSelector((state: RootState) =>
    formik.values.lodging_final_hotel_id
      ? state.admin.hotelsDetails[formik.values.lodging_final_hotel_id]
      : undefined
  )
  useEffect(() => {
    if (!hotel && formik.values.lodging_final_hotel_id) {
      dispatch(getHotelDetails(formik.values.lodging_final_hotel_id))
    }
  }, [dispatch, hotel, formik.values.lodging_final_hotel_id])

  const commonTextFieldProps: TextFieldProps = {
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
    fullWidth: true,
  }

  type HotelContractForm = Partial<{
    lodging_final_hotel_id: number
    lodging_final_start_date: string
    lodging_final_end_date: string
    lodging_final_destination: string
    lodging_final_contract_url: string
    lodging_final_contract_notes: string
  }>
  function sanitizeForm(form: HotelContractForm) {
    return {
      lodging_final_hotel_id: form.lodging_final_hotel_id
        ? form.lodging_final_hotel_id
        : undefined,
      lodging_final_start_date: form.lodging_final_start_date
        ? form.lodging_final_start_date
        : undefined,
      lodging_final_end_date: form.lodging_final_end_date
        ? form.lodging_final_end_date
        : undefined,
      lodging_final_destination: form.lodging_final_destination
        ? form.lodging_final_destination
        : undefined,
      lodging_final_contract_url: form.lodging_final_contract_url
        ? form.lodging_final_contract_url
        : undefined,
      lodging_final_contract_notes: form.lodging_final_contract_notes
        ? sanitizeHtml(form.lodging_final_contract_notes)
        : undefined,
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className={classes.root}>
      <div>
        <TextField
          {...commonTextFieldProps}
          label="Hotel selected"
          placeholder="No hotel selected"
          onChange={() => undefined}
          value={hotel ? hotel.name : ""}
          onInputCapture={() => setHotelSearchOpen(true)}
          onClick={() => setHotelSearchOpen(true)}
          InputProps={{
            endAdornment: hotel ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  formik.setFieldValue("lodging_final_hotel_id", undefined)
                }}>
                <Clear />
              </IconButton>
            ) : undefined,
          }}
        />
        {hotelSearchOpen ? (
          <HotelSelectModal
            onClose={() => setHotelSearchOpen(false)}
            onSubmit={(hotelId) => {
              formik.setFieldValue("lodging_final_hotel_id", hotelId)
              setHotelSearchOpen(false)
            }}
          />
        ) : undefined}
      </div>
      <TextField
        {...commonTextFieldProps}
        id="lodging_final_destination"
        placeholder="Enter destination"
        label="Destination"
        value={
          formik.values.lodging_final_destination
            ? formik.values.lodging_final_destination
            : ""
        }
      />
      <div className={classes.datesRow}>
        <TextField
          {...commonTextFieldProps}
          id="lodging_final_start_date"
          type="date"
          label="Start date"
          value={
            formik.values.lodging_final_start_date
              ? formik.values.lodging_final_start_date
              : ""
          }
        />
        <TextField
          {...commonTextFieldProps}
          id="lodging_final_end_date"
          type="date"
          label="End date"
          value={
            formik.values.lodging_final_end_date
              ? formik.values.lodging_final_end_date
              : ""
          }
        />
      </div>
      <TextField
        {...commonTextFieldProps}
        id="lodging_final_contract_url"
        placeholder="Contract URL"
        label="Link to final contract"
        error={formik.errors.lodging_final_contract_url ? true : false}
        helperText={formik.errors.lodging_final_contract_url}
        value={
          formik.values.lodging_final_contract_url
            ? formik.values.lodging_final_contract_url
            : ""
        }
      />
      <div className={classes.notesContainer}>
        <Typography variant="body2">Contract notes</Typography>
        <AppWysiwygEditor
          value={formik.values.lodging_final_contract_notes}
          onChange={(e) =>
            formik.setFieldValue("lodging_final_contract_notes", e.target.value)
          }
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={
          _.isEqual(
            sanitizeForm(formik.initialValues),
            sanitizeForm(formik.values)
          ) || !formik.isValid
        }>
        Save Changes
      </Button>
    </form>
  )
}
