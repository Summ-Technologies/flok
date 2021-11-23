import {Button, Grid, Hidden, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import {RetreatFilter} from "../components/lodging/LodgingFilters"
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
import {FilterAnswerModel} from "../models/retreat"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatDestination,
  postAdvanceRetreatState,
  postSelectedRetreatDestination,
  putRetreatFilters,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {
  DestinationUtils,
  useDestinations,
  useFilteredDestinations,
  useRetreat,
  useRetreatFilters,
} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  bodyContainer: {
    height: "100%",
    overflow: "hidden",
  },
  listContainer: {
    overflowY: "auto",
    height: "100%",
  },
  filterSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
    marginBottom: theme.spacing(3),
  },
  filterSectionMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
    marginBottom: theme.spacing(3),
  },
}))

type DestinationsListPageProps = RouteComponentProps<{retreatGuid: string}>
function DestinationsListPage(props: DestinationsListPageProps) {
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Query/path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

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

  let retreat = useRetreat(retreatGuid)

  let [destinations] = useDestinations()

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

  let destinationsList = useFilteredDestinations(
    selectedResponsesIds.map((id) => parseInt(id)),
    filterQuestions
      ? filterQuestions
          .filter((ques) => ques.question_affinity === "LOCATION")
          .reduce((prev, resp) => {
            return [...prev, ...resp.answers]
          }, [] as FilterAnswerModel[])
      : []
  )

  // action handlers
  function toggleSelect(destination: DestinationModel) {
    if (isDestinationSelected(destination)) {
      dispatch(deleteSelectedRetreatDestination(retreatGuid, destination.id))
    } else {
      dispatch(postSelectedRetreatDestination(retreatGuid, destination.id))
    }
  }
  function onClickNextSteps() {
    if (
      retreat &&
      retreat !== ResourceNotFound &&
      retreat.state === "DESTINATION_SELECT"
    ) {
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

  function onUpdateFilters(values: string[]) {
    dispatch(
      putRetreatFilters(
        retreatGuid,
        values.map((val) => parseInt(val))
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
            <Grid container className={classes.bodyContainer}>
              <Grid item xs={4}>
                <Hidden smDown>
                  <div className={classes.filterSection}>
                    {(
                      filterQuestions?.filter(
                        (ques) => ques.question_affinity === "LOCATION"
                      ) ?? []
                    ).map((question) => (
                      <RetreatFilter
                        filterQuestion={question}
                        selectedResponsesIds={selectedResponsesIds}
                        onSelect={onUpdateFilters}
                      />
                    ))}
                  </div>
                </Hidden>
              </Grid>
              <Grid item xs={12} md={8} className={classes.listContainer}>
                <AppLodgingList>
                  {[
                    ...selectedDestinationIds
                      .map((id) => destinations[id])
                      .filter((dest) => dest),
                    ...destinationsList.filter(
                      (dest) => !isDestinationSelected(dest)
                    ),
                  ].map((dest) => {
                    return (
                      <AppDestinationListItem
                        key={dest.id}
                        img={dest.spotlight_img.image_url}
                        name={dest.location}
                        subheader={DestinationUtils.getLocationNameShort(
                          dest,
                          true
                        )}
                        onSelect={() => toggleSelect(dest)}
                        tags={dest.lodging_tags.map((tag) => tag.name)}
                        selected={isDestinationSelected(dest)}
                      />
                    )
                  })}
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
