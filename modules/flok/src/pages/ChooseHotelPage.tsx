import {Box} from "@material-ui/core"
import algoliasearch from "algoliasearch"
import {push} from "connected-react-router"
import {useState} from "react"
import {InstantSearch} from "react-instantsearch-dom"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLogo from "../components/base/AppLogo"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import HotelGrid from "../components/destinations/HotelGrid"
import { HotelAlgoliaHitModel } from "../models/lodging"


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
    dispatch(push(`/lodging/destinations/${hit.objectID}`))
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
        <Box paddingBottom={4}>
          <AppLogo height={40} noBackground />
          <PageHeader
            header="Lodging"
            subheader="Select some hotels to request a free proposal from!"
          />
        </Box>
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
