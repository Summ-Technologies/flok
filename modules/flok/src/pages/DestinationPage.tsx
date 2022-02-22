import {Button, Hidden} from "@material-ui/core"
import {goBack} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import AppPageSpotlightImage from "../components/lodging/AppPageSpotlightImage"
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
  retreatIdx: string
}>
function DestinationPage(props: DestinationPageProps) {
  // Setup
  let dispatch = useDispatch()

  // Path params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let destinationGuid = convertGuid(props.match.params.destinationGuid)

  // API data
  let [destination, isLoading] = useDestination(destinationGuid)

  // Selected destinations
  let selectedDestinationIds = useSelector((state: RootState) => {
    let retreat = state.retreat.retreats[retreatIdx]
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
        dispatch(deleteSelectedRetreatDestination(retreatIdx, destination.id))
      } else {
        dispatch(postSelectedRetreatDestination(retreatIdx, destination.id))
      }
    }
  }

  return (
    <RetreatRequired retreatIdx={retreatIdx}>
      {destination === ResourceNotFound ? (
        <NotFound404Page />
      ) : isLoading ? (
        <>Loading...</>
      ) : destination !== null ? (
        <PageContainer>
          <PageOverlay
            size="small"
            right={
              destination.imgs && destination.imgs.length ? (
                <AppPageSpotlightImage
                  imageUrl={destination.imgs[0].image_url}
                  imageAlt={destination.imgs[0].alt}
                  imagePosition="centered"
                />
              ) : undefined
            }
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
            {destination.imgs && destination.imgs.length ? (
              <Hidden mdUp>
                <AppPageSpotlightImage
                  imageUrl={destination.imgs[0].image_url}
                  imageAlt={destination.imgs[0].alt}
                  imagePosition="centered"
                />
              </Hidden>
            ) : undefined}
          </PageOverlay>
        </PageContainer>
      ) : (
        <>Something went wrong</>
      )}
    </RetreatRequired>
  )
}
export default withRouter(DestinationPage)
