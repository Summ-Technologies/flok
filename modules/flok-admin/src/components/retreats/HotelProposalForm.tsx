import {
  Box,
  Button,
  FormControl,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {Add, Remove} from "@material-ui/icons"
import clsx from "clsx"
import {FormikErrors, useFormik} from "formik"
import _ from "lodash"
import React from "react"
import NumberFormat from "react-number-format"
import * as yup from "yup"
import {
  AdminLodgingProposalModel,
  AdminLodgingProposalUpdateModel,
} from "../../models"
import {createProposalForm} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"

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
    padding: theme.spacing(2),
    display: "flex",
    width: "100%",
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
  },
  additionalInfoGroup: {
    width: "100%",
  },
}))

type HotelProposalFormProps = {
  proposal: AdminLodgingProposalModel
  onSave: (values: AdminLodgingProposalUpdateModel) => void
  onDelete: () => void
}
export default function HotelProposalForm(props: HotelProposalFormProps) {
  let classes = useStyles(props)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: createProposalForm(props.proposal),
    validate: (values) => {
      let linkErrors = values.additional_links.map((link, i) => {
        try {
          yup.string().url().validateSync(link.link_url)
        } catch (err) {
          return {link_url: "Please enter a valid URL."}
        }
        return {}
      })
      if (linkErrors.filter((err) => !!err.link_url).length) {
        return {additional_links: linkErrors}
      } else {
        return undefined
      }
    },
    onSubmit: (values) => props.onSave(values),
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    style: {whiteSpace: "pre"},
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">General info</AppTypography>
        <TextField
          {...textFieldProps}
          id="dates"
          label="Dates"
          multiline
          value={formik.values.dates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="dates_note"
          label="Dates note"
          multiline
          value={formik.values.dates_note ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="num_guests"
          label="# Guests"
          multiline
          value={formik.values.num_guests ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="compare_room_rate"
          label="Guestroom rates"
          value={formik.values.compare_room_rate?.toString() ?? ""}
          onChange={(e) =>
            formik.setFieldValue("compare_room_rate", parseInt(e.target.value))
          }
          InputProps={{inputComponent: CurrencyNumberFormat as any}}
        />
        <TextField
          {...textFieldProps}
          id="compare_room_total"
          label="Approximate room total"
          value={formik.values.compare_room_total?.toString() ?? ""}
          onChange={(e) =>
            formik.setFieldValue("compare_room_total", parseInt(e.target.value))
          }
          InputProps={{inputComponent: CurrencyNumberFormat as any}}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Guest rooms</AppTypography>
        <TextField
          {...textFieldProps}
          id="guestroom_rates"
          label="Rates"
          multiline
          value={formik.values.guestroom_rates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="approx_room_total"
          label="Room total"
          multiline
          value={formik.values.approx_room_total ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="resort_fee"
          label="Resort fee"
          multiline
          value={formik.values.resort_fee ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="tax_rates"
          label="Tax rates"
          multiline
          value={formik.values.tax_rates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="additional_fees"
          label="Additional fees"
          multiline
          value={formik.values.additional_fees ?? ""}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Meeting spaces</AppTypography>
        <TextField
          {...textFieldProps}
          id="suggested_meeting_spaces"
          label="Suggested meeting rooms"
          multiline
          value={formik.values.suggested_meeting_spaces ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="meeting_room_rates"
          label="Meeting room rates"
          multiline
          value={formik.values.meeting_room_rates ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="meeting_room_tax_rates"
          label="Meeting room tax rates"
          multiline
          value={formik.values.meeting_room_tax_rates ?? ""}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Food and beverage</AppTypography>
        <TextField
          {...textFieldProps}
          id="food_bev_minimum"
          label="Food and beverage minimum"
          multiline
          value={formik.values.food_bev_minimum ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="food_bev_service_fee"
          label="Food and beverage service fee"
          multiline
          value={formik.values.food_bev_service_fee ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_breakfast_price"
          label="Average breakfast price"
          multiline
          value={formik.values.avg_breakfast_price ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_snack_price"
          label="Average snack price"
          multiline
          value={formik.values.avg_snack_price ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_lunch_price"
          label="Average lunch price"
          multiline
          value={formik.values.avg_lunch_price ?? ""}
        />
        <TextField
          {...textFieldProps}
          id="avg_dinner_price"
          label="Average dinner price"
          multiline
          value={formik.values.avg_dinner_price ?? ""}
        />
      </Paper>
      <Paper
        elevation={0}
        className={clsx(classes.formGroup, classes.additionalInfoGroup)}>
        <AppTypography variant="h4">Additional info</AppTypography>
        <TextField
          {...textFieldProps}
          id="cost_saving_notes"
          variant="outlined"
          minRows={5}
          label="Additional notes"
          multiline
          value={formik.values.cost_saving_notes ?? ""}
        />
        <FormControl>
          <AppTypography variant="body2">Additional links</AppTypography>
          {formik.values.additional_links.map((link, i) => (
            <Box display="flex" alignItems="flex-start" marginY={1}>
              <TextField
                {...textFieldProps}
                id={`additional_links[${i}].link_text`}
                InputLabelProps={{shrink: true}}
                value={link.link_text ?? ""}
                required
                label="Link text"
              />
              <TextField
                {...textFieldProps}
                id={`additional_links[${i}].link_url`}
                error={
                  formik.errors.additional_links
                    ? !!(
                        formik.errors.additional_links[i] as FormikErrors<{
                          link_url: string
                          link_text: string
                        }>
                      ).link_url
                    : false
                }
                helperText={
                  formik.errors.additional_links
                    ? (
                        formik.errors.additional_links[i] as FormikErrors<{
                          link_url: string
                          link_text: string
                        }>
                      ).link_url
                    : undefined
                }
                InputLabelProps={{shrink: true}}
                style={{marginLeft: 4, marginRight: 4}}
                value={link.link_url ?? ""}
                required
                label="Link URL"
              />
              <TextField
                {...textFieldProps}
                id="affinity"
                label="Link section"
                select
                SelectProps={{native: true}}
                onChange={(e) => {
                  let newVal = e.target.value || null
                  formik.setFieldValue(
                    `additional_links[${i}].affinity`,
                    newVal
                  )
                }}
                value={link.affinity ?? ""}>
                <option value={""}>General info</option>
                <option value={"MEETING_ROOMS"}>Meeting space</option>
                <option value={"GUESTROOMS"}>Guest rooms</option>
                <option value={"FOOD_BEV"}>Food & Bev</option>
              </TextField>
              <IconButton
                style={{marginTop: 15}}
                size="small"
                onClick={() => {
                  formik.setFieldValue(
                    "additional_links",
                    formik.values.additional_links.filter((val, j) => j !== i)
                  )
                }}>
                <Remove fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Box marginLeft="auto" marginTop={1}>
            <IconButton>
              <Add
                onClick={() => {
                  formik.setFieldValue("additional_links", [
                    ...formik.values.additional_links,
                    {link_url: "", link_text: "", affinity: ""},
                  ])
                }}
              />
            </IconButton>
          </Box>
        </FormControl>
      </Paper>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Button color="secondary" variant="outlined" onClick={props.onDelete}>
          Delete Proposal
        </Button>
        <Button
          disabled={_.isEqual(
            createProposalForm(formik.values),
            createProposalForm(formik.initialValues)
          )}
          type="submit"
          color="primary"
          variant="contained">
          Save Changes
        </Button>
      </Box>
    </form>
  )
}

type CurrencyNumberFormatProps = {
  onChange: (e: {target: {name: string; value: string}}) => void
}

function CurrencyNumberFormat(props: CurrencyNumberFormatProps) {
  const {onChange, ...other} = props
  return (
    <NumberFormat
      {...other}
      onValueChange={(values) => {
        props.onChange({
          target: {name: (other as any).id, value: values.value},
        })
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  )
}
