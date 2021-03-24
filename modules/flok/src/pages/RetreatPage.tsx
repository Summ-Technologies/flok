import {Box, Grid, Hidden, makeStyles} from "@material-ui/core"
import {push} from "connected-react-router"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/PageBody"
import RetreatEmployeeOnboarding from "../components/retreats/RetreatEmployeeOnboarding"
import RetreatInitialProposals from "../components/retreats/RetreatInitialProposals"
import RetreatOnboardingCall from "../components/retreats/RetreatOnboardingCall"
import RetreatTimeline from "../components/retreats/RetreatTimeline"
import {AppRoutes} from "../Stack"
import RetreatGetters from "../store/getters/retreat"

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100%",
  },
  sidebar: {
    minHeight: "100%",
  },
  body: {
    minHeight: "100%",
  },
}))

type RetreatPageProps = RouteComponentProps<{
  item?: string
}>
function RetreatPage(props: RetreatPageProps) {
  const classes = useStyles()
  let dispatch = useDispatch()
  let userRetreat = useSelector(RetreatGetters.getRetreat)
  let currentRetreatToItem = useSelector(RetreatGetters.getInProgressItem)
  return userRetreat ? (
    <PageBody fullWidth>
      <Grid item container spacing={4} className={classes.container}>
        <Hidden xsDown>
          <Grid item sm={5} md={4} lg={3} className={classes.sidebar}>
            <RetreatTimeline retreatItems={userRetreat.retreatItems} />
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={7} md={8} lg={9} className={classes.body}>
          <Box paddingTop={4} height="100%">
            {currentRetreatToItem ? (
              currentRetreatToItem.retreatItem.type === "INTAKE_CALL" ? (
                <RetreatOnboardingCall />
              ) : currentRetreatToItem.retreatItem.type ===
                "EMPLOYEE_LOCATIONS" ? (
                <RetreatEmployeeOnboarding />
              ) : currentRetreatToItem.retreatItem.type ===
                "INITIAL_PROPOSALS" ? (
                <RetreatInitialProposals />
              ) : currentRetreatToItem.retreatItem.type ===
                "DESTINATION_SELECTION" ? (
                <>Here's some destinations</>
              ) : currentRetreatToItem.retreatItem.type === "POST_PAYMENT" ? (
                <>You paid sucker</>
              ) : undefined
            ) : undefined}
          </Box>
        </Grid>
      </Grid>
    </PageBody>
  ) : (
    <>{dispatch(push(AppRoutes.getPath("HomePage")))}</>
  )
}
export default withRouter(RetreatPage)
