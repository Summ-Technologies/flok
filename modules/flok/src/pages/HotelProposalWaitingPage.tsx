import {RouteComponentProps, withRouter} from "react-router"
import AppTypography from "../components/base/AppTypography"
import AppLodgingFlowTimeline from "../components/lodging/AppLodgingFlowTimeline"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageContainer from "../components/page/PageContainer"
import PageHeader from "../components/page/PageHeader"
import PageOverlay from "../components/page/PageOverlay"
import {ResourceNotFound} from "../models"
import {convertGuid} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"

type HotelProposalWaitingPageProps = RouteComponentProps<{retreatGuid: string}>

function HotelProposalWaitingPage(props: HotelProposalWaitingPageProps) {
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid)
  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageOverlay size="small">
          <PageHeader
            header={`Almost done!`}
            subheader="We’re negotiating with hotels on your behalf and are waiting to hear back about availability and pricing."
            preHeader={
              <AppLodgingFlowTimeline currentStep="PROPOSAL" halfway />
            }
          />
          <AppTypography variant="h4">Be on the lookout!</AppTypography>
          <AppTypography variant="body1">
            We'll get back to you once we hear back from our hotel partners. You
            can expect an email at{" "}
            <a
              href={`mailto:${
                retreat && retreat !== ResourceNotFound && retreat.contact_email
              }`}>
              {retreat && retreat !== ResourceNotFound && retreat.contact_email}
            </a>{" "}
            within the next 72 hours.
          </AppTypography>
          <br />
          <AppTypography variant="h4">Have any questions?</AppTypography>
          <AppTypography variant="body1">
            Booking is a retreat is a big committment, please feel free to reach
            out to our hotel
          </AppTypography>
        </PageOverlay>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(HotelProposalWaitingPage)
