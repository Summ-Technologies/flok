import {
  Button,
  Collapse,
  InputAdornment,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@material-ui/core"
import {Help} from "@material-ui/icons"
import {useFormik} from "formik"
import {useState} from "react"
import {
  BudgetBreakdownInputType,
  BUDGET_TOOL_FLOK_RECOMENDATIONS,
} from "../../utils/pretripUtils"
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
    overflowY: "scroll",
    display: "flex",
    width: "100%",
    [theme.breakpoints.up("md")]: {width: `calc(50% - ${theme.spacing(2)}px)`},
    flexDirection: "column",
    "& > *:not(:first-child)": {marginTop: theme.spacing(2)},
  },
  buttons: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textfieldTitle: {},
}))

export default function BudgetCalculator(props: {
  onSubmit: (budgetBreakdown: BudgetBreakdownInputType) => void
}) {
  let [open, setOpen] = useState(false)
  let classes = useStyles(props)
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {...BUDGET_TOOL_FLOK_RECOMENDATIONS},
    onSubmit: (values) => props.onSubmit(values),
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }
  return (
    <>
      {!open && (
        <AppTypography
          underline
          style={{cursor: "pointer"}}
          onClick={() => setOpen(true)}>
          Show retreat settings
        </AppTypography>
      )}
      <Collapse in={open}>
        <AppTypography fontWeight="bold" variant="h3" style={{marginBottom: 6}}>
          Retreat Settings
        </AppTypography>
        <form className={classes.root} onSubmit={formik.handleSubmit}>
          <Paper elevation={0} className={classes.formGroup}>
            <TextField
              {...textFieldProps}
              id="trip_length"
              value={formik.values.trip_length}
              label={
                <div className={classes.textfieldTitle}>
                  Trip Length{" "}
                  <Tooltip
                    title={
                      <AppTypography>
                        The typical Flok retreat is 4 days, with the first and
                        last day being travel days. For a Monday through
                        Thursday retreat, people would arrive Monday afternoon
                        in time for a dinner/reception and head to the airport
                        after breakfast on Thursday.
                      </AppTypography>
                    }>
                    <Help />
                  </Tooltip>
                </div>
              }
              select
              InputLabelProps={{style: {pointerEvents: "auto"}}}
              SelectProps={{
                native: false,
                onChange: (e) =>
                  formik.setFieldValue("trip_length", e.target.value),
              }}>
              {[3, 4, 5, 6, 7, 8].map((d) => (
                <MenuItem key={d} value={d}>
                  {d} days
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...textFieldProps}
              id="experience_type"
              value={formik.values.experience_type}
              label="Experience Type"
              select
              SelectProps={{
                native: false,
                onChange: (e) =>
                  formik.setFieldValue("experience_type", e.target.value),
              }}>
              {[3, 4, 5].map((v) => (
                <MenuItem key={v} value={v}>
                  {v} stars
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...textFieldProps}
              id="avg_flight_cost"
              value={formik.values.avg_flight_cost}
              InputLabelProps={{style: {pointerEvents: "auto"}}}
              label={
                <div className={classes.textfieldTitle}>
                  Average Flight Cost{" "}
                  <Tooltip
                    title={
                      <AppTypography>
                        Flights usually cost more than anticipated. Booking last
                        minute and having international team members will drive
                        average flight prices up, while having numerous
                        teammates in your retreats destination will help bring
                        costs down.
                      </AppTypography>
                    }>
                    <Help />
                  </Tooltip>
                </div>
              }
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <TextField
              {...textFieldProps}
              id="num_attendees"
              value={formik.values.num_attendees}
              label="Attendees"
              type="number"
            />
          </Paper>
          <Paper className={classes.formGroup}>
            <TextField
              {...textFieldProps}
              id="work_play_mix"
              value={formik.values.work_play_mix}
              InputLabelProps={{style: {pointerEvents: "auto"}}}
              label={
                <div className={classes.textfieldTitle}>
                  All work, all play, or a mix?{" "}
                  <Tooltip
                    title={
                      <AppTypography>
                        Most Flok clients will do a mix of work and play. We
                        typically see meetings in the morning and fun activities
                        in the afternoon.
                      </AppTypography>
                    }>
                    <Help />
                  </Tooltip>
                </div>
              }
              select
              SelectProps={{
                native: false,
                onChange: (e) =>
                  formik.setFieldValue("work_play_mix", e.target.value),
              }}>
              {[
                "All work",
                "Mostly work",
                "Mix",
                "Mostly play",
                "All play",
              ].map((v, i) => (
                <MenuItem key={i} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...textFieldProps}
              id="alcohol"
              value={formik.values.alcohol}
              label="Will you provide alcohol?"
              select
              SelectProps={{
                native: false,
                onChange: (e) =>
                  formik.setFieldValue("alcohol", e.target.value),
              }}>
              {["All nights", "Most nights", "Some nights", "No"].map(
                (v, i) => (
                  <MenuItem key={i} value={v}>
                    {v}
                  </MenuItem>
                )
              )}
            </TextField>
            <TextField
              {...textFieldProps}
              id="ground_transportation"
              value={formik.values.ground_transportation}
              label="Select the ground transportation your team will cover"
              select
              SelectProps={{
                native: false,
                multiple: true,
                onChange: (e) =>
                  formik.setFieldValue("ground_transportation", e.target.value),
              }}>
              {[
                "Home to airport",
                "Airport to hotel",
                "Hotel to airport",
                "Airport to home",
              ].map((v, i) => (
                <MenuItem key={i} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...textFieldProps}
              id="addons"
              value={formik.values.addons}
              label="Select add-on services"
              select
              SelectProps={{
                native: false,
                multiple: true,
                onChange: (e) => formik.setFieldValue("addons", e.target.value),
              }}>
              {[
                "COVID test",
                "Swag",
                "Photographer",
                "Onsite Coordinator",
                "Facilitator",
                "Travel insurance",
              ].map((v, i) => (
                <MenuItem key={i} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
          <div className={classes.buttons}>
            <Button type="submit" variant="contained" color="primary">
              Calculate Retreat Cost
            </Button>
            <AppTypography
              underline
              style={{marginLeft: 6, cursor: "pointer"}}
              onClick={() => setOpen(false)}>
              Hide retreat settings
            </AppTypography>
          </div>
        </form>
      </Collapse>
    </>
  )
}
