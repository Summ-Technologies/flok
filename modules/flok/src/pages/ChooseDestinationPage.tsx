import {Box} from "@material-ui/core"
import algoliasearch from "algoliasearch"
import {push} from "connected-react-router"
import {useState} from "react"
import {InstantSearch} from "react-instantsearch-dom"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLogo from "../components/base/AppLogo"
import DestinationsGrid from "../components/destinations/DestinationsGrid"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {DestinationAlgoliaHitModel} from "../models/lodging"

const searchClient = algoliasearch(
  "0GNPYG0XAN",
  "1bfd529008a4c2c0945b629b44707593"
)

type ChooseDestinationPageProps = RouteComponentProps<{}>
function ChooseDestinationPage(props: ChooseDestinationPageProps) {
  let dispatch = useDispatch()
  let [selected, setSelected] = useState<string[]>([])

  // Actions
  function explore(hit: DestinationAlgoliaHitModel) {
    dispatch(push(`/lodging/destinations/${hit.objectID}`))
  }

  function isSelected(hit: DestinationAlgoliaHitModel) {
    return selected.includes(hit.objectID)
  }

  function toggleSelect(hit: DestinationAlgoliaHitModel) {
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
          rightText: `${selected.length} destinations selected`,
        }}>
        <Box paddingBottom={4}>
          <AppLogo height={40} noBackground />
          <PageHeader
            header="Location"
            subheader="Finding the right destination is the first step to a planning a great retreat!"
          />
        </Box>
        <InstantSearch searchClient={searchClient} indexName="destinations">
          <DestinationsGrid
            onExplore={explore}
            onSelect={toggleSelect}
            isSelected={isSelected}
          />
        </InstantSearch>
      </PageOverlay>
    </PageContainer>
  )
}
export default withRouter(ChooseDestinationPage)
