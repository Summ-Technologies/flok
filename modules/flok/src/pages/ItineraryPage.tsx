import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"

type ItineraryPageProps = RouteComponentProps<{}>
function ItineraryPage(props: ItineraryPageProps) {
  return (
    <PageContainer>
      <PageSidenav activeItem="itinerary" />
      <PageBody
        HeaderProps={{
          header: "Lodging",
          subheader: "GameStop Summer 2021 Retreat",
        }}></PageBody>
    </PageContainer>
  )
}
export default withRouter(ItineraryPage)
