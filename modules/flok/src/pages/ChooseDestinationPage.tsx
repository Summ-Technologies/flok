import {Box} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import DestinationsGrid from "../components/lodging/DestinationsGrid"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {DestinationModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatDestination,
  postAdvanceRetreatState,
  postSelectedRetreatDestination,
} from "../store/actions/retreat"
import {convertGuid, useDestinations} from "../utils"

type ChooseDestinationPageProps = RouteComponentProps<{retreatGuid: string}>
function ChooseDestinationPage(props: ChooseDestinationPageProps) {
  let dispatch = useDispatch()
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatGuid]
  )
  let destinations = Object.values(useDestinations())

  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== "NOT_FOUND") {
      return retreat.selected_destinations_ids
    }
    return []
  })

  // Actions
  function explore(destination: DestinationModel) {
    dispatch(
      push(
        AppRoutes.getPath("DestinationPage", {
          retreatGuid: retreatGuid,
          destinationGuid: destination.guid,
        })
      )
    )
  }
  function isSelected(destination: DestinationModel) {
    return selectedDestinationIds.includes(destination.id)
  }
  function toggleSelect(destination: DestinationModel) {
    if (isSelected(destination)) {
      dispatch(deleteSelectedRetreatDestination(retreatGuid, destination.id))
    } else {
      dispatch(postSelectedRetreatDestination(retreatGuid, destination.id))
    }
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {!destinations ? (
        <>Loading...</>
      ) : (
        <PageContainer backgroundImage="https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg">
          <PageOverlay
            OverlayFooterProps={{
              cta: "Next Step",
              onClick: () => {
                if (retreat && retreat !== "NOT_FOUND") {
                  dispatch(postAdvanceRetreatState(retreatGuid, retreat.state))
                }
                dispatch(
                  push(
                    AppRoutes.getPath("ChooseHotelPage", {
                      retreatGuid: props.match.params.retreatGuid,
                    })
                  )
                )
              },
              rightText: `${selectedDestinationIds.length} destinations selected`,
            }}>
            <Box paddingBottom={4}>
              <PageHeader
                preHeader={
                  <AppLodgingFlowTimeline currentStep="DESTINATION_SELECT" />
                }
                header="Location"
                subheader="Finding the right destination is the first step to a planning a great retreat!"
              />
            </Box>
            <DestinationsGrid
              destinations={destinations}
              onExplore={explore}
              onSelect={toggleSelect}
              isSelected={isSelected}
            />
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(ChooseDestinationPage)
