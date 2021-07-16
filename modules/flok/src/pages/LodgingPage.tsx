import {RouteComponentProps, withRouter} from "react-router-dom"
import AppProgressStepper from "../components/base/AppProgressStepper"
import LodgingPreferencesForm from "../components/forms/LodgingPreferencesForm"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

type LodgingPageProps = RouteComponentProps<{}>
function LodgingPage(props: LodgingPageProps) {
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
                  name: "Add attendees to Slack channel",
                  progress: "IN-PROGRESS",
                },
                {
                  name: "Add Flok with Slack Connect",
                  progress: "TODO",
                },
                {
                  name: "View and manage attendees",
                  progress: "TODO",
                },
              ]}
            />
          ),
        }}>
        <LodgingPreferencesForm
          submitLodgingPreferencesForm={() => undefined}
        />
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingPage)
