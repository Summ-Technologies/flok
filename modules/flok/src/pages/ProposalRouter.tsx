import {RouteComponentProps, withRouter} from "react-router"
import RetreatRequired from "../components/lodging/RetreatRequired"
import {RetreatModel} from "../models/retreat"
import {convertGuid} from "../utils"
import {useRetreat} from "../utils/lodgingUtils"
import HotelProposalWaitingPage from "./HotelProposalWaitingPage"
import RedirectPage from "./misc/RedirectPage"
import ProposalsListPage from "./ProposalsListPage"

type ProposalRouterProps = RouteComponentProps<{retreatGuid: string}>
function ProposalRouter(props: ProposalRouterProps) {
  // Path and query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid) as RetreatModel | undefined
  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      {retreat ? (
        retreat.state === "PROPOSAL" ? (
          <HotelProposalWaitingPage />
        ) : retreat.state === "PROPOSAL_READY" ? (
          <ProposalsListPage />
        ) : (
          <RedirectPage
            pageName="RetreatRoutingPage"
            pathParams={{retreatGuid}}
          />
        )
      ) : (
        "Loading..."
      )}
    </RetreatRequired>
  )
}

export default withRouter(ProposalRouter)
