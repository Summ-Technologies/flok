import {Breadcrumbs, Link, makeStyles} from "@material-ui/core"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import RetreatFlightsTable from "../components/retreats/RetreatFlightsTable"
import RetreatStateTitle from "../components/retreats/RetreatStateTitle"
import {AppRoutes} from "../Stack"
import {useRetreat, useRetreatAttendees} from "../utils"
type RetreatFlightsPageProps = RouteComponentProps<{
  retreatId: string
}>
let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  tabBody: {
    flex: "1 1 auto",
    minHeight: 0,
  },
}))

function RetreatFlightsPage(props: RetreatFlightsPageProps) {
  let classes = useStyles(props)
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404

  // Get retreat data
  let [retreat] = useRetreat(retreatId)
  let [retreatAttendees] = useRetreatAttendees(retreatId)
  return (
    <PageBase>
      <div className={classes.body}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatsPage")}
            component={ReactRouterLink}>
            All Retreats
          </Link>
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatPage", {
              retreatId: retreatId.toString(),
            })}
            component={ReactRouterLink}>
            {retreat?.company_name}
          </Link>
          <AppTypography color="textPrimary">Flights</AppTypography>
        </Breadcrumbs>
        {retreat && <RetreatStateTitle retreat={retreat} type="flights" />}
        {retreat && (
          <RetreatFlightsTable
            retreatAttendees={retreatAttendees}
            retreatId={retreatId}
          />
        )}
      </div>
    </PageBase>
  )
}
export default withRouter(RetreatFlightsPage)
