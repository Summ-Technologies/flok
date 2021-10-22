import {Button} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import DestinationsGrid from "../components/lodging/DestinationsGrid"
import {RetreatPreferencesSidebar} from "../components/lodging/RetreatPreferences"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
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

type DestinationsListPageProps = RouteComponentProps<{retreatGuid: string}>
function DestinationsListPage(props: DestinationsListPageProps) {
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

  let retreatPreferencesFilter = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.retreat_preferences
    }
  })

  let [sortedDestinationsList, setSortedDestinationsList] =
    useState(destinationsList)
  let [lastConvenientFilter, setLastConvenientFilter] = useState(0)

  useEffect(() => {
    const CONVENIENT_DESTINATIONS = [1, 4, 7, 9, 24, 23, 19, 15, 12, 11, 6]
    const EXOTIC_DESTINATIONS = [10, 29, 28, 26, 25, 22, 20, 17, 14, 8, 6, 5]
    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(array: any[]) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }

    let sorted = destinationsList
    if (retreatPreferencesFilter) {
      if (retreatPreferencesFilter.convenient_filter === -1) {
        sorted = destinationsList.filter((val) =>
          CONVENIENT_DESTINATIONS.includes(val.id)
        )
      } else if (retreatPreferencesFilter.convenient_filter === 1) {
        sorted = destinationsList.filter((val) =>
          EXOTIC_DESTINATIONS.includes(val.id)
        )
      }
      if (lastConvenientFilter === retreatPreferencesFilter.convenient_filter) {
        shuffleArray(sorted)
      }
      setLastConvenientFilter(retreatPreferencesFilter.convenient_filter)
    }
    setSortedDestinationsList(sorted)
  }, [
    retreatPreferencesFilter,
    destinationsList.length,
    setLastConvenientFilter,
  ])

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {!destinationsList ? (
        <>Loading...</>
      ) : (
        <PageContainer>
          <PageOverlay
            footerBody={
              <PageOverlayFooterDefaultBody
                rightText={`${selectedDestinationIds.length} destinations selected`}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickNextSteps}>
                  Next step
                </Button>
              </PageOverlayFooterDefaultBody>
            }
            right={<RetreatPreferencesSidebar retreatGuid={retreatGuid} />}>
            <PageHeader
              preHeader={
                <AppLodgingFlowTimeline currentStep="DESTINATION_SELECT" />
              }
              header="Location"
              subheader="Finding the right destination is the first step to a planning a great retreat!"
            />
            <DestinationsGrid
              destinations={sortedDestinationsList}
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
