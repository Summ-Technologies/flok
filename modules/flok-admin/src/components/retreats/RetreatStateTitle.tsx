import {Button, makeStyles, Typography} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import {
  AdminRetreatModel,
  OrderedRetreatAttendeesState,
  OrderedRetreatFlightsState,
  OrderedRetreatIntakeState,
  OrderedRetreatItineraryState,
  OrderedRetreatLodgingState,
} from "../../models"
import {patchRetreatDetails} from "../../store/actions/admin"
import {RetreatStateSelector, RetreatStateTypes} from "./RetreatStatesForm"

let useStyles = makeStyles((theme) => ({
  pageTitle: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stateForm: {
    display: "flex",
    alignItems: "center",
  },
}))

function RetreatStateTitle(props: {
  retreat: AdminRetreatModel
  type: keyof RetreatStateTypes
}) {
  let {retreat, type} = props
  let classes = useStyles(props)
  let titleObj: {retreatKey: string; title: string} = {
    retreatKey: "",
    title: "",
  }
  let dispatch = useDispatch()
  let defaultSelected

  switch (type) {
    case "intake":
      titleObj.retreatKey = "intake_state"
      titleObj.title = "- Sales Intake"
      defaultSelected = OrderedRetreatIntakeState[0]
      break
    case "lodging":
      titleObj.retreatKey = "lodging_state"
      titleObj.title = "- Lodging"
      defaultSelected = OrderedRetreatLodgingState[0]
      break
    case "attendees":
      titleObj.retreatKey = "attendees_state"
      titleObj.title = "- Attendees"
      defaultSelected = OrderedRetreatAttendeesState[0]
      break
    case "flights":
      titleObj.retreatKey = "flights_state"
      titleObj.title = "- Flights"
      defaultSelected = OrderedRetreatFlightsState[0]
      break
    case "itinerary":
      titleObj.retreatKey = "itinerary_state"
      titleObj.title = "- Itinerary"
      defaultSelected = OrderedRetreatItineraryState[0]
      break
  }
  let typedRetreatKey = titleObj.retreatKey as keyof Partial<
    Pick<
      AdminRetreatModel,
      | "intake_state"
      | "lodging_state"
      | "attendees_state"
      | "flights_state"
      | "itinerary_state"
    >
  >
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      [titleObj.retreatKey]: retreat[typedRetreatKey],
    },
    onSubmit: (values) => {
      dispatch(patchRetreatDetails(retreat.id, values))
    },
  })

  let typedValues = formik.values as Partial<
    Pick<
      AdminRetreatModel,
      | "intake_state"
      | "lodging_state"
      | "attendees_state"
      | "flights_state"
      | "itinerary_state"
    >
  >

  return (
    <div
      className={classes.pageTitle}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}>
      <Typography variant="h1">
        {retreat.company_name} {titleObj.title}
      </Typography>
      {retreat ? (
        <form onSubmit={formik.handleSubmit} className={classes.stateForm}>
          <RetreatStateSelector
            onChange={formik.handleChange}
            id={titleObj.retreatKey}
            stateType={type}
            value={typedValues[typedRetreatKey] ?? defaultSelected}
            size="small"
            color="primary"
            label={
              type[0].toUpperCase() + type.substring(1, type.length) + " state"
            }
            style={{backgroundColor: "white", borderRadius: "10px"}}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={_.isEqual(formik.initialValues, formik.values)}
            color="primary"
            style={{marginLeft: "10px"}}>
            {" "}
            Save
          </Button>
        </form>
      ) : undefined}
    </div>
  )
}
export default RetreatStateTitle
