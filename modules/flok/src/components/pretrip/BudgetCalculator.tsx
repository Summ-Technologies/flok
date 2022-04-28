import {
  Button,
  InputAdornment,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import {
  BudgetBreakdownInputType,
  BUDGET_TOOL_FLOK_RECOMENDATIONS,
} from "../../utils/pretripUtils"

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
}))

export default function BudgetCalculator(props: {
  onSubmit: (budgetBreakdown: BudgetBreakdownInputType) => void
}) {
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
    <form
      className={classes.root}
      onSubmit={formik.handleSubmit}
      style={{width: "100%"}}>
      <Paper elevation={0} className={classes.formGroup}>
        <TextField
          {...textFieldProps}
          id="trip_length"
          value={formik.values.trip_length}
          label="Trip Length"
          select
          SelectProps={{native: false}}>
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
          SelectProps={{native: false}}>
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
          label="Average Flight Cost"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          {...textFieldProps}
          id="num_attendees"
          value={formik.values.num_attendees}
          label="Attendees"
          type="number"
        />
        <TextField
          {...textFieldProps}
          id="work_play_mix"
          value={formik.values.work_play_mix}
          label="All work, all play, or a mix?"
          select
          SelectProps={{native: false}}>
          {["All work", "Mostly work", "Mix", "Mostly play", "All play"].map(
            (v, i) => (
              <MenuItem key={i} value={v}>
                {v}
              </MenuItem>
            )
          )}
        </TextField>
        <TextField
          {...textFieldProps}
          id="alcohol"
          value={formik.values.alcohol}
          label="Will you provide alcohol?"
          select
          SelectProps={{native: false}}>
          {["All nights", "Most nights", "Some nights", "No"].map((v, i) => (
            <MenuItem key={i} value={v}>
              {v}
            </MenuItem>
          ))}
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
        <Button type="submit" variant="contained" color="primary">
          Calculate Retreat Cost
        </Button>
      </Paper>
    </form>
  )
}
