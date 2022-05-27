import RedirectPage from "../misc/RedirectPage"
import {useRetreat} from "../misc/RetreatProvider"

export default function BudgetPage() {
  // Path and query params
  let [, retreatIdx] = useRetreat()
  return (
    <RedirectPage
      pageName="RetreatBudgetEstimatePage"
      pathParams={{retreatIdx: retreatIdx.toString()}}
    />
  )
}
