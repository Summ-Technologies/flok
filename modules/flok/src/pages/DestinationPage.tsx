import {goBack} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader, {PageHeaderBackButton} from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {RootState} from "../store"
import {
  deleteSelectedRetreatDestination,
  postSelectedRetreatDestination,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import NotFound404Page from "./misc/NotFound404Page"

type DestinationPageProps = RouteComponentProps<{
  destinationGuid: string
  retreatGuid: string
}>
function DestinationPage(props: DestinationPageProps) {
  let dispatch = useDispatch()
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== "NOT_FOUND") {
      return retreat.selected_destinations_ids
    }
    return []
  })
  let destinationId = useSelector(
    (state: RootState) =>
      state.lodging.destinationsGuidMapping[props.match.params.destinationGuid]
  )
  let destinationsLoaded = useSelector(
    (state: RootState) => state.lodging.destinationsLoaded
  )
  let destination = useSelector((state: RootState) => {
    let destinationId =
      state.lodging.destinationsGuidMapping[props.match.params.destinationGuid]
    if (destinationId && state.lodging.destinations[destinationId]) {
      return state.lodging.destinations[destinationId]
    } else {
      return undefined
    }
  })

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {!destinationsLoaded ? (
        <>Loading...</>
      ) : destination === undefined ? (
        <NotFound404Page />
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            OverlayFooterProps={{
              cta: selectedDestinationIds.includes(destinationId)
                ? "Unselect Location"
                : "Select Location",
              onClick: () => {
                if (selectedDestinationIds.includes(destinationId)) {
                  dispatch(
                    deleteSelectedRetreatDestination(retreatGuid, destinationId)
                  )
                } else {
                  dispatch(
                    postSelectedRetreatDestination(retreatGuid, destinationId)
                  )
                }
              },
            }}
            right={<AppImageGrid images={destination.imgs} />}>
            <PageHeader
              header={destination.location}
              subheader={destination.tagline}
              preHeader={
                <PageHeaderBackButton onClick={() => dispatch(goBack())} />
              }
            />
            <AppTypography variant="body1" paragraph>
              {destination.description}
            </AppTypography>
            {destination.detail_sections.map((section) => (
              <>
                <AppTypography variant="h4">{section.header}</AppTypography>
                <AppTypography variant="body1" paragraph>
                  {section.body}
                </AppTypography>
              </>
            ))}
          </PageOverlay>
        </PageContainer>
      )}
    </RetreatRequired>
  )
}
export default withRouter(DestinationPage)
