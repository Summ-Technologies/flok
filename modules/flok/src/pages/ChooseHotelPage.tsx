import algoliasearch from "algoliasearch"
import {push} from "connected-react-router"
import {useState} from "react"
import {InstantSearch} from "react-instantsearch-dom"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import HotelGrid, {HotelGridFilters} from "../components/lodging/HotelGrid"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {HotelAlgoliaHitModel} from "../models/lodging"

const searchClient = algoliasearch(
  "0GNPYG0XAN",
  "1bfd529008a4c2c0945b629b44707593"
)

type ChooseHotelPageProps = RouteComponentProps<{}>
function ChooseHotelPage(props: ChooseHotelPageProps) {
  let dispatch = useDispatch()
  let [selected, setSelected] = useState<string[]>([])

  // Actions
  function explore(hit: HotelAlgoliaHitModel) {
    dispatch(push(`/lodging/hotels/${hit.objectID}`))
  }

  function isSelected(hit: HotelAlgoliaHitModel) {
    return selected.includes(hit.objectID)
  }

  function toggleSelect(hit: HotelAlgoliaHitModel) {
    if (isSelected(hit)) {
      setSelected(selected.filter((objId) => objId !== hit.objectID))
    } else {
      setSelected([...selected, hit.objectID])
    }
  }

  return (
    <PageContainer backgroundImage="https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg">
      <PageOverlay
        OverlayFooterProps={{
          cta: "Next Step",
          onClick: () => {
            alert("should goto next step")
          },
          rightText: `${selected.length} hotels selected`,
        }}>
        <PageHeader
          header="Lodging"
          subheader="Select some hotels to request a free proposal from!"
          postHeader={
            <HotelGridFilters
              filters={[
                {
                  filter: "Location",
                  filterSelected: "2",
                  popper: <div></div>,
                  onClick: () => undefined,
                },
                {
                  filter: "Price",
                  popper: <div></div>,
                  onClick: () => undefined,
                },
                {
                  filter: "Rooms",
                  popper: <div></div>,
                  onClick: () => undefined,
                },
              ]}
            />
          }
        />
        <InstantSearch searchClient={searchClient} indexName="hotels">
          <HotelGrid
            onExplore={explore}
            onSelect={toggleSelect}
            isSelected={isSelected}
          />
        </InstantSearch>
      </PageOverlay>
    </PageContainer>
  )
}
export default withRouter(ChooseHotelPage)
