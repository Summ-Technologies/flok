import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import useAlgolia from "use-algolia"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import HotelGrid, {
  HotelGridBudgetFilterBody,
  HotelGridFilters,
  HotelGridLocationFilterBody,
  HotelGridRoomsFilterBody,
} from "../components/lodging/HotelGrid"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import config, {
  ALGOLIA_API_KEY,
  ALGOLIA_APP_ID_KEY,
  ALGOLIA_HOTELS_INDEX_KEY,
} from "../config"
import {BudgetType, BudgetTypeVals, HotelModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {updateHotels} from "../store/actions/lodging"
import {
  deleteSelectedRetreatHotel,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid, useDestinations, useQuery, useQueryAsList} from "../utils"

type ChooseHotelPageProps = RouteComponentProps<{retreatGuid: string}>
function ChooseHotelPage(props: ChooseHotelPageProps) {
  let dispatch = useDispatch()
  const [searchState, requestDispatch, getMore] = useAlgolia<HotelModel>(
    config.get(ALGOLIA_APP_ID_KEY),
    config.get(ALGOLIA_API_KEY),
    config.get(ALGOLIA_HOTELS_INDEX_KEY)
  )

  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatGuid]
  )
  let destinations = useDestinations()
  let selectedHotelIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== "NOT_FOUND") {
      return retreat.selected_hotels_ids
    }
    return []
  })
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== "NOT_FOUND") {
      return retreat.selected_destinations_ids
    }
    return []
  })

  let [locationFilterParam, setLocationFilterParam] =
    useQueryAsList("locations")
  let [locationFilter, setLocationFilter] = useState<number[]>([])
  let [locationFilterOpen, setLocationFilterOpen] = useState(false)
  let [initLocationFilter, setInitLocationFilter] = useState(false)
  useEffect(() => {
    setLocationFilter(
      locationFilterParam
        .map((strVal) => parseInt(strVal))
        .filter((intVal) => !isNaN(intVal))
    )
  }, [locationFilterParam])
  useEffect(() => {
    if (!initLocationFilter && retreat) {
      if (locationFilterParam.length > 0) {
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
  useEffect(() => {}, [])

  let [priceFilter, setPriceFilter] = useState<BudgetType[]>([])
  let [priceFilterParam, setPriceFilterParam] = useQueryAsList("price")
  let [priceFilterOpen, setPriceFilterOpen] = useState(false)
  useEffect(() => {
    setPriceFilter(
      priceFilterParam.filter((val) =>
        BudgetTypeVals.includes(val)
      ) as BudgetType[]
    )
  }, [priceFilterParam])

  let [roomsFilter, setRoomsFilter] = useState<number>(10)
  let [roomsFilterParam, setRoomsFilterParm] = useQuery("rooms")
  let [roomsFilterOpen, setRoomsFilterOpen] = useState(false)

  useEffect(() => {
    setRoomsFilter(
      !isNaN(parseInt(roomsFilterParam || ""))
        ? parseInt(roomsFilterParam || "")
        : roomsFilter
    )
  }, [roomsFilterParam, roomsFilter])

  useEffect(() => {
    let locationFilterString = locationFilter
      .map((destId) => `destination_id=${destId}`)
      .join(" OR ")
    let priceFilterString = priceFilter
      .map((priceOption) => `price:"${priceOption}"`)
      .join(" OR ")
    let roomsFilterString = ""
    let filters = [locationFilterString, priceFilterString, roomsFilterString]
      .filter((x) => x)
      .join(" AND ")
    requestDispatch({filters})
  }, [locationFilter, priceFilter, roomsFilter, requestDispatch])

  useEffect(() => {
    if (searchState.response) {
      dispatch(updateHotels(searchState.response.hits))
    }
  }, [searchState.response, dispatch])

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

  function isSelected(hotel: HotelModel) {
    return selectedHotelIds.includes(hotel.id)
  }

  function toggleSelect(hotel: HotelModel) {
    if (isSelected(hotel)) {
      dispatch(deleteSelectedRetreatHotel(retreatGuid, hotel.id))
    } else {
      dispatch(postSelectedRetreatHotel(retreatGuid, hotel.id))
    }
  }

  function onReachEnd() {
    if (searchState.hasMore) {
      getMore()
    }
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer backgroundImage="https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg">
        <PageOverlay
          OverlayFooterProps={{
            cta: "Next Step",
            onClick: () => {
              alert("should goto next step")
            },
            rightText: `${selectedHotelIds.length} hotels selected`,
          }}>
          <PageHeader
            header="Lodging"
            subheader="Select some hotels to request a free proposal from!"
            preHeader={
              <AppLodgingFlowTimeline currentStep="SELECT_HOTEL_RFPS" />
            }
            postHeader={
              <HotelGridFilters
                filters={[
                  {
                    filter: "Location",
                    filterSelected: locationFilter.length
                      ? `${locationFilter.length} selected`
                      : undefined,
                    popper: (
                      <HotelGridLocationFilterBody
                        locations={Object.values(destinations)}
                        onClose={() => setLocationFilterOpen(false)}
                        selected={locationFilter}
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
                    filterSelected: priceFilter.length
                      ? `${priceFilter.length} selected`
                      : undefined,
                    popper: (
                      <HotelGridBudgetFilterBody
                        onClose={() => setPriceFilterOpen(false)}
                        selected={priceFilter}
                        setSelected={(newVals) => setPriceFilterParam(newVals)}
                      />
                    ),
                    open: priceFilterOpen,
                    toggleOpen: () => setPriceFilterOpen(!priceFilterOpen),
                  },
                  {
                    filter: "Min. rooms",
                    filterSelected:
                      roomsFilter !== 10 ? roomsFilter.toString() : undefined,
                    popper: (
                      <HotelGridRoomsFilterBody
                        onClose={() => setRoomsFilterOpen(false)}
                        selectedRoomsMin={roomsFilter}
                        setSelectedRoomsMin={(newMin) =>
                          setRoomsFilterParm(newMin.toString())
                        }
                      />
                    ),
                    open: roomsFilterOpen,
                    toggleOpen: () => setRoomsFilterOpen(!roomsFilterOpen),
                  },
                ]}
              />
            }
          />
          <HotelGrid
            hotels={searchState.hits}
            onReachEnd={onReachEnd}
            onExplore={explore}
            onSelect={toggleSelect}
            isSelected={isSelected}
          />
          {searchState.loading && <>Loading</>}
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(ChooseHotelPage)
