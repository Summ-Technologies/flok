import {Box} from "@material-ui/core"
import {push} from "connected-react-router"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import DestinationsGrid from "../components/lodging/DestinationsGrid"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {DestinationModel} from "../models/lodging"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"

type ChooseDestinationPageProps = RouteComponentProps<{}>
function ChooseDestinationPage(props: ChooseDestinationPageProps) {
  let dispatch = useDispatch()
  let destinationsLoaded = useSelector(
    (state: RootState) => state.lodging.destinationsLoaded
  )
  let destinations = useSelector((state: RootState) =>
    // TODO THIS SHOULD BE ORDERED
    Object.values(state.lodging.destinations)
  )
  let [selected, setSelected] = useState<string[]>([])

  // Actions
  function explore(destination: DestinationModel) {
    dispatch(push(`/lodging/destinations/${destination.objectID}`))
  }
  function isSelected(destination: DestinationModel) {
    return selected.includes(destination.objectID)
  }
  function toggleSelect(destination: DestinationModel) {
    if (isSelected(destination)) {
      setSelected(selected.filter((objId) => objId !== destination.objectID))
    } else {
      setSelected([...selected, destination.objectID])
    }
  }

  return !destinationsLoaded ? (
    <>Loading...</>
  ) : (
    <PageContainer backgroundImage="https://flok-b32d43c.s3.us-east-1.amazonaws.com/misc/david-vives-ELf8M_YWRTY-unsplash.jpg">
      <PageOverlay
        OverlayFooterProps={{
          cta: "Next Step",
          onClick: () => {
            dispatch(push(AppRoutes.getPath("ChooseHotelPage")))
          },
          rightText: `${selected.length} destinations selected`,
        }}>
        <Box paddingBottom={4}>
          <PageHeader
            preHeader={
              <AppLodgingFlowTimeline currentStep="SELECT_DESTINATION" />
            }
            header="Location"
            subheader="Finding the right destination is the first step to a planning a great retreat!"
          />
        </Box>
        <DestinationsGrid
          destinations={destinations}
          onExplore={explore}
          onSelect={toggleSelect}
          isSelected={isSelected}
        />
      </PageOverlay>
    </PageContainer>
  )
}
export default withRouter(ChooseDestinationPage)
