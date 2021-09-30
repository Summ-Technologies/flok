import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
import HotelGrid, {
  HotelGridBudgetFilterBody,
  HotelGridFilters,
  HotelGridLocationFilterBody,
} from "../components/lodging/HotelGrid"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {BudgetType, BudgetTypeVals, HotelModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatHotel,
  postAdvanceRetreatState,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid, useQueryAsList} from "../utils"
import {useDestinations, useHotels, useRetreat} from "../utils/lodgingUtils"

type HotelsListPageProps = RouteComponentProps<{retreatGuid: string}>
function HotelsListPage(props: HotelsListPageProps) {
  // Setup
  let dispatch = useDispatch()

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

  // Hotels search state (algolia backed)
  const [hotels, numHotels, loading, hasMore, getMore] = useHotels(
    destinationFilter,
    budgetFilter
  )

  // Actions
  function explore(hotel: HotelModel) {
    dispatch(
      push(
        AppRoutes.getPath("HotelPage", {
          retreatGuid: props.match.params.retreatGuid,
          hotelGuid: hotel.guid,
        })
      )
    )
  }
  function toggleSelect(hotel: HotelModel) {
    if (isHotelSelected(hotel)) {
      dispatch(deleteSelectedRetreatHotel(retreatGuid, hotel.id))
    } else {
      dispatch(postSelectedRetreatHotel(retreatGuid, hotel.id))
    }
  }
  function onReachEnd() {
    if (hasMore) {
      getMore()
    }
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageOverlay
          OverlayFooterProps={{
            cta: "Next Step",
            onClick: () => {
              if (retreat && retreat !== ResourceNotFound) {
                dispatch(postAdvanceRetreatState(retreatGuid, retreat.state))
              }
              alert("Move to next page")
            },
            rightText: `${selectedHotelIds.length} hotels selected`,
          }}
          right={
            <AppPageSpotlightImage
              imageUrl="https://images.unsplash.com/photo-1627334848323-6ce21facb54b"
              imageAlt="Hotel image or something"
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
                    filter: "Price",
                    filterSelected: budgetFilter.length
                      ? `${budgetFilter.length} selected`
                      : undefined,
                    popper: (
                      <HotelGridBudgetFilterBody
                        onClose={() => setPriceFilterOpen(false)}
                        selected={budgetFilter}
                        setSelected={(newVals) => setPriceFilterParam(newVals)}
                      />
                    ),
                    open: priceFilterOpen,
                    toggleOpen: () => setPriceFilterOpen(!priceFilterOpen),
                  },
                ]}
              />
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
