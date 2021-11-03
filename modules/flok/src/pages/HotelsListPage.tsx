import {Button, Grid, Hidden, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import {FiltersSection} from "../components/lodging/LodgingFilters"
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
import {BudgetType, BudgetTypeVals, HotelModel} from "../models/lodging"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatHotel,
  postAdvanceRetreatState,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid, useQueryAsList} from "../utils"
import {
  DestinationUtils,
  useDestinations,
  useHotels,
  useRetreat,
  useRetreatFilters,
} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  ctaSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& > :not(:first-child)": {
      marginLeft: theme.spacing(1),
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
  let [locationFilterParam, setLocationFilterParam] =
    useQueryAsList("locations")
  let [priceFilterParam, setPriceFilterParam] = useQueryAsList("price")

  let retreat = useRetreat(retreatGuid)
  let destinations = Object.values(useDestinations()[0])

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

  // Local filter state
  let [destinationFilter, setDestinationFilter] = useState<number[]>([])
  let [budgetFilter, setBudgetFilter] = useState<BudgetType[]>([])

  // Filters active state
  let [locationFilterOpen, setLocationFilterOpen] = useState(false)
  let [priceFilterOpen, setPriceFilterOpen] = useState(false)

  // Update local state to match query params
  useEffect(() => {
    setDestinationFilter(
      locationFilterParam
        .map((strVal) => parseInt(strVal))
        .filter((intVal) => !isNaN(intVal))
    )
  }, [locationFilterParam])
  useEffect(() => {
    setBudgetFilter(
      priceFilterParam.filter((val) =>
        BudgetTypeVals.includes(val)
      ) as BudgetType[]
    )
  }, [priceFilterParam])

  // On page load filters logic
  let [initLocationFilter, setInitLocationFilter] = useState(false)
  useEffect(() => {
    if (!initLocationFilter && retreat) {
      if (locationFilterParam.length === 0) {
        setLocationFilterParam(selectedDestinationIds.map((x) => x.toString()))
      }
      setInitLocationFilter(true)
    }
  }, [
    retreat,
    selectedDestinationIds,
    setInitLocationFilter,
    initLocationFilter,
    setLocationFilterParam,
    locationFilterParam,
  ])

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

  // Hotels search state (algolia backed)
  const [hotels, numHotels, loading, hasMore, getMore] = useHotels(
    destinationFilter,
    budgetFilter
  )

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
  function onReachEnd() {
    if (hasMore) {
      getMore()
    }
  }

  function onClickNextStep() {
    if (retreat && retreat !== ResourceNotFound) {
      if (selectedHotelIds.length >= Constants.minHotelsSelected) {
        dispatch(postAdvanceRetreatState(retreatGuid, retreat.state))
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
          />
          <Grid container>
            <Grid item xs={4}>
              <Hidden smDown>
                <FiltersSection
                  type={"HOTEL"}
                  questions={
                    filterQuestions?.filter(
                      (ques) => ques.question_affinity === "LOCATION"
                    ) ?? []
                  }
                  selectedResponsesIds={selectedResponsesIds}
                  onSelect={() => undefined}
                />
              </Hidden>
            </Grid>
            <Grid item xs={12} md={8}>
              <AppLodgingList onReachEnd={onReachEnd}>
                {hotels.map((hotel) => (
                  <AppHotelListItem
                    name={hotel.name}
                    airportDistance={100}
                    budget={hotel.price}
                    img={hotel.spotlight_img.image_url}
                    onSelect={() => toggleSelect(hotel)}
                    numRooms={hotel.num_rooms}
                    subheader={
                      destinations[hotel.destination_id]
                        ? DestinationUtils.getLocationName(
                            destinations[hotel.destination_id]
                          )
                        : ""
                    }
                    tags={["this", "is", "a", "tag"]}
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
