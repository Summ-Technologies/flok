import {Button, Grid, Hidden} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {RetreatFilter} from "../components/base/AppFilters"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import {
  AppDestinationListItem,
  AppLodgingList,
} from "../components/lodging/LodgingLists"
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
import {
  useDestinations,
  useRetreat,
  useRetreatFilters,
} from "../utils/lodgingUtils"

type DestinationsListPageProps = RouteComponentProps<{retreatGuid: string}>
function DestinationsListPage(props: DestinationsListPageProps) {
  let dispatch = useDispatch()

  // Query/path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  // API data
  let retreat = useRetreat(retreatGuid)
  let destinationsList = Object.values(useDestinations()[0])

  // Filters
  let [filterQuestions, filterResponses] = useRetreatFilters(retreatGuid)
  let [selectedResponsesIds, setSelectedResponsesIds] = useState<string[]>([])
  useEffect(() => {
    setSelectedResponsesIds(
      filterResponses
        ? filterResponses.map((resp) => resp.answer_id.toString())
        : []
    )
  }, [filterResponses, setSelectedResponsesIds])

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
            }>
            <PageHeader
              preHeader={
                <AppLodgingFlowTimeline currentStep="DESTINATION_SELECT" />
              }
              header="Location"
              subheader="Finding the right destination is the first step to a planning a great retreat!"
              retreat={retreat !== ResourceNotFound ? retreat : undefined}
            />
            <Grid container>
              <Grid item xs={4}>
                <Hidden smDown>
                  {(
                    filterQuestions?.filter(
                      (ques) => ques.question_affinity === "LODGING"
                    ) ?? []
                  ).map((question) => (
                    <RetreatFilter
                      filterQuestion={question}
                      selectedResponsesIds={selectedResponsesIds}
                      onSelect={() => undefined}
                    />
                  ))}
                </Hidden>
              </Grid>
              <Grid item xs={12} md={8}>
                <AppLodgingList>
                  {destinationsList.map((dest) => (
                    <AppDestinationListItem
                      img={dest.spotlight_img.image_url}
                      name={dest.location}
                      subheader={`${dest.state}, ${dest.country_abbreviation} 🇺🇸`}
                      onSelect={() => toggleSelect(dest)}
                      tags={["tag 1", "tag 2"]}
                    />
                  ))}
                </AppLodgingList>
              </Grid>
            </Grid>
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(DestinationsListPage)
