import {makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import DestinationsGrid from "../components/lodging/DestinationsGrid"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {DestinationModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatDestination,
  postAdvanceRetreatState,
  postSelectedRetreatDestination,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {useDestinations, useRetreat} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  headerContainer: {paddingBottom: theme.spacing(4)},
}))

type DestinationsListPageProps = RouteComponentProps<{retreatGuid: string}>
function DestinationsListPage(props: DestinationsListPageProps) {
  // Setup
  let classes = useStyles(props)
  let dispatch = useDispatch()

  // Query/path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  // API data
  let retreat = useRetreat(retreatGuid)
  let destinationsList = Object.values(useDestinations()[0])

  // Selected destinations
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_destinations_ids
    }
    return []
  })
  function isDestinationSelected(destination: DestinationModel) {
    return selectedDestinationIds.includes(destination.id)
  }

  // action handlers
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
  function toggleSelect(destination: DestinationModel) {
    if (isDestinationSelected(destination)) {
      dispatch(deleteSelectedRetreatDestination(retreatGuid, destination.id))
    } else {
      dispatch(postSelectedRetreatDestination(retreatGuid, destination.id))
    }
  }
  function onClickNextSteps() {
    if (retreat && retreat !== ResourceNotFound) {
      dispatch(postAdvanceRetreatState(retreatGuid, retreat.state))
    }
    dispatch(
      push(
        AppRoutes.getPath("HotelsListPage", {
          retreatGuid: props.match.params.retreatGuid,
        })
      )
    )
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {!destinationsList ? (
        <>Loading...</>
      ) : (
        <PageContainer backgroundImage="https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg">
          <PageOverlay
            OverlayFooterProps={{
              cta: "Next Step",
              onClick: onClickNextSteps,
              rightText: `${selectedDestinationIds.length} destinations selected`,
            }}>
            <div className={classes.headerContainer}>
              <PageHeader
                preHeader={
                  <AppLodgingFlowTimeline currentStep="DESTINATION_SELECT" />
                }
                header="Location"
                subheader="Finding the right destination is the first step to a planning a great retreat!"
              />
            </div>
            <DestinationsGrid
              destinations={destinationsList}
              onExplore={explore}
              onSelect={toggleSelect}
              isSelected={isDestinationSelected}
            />
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(DestinationsListPage)
