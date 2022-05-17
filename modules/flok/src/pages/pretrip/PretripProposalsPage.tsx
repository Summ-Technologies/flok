import {makeStyles} from "@material-ui/core"
import AppLoadingScreen from "../../components/base/AppLoadingScreen"
import ProposalList from "../../components/lodging/ProposalsListPageBody"
import PageBody from "../../components/page/PageBody"
import {Constants} from "../../config"
import {ResourceNotFound} from "../../models"
import {useRetreatByGuid} from "../../utils/retreatUtils"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
}))

export default function PretripProposalsPage() {
  // Setup
  let classes = useStyles()
  // Path and query params
  let [retreat, loading] = useRetreatByGuid(Constants.demoRetreatGuid)
  let retreatIdx = "demo" as unknown as number
  return (
    <PageBody appBar>
      <div className={classes.root}>
        {(!retreat || retreat === ResourceNotFound) && loading ? (
          <AppLoadingScreen />
        ) : retreat && retreat !== ResourceNotFound ? (
          <ProposalList retreat={retreat} retreatIdx={retreatIdx} />
        ) : (
          <AppLoadingScreen />
        )}
      </div>
    </PageBody>
  )
}
