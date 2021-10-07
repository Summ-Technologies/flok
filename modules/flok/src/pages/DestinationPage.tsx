import {Button} from "@material-ui/core"
import {goBack} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader, {PageHeaderBackButton} from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {PageOverlayFooterDefaultBody} from "../components/page/PageOverlayFooter"
import {ResourceNotFound} from "../models"
import {RootState} from "../store"
import {
  deleteSelectedRetreatDestination,
  postSelectedRetreatDestination,
} from "../store/actions/retreat"
import {convertGuid} from "../utils"
import {useDestination} from "../utils/lodgingUtils"
import NotFound404Page from "./misc/NotFound404Page"

type DestinationPageProps = RouteComponentProps<{
  destinationGuid: string
  retreatGuid: string
}>
function DestinationPage(props: DestinationPageProps) {
  // Setup
  let dispatch = useDispatch()

  // Path params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let destinationGuid = convertGuid(props.match.params.destinationGuid)

  // API data
  let [destination, isLoading] = useDestination(destinationGuid)

  // Selected destinations
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatGuid]
    if (retreat && retreat !== ResourceNotFound) {
      return retreat.selected_destinations_ids
    }
    return []
  })
  function isSelected(destinationId: number) {
    if (destination && destination !== ResourceNotFound) {
      return selectedDestinationIds.includes(destinationId)
    }
  }

  function onClickSelectCta() {
    if (destination && destination !== ResourceNotFound) {
      if (isSelected(destination.id)) {
        dispatch(deleteSelectedRetreatDestination(retreatGuid, destination.id))
      } else {
        dispatch(postSelectedRetreatDestination(retreatGuid, destination.id))
      }
    }
  }

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {destination === ResourceNotFound ? (
        <NotFound404Page />
      ) : isLoading ? (
        <>Loading...</>
      ) : destination !== null ? (
        <PageContainer>
          <PageOverlay
            size="small"
            right={<AppImageGrid images={destination.imgs} />}
            footerBody={
              <PageOverlayFooterDefaultBody>
                <Button
                  variant={
                    isSelected(destination.id) ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={onClickSelectCta}>
                  {isSelected(destination.id) ? "Selected" : "Select"}
                </Button>
              </PageOverlayFooterDefaultBody>
            }>
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
      ) : (
        <>Something went wrong</>
      )}
    </RetreatRequired>
  )
}
export default withRouter(DestinationPage)
