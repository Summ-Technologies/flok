import {useState} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppBlockedPageBody from "../components/base/AppBlockedPageBody"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

type FlightsPageProps = RouteComponentProps<{}>
function FlightsPage(props: FlightsPageProps) {
  let [step] = useState(0)
  return (
    <PageContainer>
      <PageSidenav activeItem="flights" />
      <PageBody
        HeaderProps={{
          header: "Flights",
          subheader: "GameStop Summer 2021 Retreat",
        }}>
        {step === 0 ? (
          <AppBlockedPageBody
            title="This page is blocked!"
            subheader="The attendees table is unavailable until a hotel is confirmed and Slack is connected."
            steps={[
              {title: "Hotel", body: "Not booked", status: "TODO"},
              {title: "Slack", body: "Not confirmed", status: "TODO"},
            ]}
          />
        ) : undefined}
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(FlightsPage)
