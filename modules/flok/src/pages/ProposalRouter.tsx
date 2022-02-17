import {RouteComponentProps, withRouter} from "react-router"
import RetreatRequired from "../components/lodging/RetreatRequired"
import {RetreatModel} from "../models/retreat"
import {useRetreat} from "../utils/lodgingUtils"
import HotelProposalWaitingPage from "./HotelProposalWaitingPage"
import RedirectPage from "./misc/RedirectPage"
import ProposalsListPage from "./ProposalsListPage"

type ProposalRouterProps = RouteComponentProps<{retreatIdx: string}>
function ProposalRouter(props: ProposalRouterProps) {
  // Path and query params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat(retreatIdx) as RetreatModel | undefined
  return (
    <RetreatRequired retreatIdx={retreatIdx}>
      {retreat ? (
        retreat.state === "PROPOSAL" ? (
          <HotelProposalWaitingPage />
        ) : retreat.state === "PROPOSAL_READY" ? (
          <ProposalsListPage />
        ) : (
          <RedirectPage
            pageName="RetreatRoutingPage"
            pathParams={{retreatIdx: retreatIdx.toString()}}
          />
        )
      ) : (
        "Loading..."
      )}
    </RetreatRequired>
  )
}

export default withRouter(ProposalRouter)
