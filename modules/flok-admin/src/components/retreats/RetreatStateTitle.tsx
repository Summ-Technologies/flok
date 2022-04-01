import { Button, Typography } from "@material-ui/core"
import { ClassNameMap } from "@material-ui/core/styles/withStyles"
import { useFormik } from "formik"
import _ from "lodash"
import { useDispatch } from "react-redux"
import { AdminRetreatModel} from "../../models"
import { patchRetreatDetails } from "../../store/actions/admin"
import { RetreatStateSelector, RetreatStateSelectorProps, RetreatStateTypes } from "./RetreatStatesForm"


function RetreatStateTitle(props: {retreat: AdminRetreatModel | any , type: keyof RetreatStateTypes, classes: ClassNameMap}){
    let {retreat, type, classes} = props
    let titleObj: {retreatKey: string, title: string} = {retreatKey: "", title: ""}
    let dispatch = useDispatch()

    switch (type) {
        case "intake":
            titleObj.retreatKey = "intake_state"
            titleObj.title= "- Sales Intake"
            break;
        case "lodging":
          titleObj.retreatKey = "lodging_state"
          titleObj.title= "- Lodging"
          break;
        case "attendees":
          titleObj.retreatKey = "attendees_state"
          titleObj.title= "- Attendees"
           break;
        case "flights":
            titleObj.retreatKey = "flights_state"
            titleObj.title= "- Flights"
            break;
         case "itinerary":
              titleObj.retreatKey = "itinerary_state"
              titleObj.title= "- Itinerary"
            break;
          
    
        default:
            break;
    }
    let typedRetreatKey = titleObj.retreatKey as keyof AdminRetreatModel
    let formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        [titleObj.retreatKey]: retreat ? retreat[typedRetreatKey] : undefined
      },
      onSubmit: (values) => {
        console.log(values)
        // dispatch(patchRetreatDetails(retreat.id, values))
      },
    })
     
      let typedValues = formik.values as Partial< Pick < AdminRetreatModel , "intake_state" | "lodging_state" | "attendees_state" | "flights_state" | "itinerary_state" > >
      let notStarted =  "NOT_STARTED" as unknown as keyof RetreatStateTypes
    


return (
    <div className={classes.pageTitle} style={{  display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:"10px"
   }}>
          <Typography variant="h1">
            {retreat?.company_name} {titleObj.title}
          </Typography>
          {retreat ? (
            <form onSubmit={formik.handleSubmit}>
              <RetreatStateSelector
                onChange={formik.handleChange}
                id={titleObj.retreatKey}
                stateType={type}
                // value={typedValues[typedRetreatKey] || notStarted}
                value={formik.values[titleObj.retreatKey] }
                size="small"
                color="primary"
                label={type[0].toUpperCase() + type.substring(1,type.length)+ " state"}
                style={{backgroundColor: 'white', borderRadius: '10px' }}
              />
  <Button variant='outlined' type="submit" disabled={_.isEqual(formik.initialValues, formik.values)} color="primary" style={{height: '40px', marginLeft: '10px'}} > Save</Button>
          </form>
          ) : undefined}
        </div>
)
}
export default RetreatStateTitle