import {RouteComponentProps, withRouter} from "react-router-dom"
import AppProgressStepper from "../components/base/AppProgressStepper"
import AppLodgingConfirmation from "../components/lodging/AppLodgingConfirmation"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

type LodgingProposalBookingPageProps = RouteComponentProps<{}>
function LodgingProposalBookingPage(props: LodgingProposalBookingPageProps) {
  return (
    <PageContainer>
      <PageSidenav activeItem="lodging" />
      <PageBody
        HeaderProps={{
          header: "Lodging",
          subheader: "GameStop Summer 2021 Retreat",
          progressBar: (
            <AppProgressStepper
              steps={[
                {
                  name: "Lodging Questions",
                  progress: "IN-PROGRESS",
                },
                {
                  name: "View Proposals",
                  progress: "TODO",
                },
                {
                  name: "Book Lodging",
                  progress: "TODO",
                },
              ]}
            />
          ),
        }}>
        <AppLodgingConfirmation />
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingProposalBookingPage)
