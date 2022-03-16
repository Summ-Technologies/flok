import {makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import FinalHotelPageBody from "../components/lodging/FinalHotelPageBody"
import ProposalList from "../components/lodging/ProposalsListPageBody"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {useRetreat} from "./misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flex: 1,
    overflow: "hidden",
  },
}))

type LodgingPageProps = RouteComponentProps<{
  retreatIdx: string
}>
function LodgingPage(props: LodgingPageProps) {
  // Setup
  let classes = useStyles(props)

  // Path and query params
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let retreat = useRetreat()

  return (
    <PageContainer>
      <PageSidenav
        activeItem="lodging"
        retreatIdx={retreatIdx}
        companyName={retreat.company_name}
      />
      <PageBody appBar>
        <div className={classes.root}>
          {retreat.lodging_state === "BOOKED" ? (
            <FinalHotelPageBody retreat={retreat} retreatIdx={retreatIdx} />
          ) : (
            <ProposalList retreat={retreat} retreatIdx={retreatIdx} />
          )}
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(LodgingPage)
