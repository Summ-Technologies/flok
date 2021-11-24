import {RouteComponentProps, withRouter} from "react-router"
import {convertGuid} from "../utils"
import HotelProposalWaitingPage from "./HotelProposalWaitingPage"
import ProposalsListPage from "./ProposalsListPage"

type ProposalRouterProps = RouteComponentProps<{retreatGuid: string}>
function ProposalRouter(props: ProposalRouterProps) {
  // Path and query params
  let retreatGuid = convertGuid(props.match.params.retreatGuid)

  let showList = true

  if (showList) {
    return <ProposalsListPage retreatGuid={retreatGuid} />
  }

  return <HotelProposalWaitingPage retreatGuid={retreatGuid} />
}

export default withRouter(ProposalRouter)
