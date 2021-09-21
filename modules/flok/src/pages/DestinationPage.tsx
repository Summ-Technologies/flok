import {push} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppImageGrid from "../components/base/AppImageGrid"
import AppTypography from "../components/base/AppTypography"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader, {PageHeaderBackButton} from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import NotFound404Page from "./misc/NotFound404Page"

type DestinationPageProps = RouteComponentProps<{
  destinationGuid: string
  retreatGuid: string
}>
function DestinationPage(props: DestinationPageProps) {
  let dispatch = useDispatch()

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
    <RetreatRequired retreatGuid={props.match.params.retreatGuid}>
      {!destinationsLoaded ? (
        <>Loading...</>
      ) : destination === undefined ? (
        <NotFound404Page />
      ) : (
        <PageContainer>
          <PageOverlay
            size="small"
            OverlayFooterProps={{
              cta: "Select Location",
              onClick: () => {
                dispatch(
                  push(
                    AppRoutes.getPath("ChooseDestinationPage", {
                      retreatGuid: props.match.params.retreatGuid,
                    })
                  )
                )
              },
            }}
            right={<AppImageGrid images={destination.imgs} />}>
            <PageHeader
              header={destination.location}
              subheader=""
              preHeader={
                <PageHeaderBackButton
                  to={AppRoutes.getPath("ChooseDestinationPage", {
                    retreatGuid: props.match.params.retreatGuid,
                  })}
                />
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
