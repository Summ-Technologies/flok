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
import {useState} from "react"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import {
  AdminRetreatAttendeeModel,
  RetreatAttendeeInfoStatusOptions,
} from "../../models"
import {patchRetreatAttendee} from "../../store/actions/admin"
import {theme} from "../../theme"
import {nullifyEmptyString} from "../../utils"
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
  tripLegRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    "& > *": {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
  },
  tripLeg: {
    borderBottomWidth: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.primary.light,
    paddingBottom: theme.spacing(2),
  },
}))

type RetreatAttendeeInfoFormProps = {
  attendee: AdminRetreatAttendeeModel
  retreatId: number
}
export function RetreatAttendeeInfoForm(props: RetreatAttendeeInfoFormProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()

  let formik = useFormik({
    initialValues: {
      email_address: props.attendee.email_address,
      name: props.attendee.name,
      city: props.attendee.city,
      notes: props.attendee.notes,
      dietary_prefs: props.attendee.dietary_prefs,
      info_status: props.attendee.info_status,
      hotel_check_in: props.attendee.hotel_check_in,
      hotel_check_out: props.attendee.hotel_check_out,
    },
    onSubmit: (values) => {
      dispatch(
        patchRetreatAttendee(
          props.retreatId,
          props.attendee.id,
          nullifyEmptyString(values)
        )
      )
    },
    validate: (values) => {
      try {
        yup.string().required().email().validateSync(values.email_address)
      } catch (err) {
        return {email_address: "Please enter a valid email."}
      }
      return {}
    },
    enableReinitialize: true,
  })
  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    InputLabelProps: {shrink: true},
    onChange: formik.handleChange,
  }

  let [newOption, setNewOption] = useState("")
  const DIETARY_OPTIONS = new Set([
    "Gluten Free",
    "Peanut Free",
    "Dairy Free",
    "Vegetarian",
    "Vegan",
    "Kosher",
  ])

  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">Attendee Info</AppTypography>
        <TextField
          {...textFieldProps}
          id="name"
          value={formik.values.name ?? ""}
          label="Name"
        />
        <TextField
          {...textFieldProps}
          id="email_address"
          value={formik.values.email_address}
          error={!!formik.errors.email_address}
          helperText={formik.errors.email_address}
          required
          label="Email"
        />
        <TextField
          {...textFieldProps}
          id="city"
          value={formik.values.city ?? ""}
          label="City"
        />
        <Autocomplete
          multiple
          id="preferences_dates_flexible_months"
          options={Array.from(
            new Set([
              ...Array.from(DIETARY_OPTIONS).map((a) => a.toLocaleLowerCase()),
              ...(formik.values.dietary_prefs
                ? formik.values.dietary_prefs.split(",")
                : []
              ).map((a) => a.toLocaleLowerCase()),
              ...(newOption && newOption.length > 1
                ? [`Add \`${newOption.toLocaleLowerCase()}\``]
                : []),
            ])
          )}
          getOptionLabel={(option) => {
            return option && option[0].toLocaleUpperCase() + option.slice(1)
          }}
          filterSelectedOptions
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          onInputChange={(e, value, reason) => {
            if (reason !== "reset" || e != null) setNewOption(value)
          }}
          inputValue={newOption}
          value={
            formik.values.dietary_prefs
              ?.split(",")
              .filter((a) => !!a)
              .map((a) => a.toLocaleLowerCase()) || []
          }
          onChange={(e, newVals) => {
            newVals = newVals.map((val) => {
              val = val.toLocaleLowerCase()
              if (val.startsWith("add `")) {
                val = val.slice(5, -1)
              }
              return val
            })
            formik.setFieldValue(
              "dietary_prefs",
              Array.from(
                new Set(newVals.sort().map((a) => a.toLocaleLowerCase()))
              ).join(",")
            )
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                {...textFieldProps}
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
                label="Dietary Preferences"
                placeholder="Select a dietary restriction"
              />
            )
          }}
        />
      </Paper>
      <Paper elevation={0} className={classes.formGroup}>
        <AppTypography variant="h4">
          Attendee info{" "}
          <Typography variant="body2" component="span">
            (cont.)
          </Typography>
        </AppTypography>
        <TextField
          {...textFieldProps}
          id="info_status"
          value={formik.values.info_status}
          select
          SelectProps={{native: true}}
          label="Attendee registration form status">
          {RetreatAttendeeInfoStatusOptions.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </TextField>
        <TextField
          {...textFieldProps}
          id="hotel_check_in"
          value={formik.values.hotel_check_in ?? ""}
          type="date"
          label="Hotel Check In"
        />
        <TextField
          {...textFieldProps}
          id="hotel_check_out"
          value={formik.values.hotel_check_out ?? ""}
          type="date"
          label="Hotel Check Out"
        />
        <TextField
          {...textFieldProps}
          id="notes"
          value={formik.values.notes ?? ""}
          label="Other Notes"
          placeholder="Enter other notes on the attendee"
          multiline
          minRows={2}
          maxRows={4}
        />
      </Paper>
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Button
          disabled={_.isEqual(
            nullifyEmptyString(formik.initialValues),
            nullifyEmptyString(formik.values)
          )}
          type="submit"
          variant="contained"
          color="primary"
          style={{marginRight: theme.spacing(1)}}>
          {"Save changes"}
        </Button>
      </Box>
    </form>
  )
}
