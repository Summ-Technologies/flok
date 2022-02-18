import {
  Box,
  Button,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  AdminRetreatModel,
  DashboardStateOptions,
  RetreatStateOptions,
} from "../../models"
import {RootState} from "../../store"
import {putRetreatDetails} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: -theme.spacing(2),
    marginLeft: -theme.spacing(2),
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      padding: theme.spacing(2),
    },
  },
  formGroup: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
  },
}))

function getRetreatDetailsForm(obj: Partial<AdminRetreatModel>) {
  return {
    contact_name: obj.contact_name || undefined,
    contact_email: obj.contact_email || undefined,
    preferences_num_attendees_lower:
      obj.preferences_num_attendees_lower || undefined,
    preferences_is_dates_flexible: obj.preferences_is_dates_flexible || false,
    preferences_dates_exact_start:
      obj.preferences_dates_exact_start || undefined,
    preferences_dates_exact_end: obj.preferences_dates_exact_end || undefined,
    flok_admin_owner: obj.flok_admin_owner || undefined,
    flok_admin_state: obj.flok_admin_state || undefined,
    state: obj.state || undefined,
  }
}
export type RetreatDetailsFormType = ReturnType<typeof getRetreatDetailsForm>

type RetreatInfoFormProps = {retreat: AdminRetreatModel}
export default function RetreatInfoForm(props: RetreatInfoFormProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let {retreat} = props
  let loading = useSelector(
    (state: RootState) => state.admin.api.retreatsDetails[retreat.id]?.loading
  )
  let formik = useFormik({
    initialValues: getRetreatDetailsForm(retreat),
    onSubmit: (values) => {
      dispatch(putRetreatDetails(retreat.id, getRetreatDetailsForm(values)))
    },
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Basic Info</AppTypography>
        <TextField
          {...textFieldProps}
          id="contact_name"
          value={formik.values.contact_name}
          label="Contact Name"
        />
        <TextField
          {...textFieldProps}
          id="contact_email"
          value={formik.values.contact_email}
          label="Contact Email"
        />
        <TextField
          {...textFieldProps}
          id="preferences_num_attendees_lower"
          value={formik.values.preferences_num_attendees_lower}
          type="number"
          label="Number Attendees"
        />
        <TextField
          {...textFieldProps}
          id="preferences_is_dates_flexible"
          label="Flexible retreat dates?"
          select
          SelectProps={{native: true}}
          onChange={(e) => {
            formik.setFieldValue(
              "preferences_is_dates_flexible",
              e.target.value === "true"
            )
          }}
          value={
            formik.values.preferences_is_dates_flexible ? "true" : "false"
          }>
          <option value={"true"}>Flexible dates</option>
          <option value={"false"}>Exact dates</option>
        </TextField>
        {formik.values.preferences_is_dates_flexible ? (
          <>
            <AppTypography variant="body1">
              <strong>[Under construction]</strong> Flexible dates module still
              being implemented
            </AppTypography>
          </>
        ) : (
          <>
            <TextField
              {...textFieldProps}
              id="preferences_dates_exact_start"
              type="date"
              value={formik.values.preferences_dates_exact_start}
              label="Start date"
            />
            <TextField
              {...textFieldProps}
              id="preferences_dates_exact_end"
              type="date"
              value={formik.values.preferences_dates_exact_end}
              label="End date"
            />
          </>
        )}
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Flok Info</AppTypography>
        <TextField
          {...textFieldProps}
          id="flok_admin_owner"
          value={formik.values.flok_admin_owner}
          label="Flok Owner"
        />
        <Box>
          <InputLabel shrink id="calendly-call-label">
            Intro call scheduled?
          </InputLabel>
          <Button
            size="small"
            aria-labelledby="calendly-call-labl"
            disabled={!!!retreat.flok_admin_calendly_call}
            variant="contained"
            href={retreat.flok_admin_calendly_call}
            target="__blank">
            {retreat.flok_admin_calendly_call
              ? "See calendar details"
              : "No call scheduled"}
          </Button>
        </Box>

        <TextField
          {...textFieldProps}
          label="Flok State"
          id="flok_admin_state"
          value={formik.values.flok_admin_state}
          select
          SelectProps={{native: true}}
          onChange={formik.handleChange}>
          {RetreatStateOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </TextField>
        <TextField
          {...textFieldProps}
          id="state"
          label="Client Dashboard State"
          value={formik.values.state}
          onChange={formik.handleChange}
          select
          SelectProps={{native: true}}>
          {DashboardStateOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </TextField>
      </Paper>
      {_.isEqual(
        getRetreatDetailsForm(retreat),
        getRetreatDetailsForm(formik.values)
      ) ? undefined : (
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="primary">
            {loading ? "Loading..." : "Save changes"}
          </Button>
        </Box>
      )}
    </form>
  )
}
