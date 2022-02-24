import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import UnderConstructionView from "../components/page/UnderConstructionView"
import {useRetreat} from "./misc/RetreatProvider"

type RetreatItineraryPageProps = RouteComponentProps<{retreatIdx: string}>
function RetreatItineraryPage(props: RetreatItineraryPageProps) {
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  return (
    <PageContainer>
      <PageSidenav
        activeItem="itinerary"
        retreatIdx={retreatIdx}
        companyName={retreat.company_name}
      />
      <PageBody>
        <UnderConstructionView />
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(RetreatItineraryPage)
