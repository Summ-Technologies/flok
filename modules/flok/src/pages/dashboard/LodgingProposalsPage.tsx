import {makeStyles} from "@material-ui/core"
import ProposalList from "../../components/lodging/ProposalsListPageBody"
import PageBody from "../../components/page/PageBody"
import {useRetreat} from "../misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
}))

export default function LodgingProposalsPage() {
  // Setup
  let classes = useStyles()
  // Path and query params
  let [retreat, retreatIdx] = useRetreat()
  return (
    <PageBody appBar>
      <div className={classes.root}>
        <ProposalList retreat={retreat} retreatIdx={retreatIdx} />
      </div>
    </PageBody>
  )
}
