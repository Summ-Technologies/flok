import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router"
import RetreatRequired from "../components/lodging/RetreatRequired"
import {ResourceNotFound} from "../models"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"

type RetreatRoutingPageProps = RouteComponentProps<{retreatIdx: string}>

function RetreatRoutingPage(props: RetreatRoutingPageProps) {
  let dispatch = useDispatch()
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatIdx]
  )
  let [showError, setShowError] = useState(false)
  useEffect(() => {
    if (retreat && retreat !== ResourceNotFound) {
      switch (retreat.state) {
        case "INTAKE_1":
          dispatch(push(AppRoutes.getPath("NewRetreatFormPage")))
          break
        case "INTAKE_2":
          dispatch(
            push(
              AppRoutes.getPath("RetreatPreferencesFormPage", {
                retreatIdx: retreatIdx.toString(),
              })
            )
          )
          break
        case "FILTER_SELECT":
          dispatch(
            push(
              AppRoutes.getPath("RetreatFiltersPage", {
                retreatIdx: retreatIdx.toString(),
              })
            )
          )
          break
        case "DESTINATION_SELECT":
          dispatch(
            push(
              AppRoutes.getPath("DestinationsListPage", {
                retreatIdx: retreatIdx.toString(),
              })
            )
          )
          break
        case "HOTEL_SELECT":
          dispatch(
            push(
              AppRoutes.getPath("HotelsListPage", {
                retreatIdx: retreatIdx.toString(),
              })
            )
          )
          break
        case "PROPOSAL":
        case "PROPOSAL_READY":
          dispatch(
            push(
              AppRoutes.getPath("ProposalsListPage", {
                retreatIdx: retreatIdx.toString(),
              })
            )
          )
          break
        default:
          setShowError(true)
      }
    }
  }, [retreat, setShowError, dispatch])
  return (
    <RetreatRequired retreatIdx={retreatIdx}>
      {showError && <div>Oops, something went wrong</div>}
    </RetreatRequired>
  )
}

export default withRouter(RetreatRoutingPage)
