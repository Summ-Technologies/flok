import {Button, Grid, Hidden, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import PopperFilter, {
  HotelGridLocationFilterBody,
  RetreatFilter,
} from "../components/lodging/LodgingFilters"
import {
  AppHotelListItem,
  AppLodgingList,
} from "../components/lodging/LodgingLists"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {Constants} from "../config"
import {ResourceNotFound} from "../models"
import {HotelModel} from "../models/lodging"
import {FilterAnswerModel} from "../models/retreat"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getHotels} from "../store/actions/lodging"
import {
  deleteSelectedRetreatDestination,
  deleteSelectedRetreatHotel,
  postAdvanceRetreatState,
  postSelectedRetreatDestination,
  postSelectedRetreatHotel,
  putRetreatFilters,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {
  DestinationUtils,
  useDestinations,
  useHotels,
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
  ctaSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
  filterSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(2),
    },
  },
}))

type HotelsListPageProps = RouteComponentProps<{retreatGuid: string}>
function HotelsListPage(props: HotelsListPageProps) {
  // Setup
  let dispatch = useDispatch()
  let classes = useStyles(props)

  // Path and query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  let retreat = useRetreat(retreatGuid)
  let destinations = Object.values(useDestinations()[0])
  let allLoadedHotels = useSelector((state: RootState) => state.lodging.hotels)

  // selected hotels/destinations
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_destinations_ids
    }
    return []
  })
  let selectedHotelIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_hotels_ids
    }
    return []
  })
  function isHotelSelected(hotel: HotelModel) {
    return selectedHotelIds.includes(hotel.id)
  }

  // Filters
  let [locationFilterOpen, setLocationFilterOpen] = useState(false)

  let [filterQuestions, filterResponses] = useRetreatFilters(retreatGuid)
  let [selectedResponsesIds, setSelectedResponsesIds] = useState<string[]>([])
  useEffect(() => {
    setSelectedResponsesIds(
      filterResponses
        ? filterResponses.map((resp) => resp.answer_id.toString())
        : []
    )
  }, [filterResponses, setSelectedResponsesIds])

  // Hotels search state (algolia backed)
  const [hotels, numHotels, loading, hasMore, getMore] = useHotels(
    selectedResponsesIds.map((id) => parseInt(id)),
    filterQuestions
      ? filterQuestions
          .filter((ques) => ques.question_affinity === "LODGING")
          .reduce((prev, resp) => {
            return [...prev, ...resp.answers]
          }, [] as FilterAnswerModel[])
      : [],
    selectedDestinationIds
  )

  useEffect(() => {
    let missingHotelIds = selectedHotelIds.filter((id) => !allLoadedHotels[id])
    if (missingHotelIds.length) {
      let filter = missingHotelIds.map((id) => `id=${id}`).join(" OR ")
      dispatch(getHotels(filter))
    }
  }, [selectedHotelIds, allLoadedHotels, dispatch])

  // Actions
  function explore(hotel: HotelModel) {
    const newTab = window.open(
      AppRoutes.getPath("HotelPage", {
        retreatGuid: props.match.params.retreatGuid,
        hotelGuid: hotel.guid,
      }),
      "_blank"
    )
    newTab?.focus()
  }
  function toggleSelect(hotel: HotelModel) {
    if (isHotelSelected(hotel)) {
      dispatch(deleteSelectedRetreatHotel(retreatGuid, hotel.id))
    } else {
      if (selectedHotelIds.length < Constants.maxHotelsSelected) {
        dispatch(postSelectedRetreatHotel(retreatGuid, hotel.id))
      } else {
        dispatch(
          enqueueSnackbar({
            key: "tooManyHotelsSelected",
            message: `Can't select more than ${Constants.maxHotelsSelected} hotels`,
            options: {
              autoHideDuration: 2000,
              variant: "error",
            },
          })
        )
      }
    }
  }

  function toggleDestinationSelect(destinationId: number) {
    if (selectedDestinationIds.includes(destinationId)) {
      dispatch(deleteSelectedRetreatDestination(retreatGuid, destinationId))
    } else {
      dispatch(postSelectedRetreatDestination(retreatGuid, destinationId))
    }
  }

  function onReachEnd() {
    if (hasMore) {
      getMore()
    }
  }

  function onClickNextStep() {
    if (retreat && retreat !== ResourceNotFound) {
      if (selectedHotelIds.length >= Constants.minHotelsSelected) {
        if (retreat.state === "HOTEL_SELECT") {
          dispatch(postAdvanceRetreatState(retreatGuid, retreat.state))
        }
        dispatch(
          push(
            AppRoutes.getPath("HotelProposalWaitingPage", {
              retreatGuid: props.match.params.retreatGuid,
            })
          )
        )
      } else {
        dispatch(
          enqueueSnackbar(
            apiNotification(
              `Please select at least ${Constants.minHotelsSelected} hotels to advance`,
              (key) => dispatch(closeSnackbar(key)),
              true
            )
          )
        )
      }
    }
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
      <PageContainer>
        <PageOverlay
          footerBody={
            <PageOverlayFooterDefaultBody
              rightText={`${Math.max(
                Constants.maxHotelsSelected - selectedHotelIds.length,
                0
              )} hotels remaining`}>
              <div className={classes.ctaSection}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickNextStep}>
                  Next step
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    dispatch(
                      push(
                        AppRoutes.getPath("DestinationsListPage", {retreatGuid})
                      )
                    )
                  }}>
                  Back
                </Button>
              </div>
            </PageOverlayFooterDefaultBody>
          }>
          <PageHeader
            header={`Lodging (${numHotels})`}
            subheader="Select some hotels to request a free proposal from!"
            preHeader={<AppLodgingFlowTimeline currentStep="HOTEL_SELECT" />}
            retreat={
              retreat && retreat !== ResourceNotFound ? retreat : undefined
            }
          />
          <Grid container className={classes.bodyContainer}>
            <Grid item xs={4}>
              <Hidden smDown>
                <div className={classes.filterSection}>
                  <PopperFilter
                    open={locationFilterOpen}
                    toggleOpen={() =>
                      setLocationFilterOpen(!locationFilterOpen)
                    }
                    title={"Destinations"}
                    popper={
                      <HotelGridLocationFilterBody
                        locations={destinations}
                        onClose={() => setLocationFilterOpen(false)}
                        selected={selectedDestinationIds}
                        toggleSelect={toggleDestinationSelect}
                      />
                    }
                    filter={`${selectedDestinationIds.length} selected`}
                  />
                  {(
                    filterQuestions?.filter(
                      (ques) => ques.question_affinity === "LODGING"
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
              <AppLodgingList onReachEnd={onReachEnd}>
                {[
                  ...selectedHotelIds
                    .map((hotId) => allLoadedHotels[hotId])
                    .filter((hotel) => hotel),
                  ...hotels.filter((hotel) => !isHotelSelected(hotel)),
                ].map((hotel) => (
                  <AppHotelListItem
                    name={hotel.name}
                    airportDistance={hotel.airport_travel_time}
                    budget={hotel.price}
                    img={hotel.spotlight_img.image_url}
                    numRooms={hotel.num_rooms}
                    subheader={
                      destinations.filter(
                        (dest) => dest.id === hotel.destination_id
                      )[0]
                        ? DestinationUtils.getLocationName(
                            destinations.filter(
                              (dest) => dest.id === hotel.destination_id
                            )[0],
                            true
                          )
                        : ""
                    }
                    tags={
                      hotel.lodging_tags
                        ? hotel.lodging_tags.map((tag) => tag.name)
                        : []
                    }
                    onSelect={() => toggleSelect(hotel)}
                    onExplore={() => explore(hotel)}
                    selected={isHotelSelected(hotel)}
                    recommended={hotel.is_flok_recommended}
                  />
                ))}
              </AppLodgingList>
            </Grid>
          </Grid>
          {loading && <>Loading</>}
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(HotelsListPage)
