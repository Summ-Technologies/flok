import {
  Button,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import React from "react"
import {useDispatch} from "react-redux"
import {
  AdminRetreatModel,
  OrderedRetreatAttendeesState,
  OrderedRetreatFlightsState,
  OrderedRetreatIntakeState,
  OrderedRetreatItineraryState,
  OrderedRetreatLodgingState,
  RetreatAttendeesState,
  RetreatFlightsState,
  RetreatIntakeState,
  RetreatItineraryState,
  RetreatLodgingState,
} from "../../models"

let useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    display: "flex",
    flexWrap: "wrap",
    marginTop: -theme.spacing(1),
    marginLeft: -theme.spacing(1),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  header: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  footer: {
    paddingTop: theme.spacing(1),
  },
  col: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    width: `calc(100% - ${theme.spacing(2)}px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(50% - ${theme.spacing(2)}px)`,
    },
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
}))

type RetreatStatesFormProps = {
  retreat: AdminRetreatModel
}
export default function RetreatStatesForm(props: RetreatStatesFormProps) {
  let classes = useStyles(props)

  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      intake_state: props.retreat.intake_state,
      lodging_state: props.retreat.lodging_state,
      attendees_state: props.retreat.attendees_state,
      flights_state: props.retreat.flights_state,
      itinerary_state: props.retreat.itinerary_state,
    },
    onSubmit: (values) => {
      dispatch(patchRetreatDetails(props.retreat.id, values))
    },
  })

  const textFieldProps: TextFieldProps = {
    fullWidth: true,
    onChange: formik.handleChange,
  }
  return (
    <form className={classes.root} onSubmit={formik.handleSubmit}>
      <Typography className={classes.header} variant="h4">
        Retreat state
      </Typography>
      <div className={classes.col}>
        <RetreatStateSelector
          stateType="intake"
          {...textFieldProps}
          id="intake_state"
          label="Intake state"
          value={formik.values.intake_state}
        />
        <RetreatStateSelector
          stateType="lodging"
          {...textFieldProps}
          id="lodging_state"
          label="Lodging state"
          value={formik.values.lodging_state}
        />
        <RetreatStateSelector
          stateType="attendees"
          {...textFieldProps}
          id="attendees_state"
          label="Attendees state"
          value={formik.values.attendees_state}
        />
      </div>
      <div className={classes.col}>
        <RetreatStateSelector
          stateType="flights"
          {...textFieldProps}
          id="flights_state"
          label="Flights state"
          value={formik.values.flights_state}
        />
        <RetreatStateSelector
          stateType="itinerary"
          {...textFieldProps}
          id="itinerary_state"
          label="Itinerary state"
          value={formik.values.itinerary_state}
        />
      </div>
      <div className={classes.footer}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={_.isEqual(formik.initialValues, formik.values)}>
          Save State
        </Button>
      </div>
    </form>
  )
}

export type RetreatStateTypes = {
  intake: RetreatIntakeState
  lodging: RetreatLodgingState
  attendees: RetreatAttendeesState
  flights: RetreatFlightsState
  itinerary: RetreatItineraryState
}
const RetreatStateTypesOptions: {
  intake: typeof OrderedRetreatIntakeState
  lodging: typeof OrderedRetreatLodgingState
  attendees: typeof OrderedRetreatAttendeesState
  flights: typeof OrderedRetreatFlightsState
  itinerary: typeof OrderedRetreatItineraryState
} = {
  intake: OrderedRetreatIntakeState,
  lodging: OrderedRetreatLodgingState,
  attendees: OrderedRetreatAttendeesState,
  flights: OrderedRetreatFlightsState,
  itinerary: OrderedRetreatItineraryState,
}

export type RetreatStateSelectorProps<T extends keyof RetreatStateTypes> =
  TextFieldProps & {
    stateType: T
    value: RetreatStateTypes[T]
  }
export function RetreatStateSelector<T extends keyof RetreatStateTypes>(
  props: RetreatStateSelectorProps<T>
) {
  let {stateType, ...otherProps} = {...props}

  // Set default select and input label props
  otherProps = {
    ...otherProps,
    select: true,
    SelectProps: {
      ...{native: true},
      ...(otherProps.SelectProps ? otherProps.SelectProps : {}),
    },
    InputLabelProps: {
      ...{shrink: true},
      ...(otherProps.InputLabelProps ? otherProps.InputLabelProps : {}),
    },
  }
  let options = RetreatStateTypesOptions[props.stateType]
  return (
    <TextField {...otherProps}>
      {options.map((val: string) => (
        <option value={val} key={val}>
          {val}
        </option>
      ))}
    </TextField>
  )
}
