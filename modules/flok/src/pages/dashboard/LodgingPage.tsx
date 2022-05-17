import RedirectPage from "../misc/RedirectPage"
import {useRetreat} from "../misc/RetreatProvider"

export default function LodgingPage() {
  // Path and query params
  let [retreat, retreatIdx] = useRetreat()
  return retreat.lodging_final_hotel_id ? (
    <RedirectPage
      pageName="RetreatLodgingContractPage"
      pathParams={{retreatIdx: retreatIdx.toString()}}
    />
  ) : (
    <RedirectPage
      pageName="RetreatLodgingProposalsPage"
      pathParams={{retreatIdx: retreatIdx.toString()}}
    />
  )
}
