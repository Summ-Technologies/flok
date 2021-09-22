import algoliasearch from "algoliasearch"
import {push} from "connected-react-router"
import {useState} from "react"
import {InstantSearch} from "react-instantsearch-dom"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import {HotelsAlgoliaReduxConnector} from "../components/lodging/AlgoliaReduxConnectors"
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
import config, {ALGOLIA_HOTELS_INDEX_KEY} from "../config"
import {BudgetType, HotelModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {
  deleteSelectedRetreatHotel,
  postSelectedRetreatHotel,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"

const searchClient = algoliasearch(
  "0GNPYG0XAN",
  "1bfd529008a4c2c0945b629b44707593"
)

type ChooseHotelPageProps = RouteComponentProps<{retreatGuid: string}>
function ChooseHotelPage(props: ChooseHotelPageProps) {
  let dispatch = useDispatch()
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  let selectedHotelIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== "NOT_FOUND") {
      return retreat.selected_hotels_ids
    }
    return []
  })

  let [locationFilter, setLocationFilter] = useState<string[]>([])
  let [locationFilterOpen, setLocationFilterOpen] = useState(false)

  let [priceFilter, setPriceFilter] = useState<BudgetType[]>([])
  let [priceFilterOpen, setPriceFilterOpen] = useState(false)

  let [roomsFilter, setRoomsFilter] = useState<number>(10)
  let [roomsFilterOpen, setRoomsFilterOpen] = useState(false)

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
                        onClose={() => setLocationFilterOpen(false)}
                        selected={locationFilter}
                        setSelected={(vals) => setLocationFilter(vals)}
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
                        setSelected={(newVals) => setPriceFilter(newVals)}
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
                        setSelectedRoomsMin={(newMin) => setRoomsFilter(newMin)}
                      />
                    ),
                    open: roomsFilterOpen,
                    toggleOpen: () => setRoomsFilterOpen(!roomsFilterOpen),
                  },
                ]}
              />
            }
          />
          <InstantSearch
            searchClient={searchClient}
            indexName={config.get(ALGOLIA_HOTELS_INDEX_KEY)}>
            <HotelGrid
              onExplore={explore}
              onSelect={toggleSelect}
              isSelected={isSelected}
            />
            <HotelsAlgoliaReduxConnector />
          </InstantSearch>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}
export default withRouter(ChooseHotelPage)
