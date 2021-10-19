import {Button, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {AppSliderInput} from "../components/base/AppSliderInputs"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import HotelGrid, {
  HotelGridFilters,
  HotelGridLocationFilterBody,
} from "../components/lodging/HotelGrid"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {Constants} from "../config"
import {ResourceNotFound} from "../models"
import {HotelModel} from "../models/lodging"
import {closeSnackbar, enqueueSnackbar} from "../notistack-lib/actions"
import {apiNotification} from "../notistack-lib/utils"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatHotel,
  postAdvanceRetreatState,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid, useQuery, useQueryAsList} from "../utils"
import {useDestinations, useHotels, useRetreat} from "../utils/lodgingUtils"

let useStyles = makeStyles((theme) => ({
  filterBody: {
    border: "solid thin grey",
    borderColor: "rgba(0, 0, 0, 0.23)",
    borderRadius: 20,
    minWidth: 200,
    display: "flex",
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    flexDirection: "column",
  },
  bigFilters: {
    display: "flex",
    "& > *:not(:first-child)": {
      marginLeft: theme.spacing(1),
    },
  },
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
  let [priceFilterParam, setPriceFilterParam] = useQuery("price")
  let [hotelSizeFilterParam, setHotelSizeFilterParam] = useQuery("hotel_size")
  let [recommendedFilterParam, setRecommendedFilterParam] =
    useQuery("recommended")
  let [boutiqueFilterParam, setBoutiqueFilterParam] = useQuery("boutique")

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
  let [budgetFilter, setBudgetFilter] = useState<number>(0)
  let [recommendedFilter, setRecommendedFilter] = useState<boolean>(false)
  let [boutiqueFilter, setBoutiqueFilter] = useState<boolean>(false)

  // Filters active state
  let [locationFilterOpen, setLocationFilterOpen] = useState(false)

  // Update local state to match query params
  useEffect(() => {
    setDestinationFilter(
      locationFilterParam
        .map((strVal) => parseInt(strVal))
        .filter((intVal) => !isNaN(intVal))
    )
  }, [locationFilterParam])
  useEffect(() => {
    if (priceFilterParam !== null && !isNaN(parseInt(priceFilterParam))) {
      setBudgetFilter(parseInt(priceFilterParam))
    }
  }, [priceFilterParam])
  useEffect(() => {
    setRecommendedFilter(recommendedFilterParam === "1")
  }, [recommendedFilterParam])
  useEffect(() => {
    setBoutiqueFilter(boutiqueFilterParam === "1")
  }, [boutiqueFilterParam])

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

  // Hotels search state (algolia backed)
  const [hotels, numHotels, loading, hasMore, getMore] = useHotels(
    destinationFilter,
    []
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
          }
          right={
            <AppPageSpotlightImage
              imageUrl="https://flok-b32d43c.s3.amazonaws.com/hotels/fairmont_sidebar.png"
              imageAlt="Fairmont Austin pool overview in the evening"
              imagePosition="bottom-right"
            />
          }>
          <PageHeader
            header={`Lodging (${numHotels})`}
            subheader="Select some hotels to request a free proposal from!"
            preHeader={<AppLodgingFlowTimeline currentStep="HOTEL_SELECT" />}
            postHeader={
              <HotelGridFilters
                filters={[
                  {
                    filter: "Location",
                    filterSelected: destinationFilter.length
                      ? `${destinationFilter.length} selected`
                      : undefined,
                    popper: (
                      <HotelGridLocationFilterBody
                        locations={destinations}
                        onClose={() => setLocationFilterOpen(false)}
                        selected={destinationFilter}
                        setSelected={(vals) =>
                          setLocationFilterParam(
                            vals.map((val) => val.toString())
                          )
                        }
                      />
                    ),
                    open: locationFilterOpen,
                    toggleOpen: () => {
                      setLocationFilterOpen(!locationFilterOpen)
                    },
                  },
                  {
                    filter: "Flok Recommended",
                    filterSelected: recommendedFilter ? "\u2713" : "",
                    popper: <></>,
                    open: false,
                    toggleOpen: () => {
                      setRecommendedFilterParam(
                        recommendedFilter ? undefined : "1"
                      )
                    },
                  },
                  {
                    filter: "Boutique",
                    filterSelected: boutiqueFilter ? "\u2713" : "",
                    popper: <></>,
                    open: false,
                    toggleOpen: () => {
                      setBoutiqueFilterParam(boutiqueFilter ? undefined : "1")
                    },
                  },
                ]}>
                <div className={classes.bigFilters}>
                  <div className={classes.filterBody}>
                    <AppTypography variant="body2">Budget Size</AppTypography>
                    <AppSliderInput
                      defaultThumb
                      value={budgetFilter}
                      onChange={(newVal) =>
                        setPriceFilterParam(newVal.toString())
                      }
                      min={0}
                      max={5}
                    />
                  </div>
                  <div className={classes.filterBody}>
                    <AppTypography variant="body2">Hotel Size</AppTypography>
                    <AppSliderInput
                      defaultThumb
                      onChange={(val) =>
                        setHotelSizeFilterParam(val.toString())
                      }
                      value={
                        hotelSizeFilterParam !== null &&
                        !isNaN(parseInt(hotelSizeFilterParam))
                          ? parseInt(hotelSizeFilterParam)
                          : 2
                      }
                      min={0}
                      max={5}
                    />
                  </div>
                </div>
              </HotelGridFilters>
            }
          />
          <HotelGrid
            hotels={hotels}
            onReachEnd={onReachEnd}
            onExplore={explore}
            onSelect={toggleSelect}
            isSelected={isHotelSelected}
          />
          {loading && <>Loading</>}
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(HotelsListPage)
