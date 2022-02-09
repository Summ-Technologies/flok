import {
  Box,
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  Select,
  Switch,
  TextField,
} from "@material-ui/core"
import React, {useState} from "react"
import {
  AdminRetreatDetailsModel,
  DashboardStateOptions,
  RetreatStateOptions,
} from "../../models"
import AppTypography from "../base/AppTypography"

let useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: -theme.spacing(2),
    marginLeft: -theme.spacing(2),
    "& > *": {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
  formGroup: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.up("md")]: {width: "50%"},
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
  },
}))

type RetreatInfoFormProps = {retreat: AdminRetreatDetailsModel}
export default function RetreatInfoForm(props: RetreatInfoFormProps) {
  let classes = useStyles(props)
  let [editing, setEditing] = useState(false)
  let {retreat} = props
  return (
    <form className={classes.root}>
      <Box display="flex" alignItems="center" width="100%">
        <AppTypography variant="body2">Edit</AppTypography>
        <Switch
          color="primary"
          value={editing}
          onChange={() => setEditing(!editing)}
        />
      </Box>
      <div className={classes.formGroup}>
        <AppTypography variant="h4">Basic Info</AppTypography>
        <TextField
          fullWidth
          disabled={!editing}
          defaultValue={retreat.contact_name}
          label="Contact Name"
        />
        <TextField
          fullWidth
          disabled={!editing}
          defaultValue={retreat.contact_email}
          label="Contact Email"
        />
        <TextField
          type="number"
          fullWidth
          disabled={!editing}
          defaultValue={retreat.preferences_num_attendees_lower}
          label="Number Attendees"
        />
        <FormControl>
          <InputLabel id="retreat-dates-label">
            Flexible retreat dates?
          </InputLabel>
          <Select
            native
            value={retreat.preferences_is_dates_flexible ? "true" : "false"}
            disabled={!editing}
            labelId="retreat-dates-label">
            <option value={"true"}>Flexible dates</option>
            <option value={"false"}>Exact dates</option>
          </Select>
        </FormControl>
        {retreat.preferences_is_dates_flexible ? (
          <>
            <TextField
              type="date"
              fullWidth
              disabled={!editing}
              defaultValue={retreat.preferences_dates_exact_start}
              label="Start date"
            />
            <TextField
              type="date"
              fullWidth
              disabled={!editing}
              defaultValue={retreat.preferences_dates_exact_end}
              label="End date"
            />
          </>
        ) : (
          <>
            <TextField
              type="date"
              fullWidth
              disabled={!editing}
              defaultValue={retreat.preferences_dates_exact_start}
              label="Start date"
            />
            <TextField
              type="date"
              fullWidth
              disabled={!editing}
              defaultValue={retreat.preferences_dates_exact_end}
              label="End date"
            />
          </>
        )}
      </div>

      <div className={classes.formGroup}>
        <AppTypography variant="h4">Flok Info</AppTypography>
        <TextField
          fullWidth
          InputLabelProps={{shrink: true}}
          disabled={!editing}
          defaultValue={retreat.flok_admin_owner}
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
        <FormControl>
          <InputLabel id="retreat-state-label">Flok State</InputLabel>
          <Select
            native
            value={retreat.flok_admin_state}
            disabled={!editing}
            labelId="retreat-state-label">
            {RetreatStateOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="dashboard-state-label">
            Client Dashboard State
          </InputLabel>
          <Select
            native
            value={retreat.state}
            disabled={!editing}
            labelId="dashboard-state-label">
            {DashboardStateOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>
    </form>
  )
}
