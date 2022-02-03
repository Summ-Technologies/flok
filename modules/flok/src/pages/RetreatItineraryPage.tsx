import {makeStyles} from "@material-ui/core"
import {RouteComponentProps, withRouter} from "react-router-dom"
import RetreatRequired from "../components/lodging/RetreatRequired"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import UnderConstructionView from "../components/page/UnderConstructionView"
import {RetreatModel} from "../models/retreat"
import {convertGuid} from "../utils"
import {useRetreat, useRetreatAttendees} from "../utils/lodgingUtils"

const UNDER_CONSTRUCTION = true

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
  },
  headerIcon: {
    marginRight: theme.spacing(1),
    verticalAlign: "top",
    "&.todo": {
      color: theme.palette.error.main,
    },
    "&.next": {
      color: theme.palette.warning.main,
    },
    "&.completed": {
      color: theme.palette.success.main,
    },
  },
}))

type RetreatItineraryPageProps = RouteComponentProps<{retreatGuid: string}>
function RetreatItineraryPage(props: RetreatItineraryPageProps) {
  let classes = useStyles()

  let retreatGuid = convertGuid(props.match.params.retreatGuid)
  let retreat = useRetreat(retreatGuid) as RetreatModel | undefined

  let attendeeTravelInfo = useRetreatAttendees(retreatGuid)

  return (
    <RetreatRequired retreatGuid={retreatGuid}>
      <PageContainer>
        <PageSidenav
          activeItem="itinerary"
          retreatGuid={retreatGuid}
          companyName={retreat?.company_name}
        />
        <PageBody>
          <UnderConstructionView />
        </PageBody>
      </PageContainer>
    </RetreatRequired>
  )
}

export default withRouter(RetreatItineraryPage)
