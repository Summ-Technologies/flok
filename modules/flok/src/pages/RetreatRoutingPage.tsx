import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router"
import RetreatRequired from "../components/lodging/RetreatRequired"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {convertGuid} from "../utils"

type RetreatRoutingPageProps = RouteComponentProps<{retreatGuid: string}>

function RetreatRoutingPage(props: RetreatRoutingPageProps) {
  let dispatch = useDispatch()
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatGuid]
  )
  let [showError, setShowError] = useState(false)
  useEffect(() => {
    if (retreat && retreat !== "NOT_FOUND") {
      switch (retreat.state) {
        case "INTAKE_1":
          dispatch(push(AppRoutes.getPath("NewRetreatFormPage")))
          break
        case "INTAKE_2":
          dispatch(
            push(
              AppRoutes.getPath("RetreatPreferencesFormPage", {
                retreatGuid: retreat.guid,
              })
            )
          )
          break
        case "DESTINATION_SELECT":
          dispatch(
            push(
              AppRoutes.getPath("ChooseDestinationPage", {
                retreatGuid: retreat.guid,
              })
            )
          )
          break
        case "HOTEL_SELECT":
          dispatch(
            push(
              AppRoutes.getPath("ChooseHotelPage", {retreatGuid: retreat.guid})
            )
          )
          break
        case "PROPOSAL":
        default:
          setShowError(true)
      }
    }
  }, [retreat, setShowError, dispatch])
  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {showError && <div>Oops, something went wrong</div>}
    </RetreatRequired>
  )
}

export default withRouter(RetreatRoutingPage)
