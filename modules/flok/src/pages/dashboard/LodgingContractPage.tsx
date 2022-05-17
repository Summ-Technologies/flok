import {makeStyles} from "@material-ui/core"
import RetreatHotelPageBody from "../../components/lodging/RetreatHotelPageBody"
import PageBody from "../../components/page/PageBody"
import {useRetreat} from "../misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
}))

export default function LodgingContractPage() {
  // Setup
  let classes = useStyles()
  // Path and query params
  let [retreat, retreatIdx] = useRetreat()
  return (
    <PageBody appBar>
      <div className={classes.root}>
        <RetreatHotelPageBody retreat={retreat} retreatIdx={retreatIdx} />
      </div>
    </PageBody>
  )
}
