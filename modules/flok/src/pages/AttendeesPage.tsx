import {useState} from "react"
import {useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import AppAttendeesListBody from "../components/attendees/AppAttendeesListBody"
import AppBlockedPageBody from "../components/base/AppBlockedPageBody"
import DemoStepper from "../components/page/DemoStepper"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {RootState} from "../store"

type AttendeesPageProps = RouteComponentProps<{}>
function AttendeesPage(props: AttendeesPageProps) {
  let attendees = useSelector((state: RootState) => state.retreat.attendees)
  let [step, setStep] = useState(1)
  return (
    <PageContainer>
      <DemoStepper step={step} setStep={setStep} maxStep={2} />
      <PageSidenav activeItem="attendees" />
      <PageBody
        paddingTop
        HeaderProps={{
          header: "Attendees",
          subheader: "GameStop Summer 2021 Retreat",
        }}>
        {step === 1 ? (
          <AppBlockedPageBody
            title="This page is blocked!"
            subheader="The attendees table is unavailable until a hotel is confirmed and Slack is connected."
            steps={[
              {title: "Hotel", body: "Not booked", status: "TODO"},
              {title: "Slack", body: "Not confirmed", status: "TODO"},
            ]}
          />
        ) : (
          <AppAttendeesListBody attendees={attendees} />
        )}
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(AttendeesPage)
