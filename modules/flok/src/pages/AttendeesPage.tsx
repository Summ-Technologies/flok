import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

type AttendeesPageProps = RouteComponentProps<{}>
function AttendeesPage(props: AttendeesPageProps) {
  return (
    <PageContainer>
      <PageSidenav activeItem="attendees" />
      <PageBody
        HeaderProps={{
          header: "Lodging",
          subheader: "GameStop Summer 2021 Retreat",
        }}></PageBody>
    </PageContainer>
  )
}
export default withRouter(AttendeesPage)
